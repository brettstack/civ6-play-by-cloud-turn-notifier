const util = require('util')
const path = require('path')
const { spawn } = require('child_process')
const fs = require('fs')
const archiver = require('archiver')
const { pascalCase } = require('pascal-case')
const { put } = require('request-promise')
const ora = require('ora')

// TODO: replace ora with this.serverless.cli.log()

const SERVERLESS_AMPLIFY_PLUGIN_META_FILE_PATH = '.serverless/serverless-amplify-plugin-meta.json'
const ZIP_FILE_PATH = '.serverless/ui.zip'
class ServerlessAmplifyPlugin {
  constructor(serverless, options) {
    this.serverless = serverless
    this.options = options

    this.hooks = {
      'before:aws:common:validate:validate': async () => {
        this.provider = this.serverless.getProvider('aws')
        this.setAmplifyOptions()
        this.namePascalCase = pascalCase(this.amplifyOptions.name)

        if (this.amplifyOptions.isManual) {
          const credentials = new this.serverless.providers.aws.sdk.SharedIniFileCredentials({ profile: this.provider.getProfile() })
          const amplifyClient = new this.serverless.providers.aws.sdk.Amplify({
            region: this.provider.getRegion(),
            credentials,
          })
          this.amplifyClient = amplifyClient

          await this.describeStack({ isPackageStep: true })

          this.isExistingStack = Boolean(this.amplifyAppId)
        }
      },
      'before:package:finalize': async () => {
        if (this.amplifyOptions.isManual) {
          // If the stack exists, package and create the deployment
          // During the package step, then execute the deployment
          // During the CloudFormation deployment
          if (this.isExistingStack) {
            await this.packageWeb()
            const { jobId } = await createAmplifyDeployment({
              amplifyClient: this.amplifyClient,
              appId: this.amplifyAppId,
              branchName: this.amplifyOptions.branch,
            })
            this.amplifyDeploymentJobId = jobId
            fs.writeFileSync(SERVERLESS_AMPLIFY_PLUGIN_META_FILE_PATH, JSON.stringify({
              amplifyDeploymentJobId: jobId,
            }))
          }
        }

        this.addAmplifyResources()
      },
      // Deploy after stack update for existing stacks
      'before:aws:deploy:deploy:updateStack': () => this.amplifyOptions.isManual && this.isExistingStack && this.deployWeb(),
      // Deploy after stack update for new stacks
      'after:aws:deploy:deploy:updateStack': () => this.amplifyOptions.isManual && !this.isExistingStack && this.deployWeb(),
      'after:rollback:initialize': () => this.amplifyOptions.isManual && this.rollbackAmplify(),
    }
    // this.commands = {
    //   deploy: {
    //     lifecycleEvents: ['deploy'],
    //   },
    // }
    this.variableResolvers = {
      amplify: {
        resolver: amplifyVariableResolver,
        isDisabledAtPrepopulation: true,
        serviceName: 'serverless-amplify..',
      },
    }
  }

  setAmplifyOptions() {
    const { serverless } = this
    const { service } = serverless
    const { custom, serviceObject } = service
    const { amplify } = custom
    const { buildSpecValues = {} } = amplify
    const {
      artifactBaseDirectory = 'dist',
      artifactFiles = ['**/*'],
      preBuildWorkingDirectory = '.',
    } = buildSpecValues
    const preBuildCommands = getPreBuildCommands(preBuildWorkingDirectory)

    const {
      repository,
      accessTokenSecretName = 'AmplifyGithub',
      accessTokenSecretKey = 'accessToken',
      accessToken = `{{resolve:secretsmanager:${accessTokenSecretName}:SecretString:${accessTokenSecretKey}}}`,
      branch = 'master',
      isManual = false,
      redirect404PagesToRoot = true,
      enableAutoBuild = !isManual,
      domainName,
      redirectNakedToWww = false,
      name = serviceObject.name,
      buildCommandEnvVars = {},
      stage = 'PRODUCTION',
      buildSpec = `version: 0.1
frontend:
  phases:
    preBuild:
      commands:${preBuildCommands}
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: ${artifactBaseDirectory}
    files:${getArtifactFilesYaml(artifactFiles)}
  cache:
    paths:
      - node_modules/**/*`,
    } = amplify

    buildCommandEnvVars.prefix = buildCommandEnvVars.prefix || ''
    buildCommandEnvVars.allow = buildCommandEnvVars.allow || []

    this.amplifyOptions = {
      repository,
      accessTokenSecretName,
      accessTokenSecretKey,
      accessToken,
      branch,
      isManual,
      redirect404PagesToRoot,
      domainName,
      enableAutoBuild,
      redirectNakedToWww,
      name,
      stage,
      buildSpec,
      artifactBaseDirectory,
      preBuildWorkingDirectory,
      buildCommandEnvVars,
    }
  }

  packageWeb() {
    return new Promise((resolve, reject) => {
      const envVars = {}
      const { buildCommandEnvVars } = this.amplifyOptions
      const allowedOutputs = this.outputs
        .filter((output) => buildCommandEnvVars.allow.includes(output.OutputKey))

      allowedOutputs.forEach((output) => {
        envVars[`${buildCommandEnvVars.prefix}${output.OutputKey}`] = output.OutputValue
      })

      const command = 'npm run build'
      let args = command.split(/\s+/)
      const cmd = args[0]
      args = args.slice(1)
      const baseDirectory = path.join(this.serverless.config.servicePath, this.amplifyOptions.preBuildWorkingDirectory)
      const execution = spawn(cmd, args, {
        cwd: baseDirectory,
        env: {
          ...process.env,
          ...envVars,
        },
        stdio: 'inherit',
      })
      execution.on('exit', (code) => {
        if (code === 0) {
          const zipSpinner = ora()
          zipSpinner.start(`Zipping to ${ZIP_FILE_PATH}...`)
          const output = fs.createWriteStream(ZIP_FILE_PATH)
          const buildDirectory = this.amplifyOptions.artifactBaseDirectory
          const archive = archiver('zip')
          output.on('close', () => {
            zipSpinner.succeed('UI zip created!')
            resolve(ZIP_FILE_PATH)
          })

          archive.on('error', (err) => {
            zipSpinner.fail(err)
            reject(err)
          })
          archive.pipe(output)
          archive.directory(buildDirectory, false)
          archive.finalize()
        } else {
          reject(code)
        }
      })
    })
  }

  async describeStack({ isPackageStep }) {
    const describeStackSpinner = ora()
    const stackName = util.format('%s-%s',
      this.serverless.service.getServiceName(),
      this.provider.getStage())
    describeStackSpinner.start('Getting stack outputs...')
    let stacks
    try {
      stacks = await this.provider.request(
        'CloudFormation',
        'describeStacks',
        { StackName: stackName },
        this.provider.getStage(),
        this.provider.getRegion(),
      )
    } catch (error) {
      if (isPackageStep) {
        describeStackSpinner.succeed(`Couldn't get stack ${stackName}. It might not yet exist.`)
      } else {
        describeStackSpinner.fail(`Couldn't get stack ${stackName}`)
      }
      return
    }
    const stack = stacks.Stacks[0]
    const { Outputs } = stack
    this.outputs = Outputs
    const amplifyDefualtDomainOutputKey = getAmplifyDefaultDomainOutputKey(this.namePascalCase)
    const amplifyDefualtDomainOutput = Outputs.find((output) => output.OutputKey === amplifyDefualtDomainOutputKey)

    if (!amplifyDefualtDomainOutput) {
      console.log(`Couldn't find ${amplifyDefualtDomainOutputKey} Output`)
      return
    }

    const amplifyDefualtDomainParts = amplifyDefualtDomainOutput.OutputValue.split('.')
    const amplifyAppId = amplifyDefualtDomainParts[1]

    describeStackSpinner.succeed(`Got Amplify App ID: ${amplifyAppId}`)

    this.amplifyAppId = amplifyAppId
  }

  async deployWeb() {
    // If this.amplifyDeploymentJobId isn't set, we can assume it's either a
    // new stack or we're deploying prepackaged via `sls deploy --package dir`
    if (!this.amplifyDeploymentJobId) {
      if (this.isExistingStack) {
        const serverlessAMplifyPluginMetaFilePath = path.join(this.serverless.config.servicePath, SERVERLESS_AMPLIFY_PLUGIN_META_FILE_PATH)
        const serverlessAmplifyPluginMeta = require(serverlessAMplifyPluginMetaFilePath)

        this.amplifyDeploymentJobId = serverlessAmplifyPluginMeta.amplifyDeploymentJobId
      } else {
        await this.describeStack({ isPackageStep: false })
        await this.packageWeb()
        const { jobId } = await createAmplifyDeployment({
          amplifyClient: this.amplifyClient,
          appId: this.amplifyAppId,
          branchName: this.amplifyOptions.branch,
        })
        this.amplifyDeploymentJobId = jobId
      }
    }

    return publishFileToAmplify({
      appId: this.amplifyAppId,
      branchName: this.amplifyOptions.branch,
      jobId: this.amplifyDeploymentJobId,
      amplifyClient: this.amplifyClient,
    })
  }

  addAmplifyResources() {
    const { namePascalCase, serverless } = this
    const { service } = serverless
    const { provider } = service
    const { Resources, Outputs } = provider.compiledCloudFormationTemplate
    const {
      repository,
      accessToken,
      branch,
      isManual,
      redirect404PagesToRoot,
      domainName,
      enableAutoBuild,
      redirectNakedToWww,
      name,
      stage,
      buildSpec,
    } = this.amplifyOptions

    addBaseResourcesAndOutputs({
      Resources,
      Outputs,
      name,
      isManual,
      redirect404PagesToRoot,
      isExistingStack: this.isExistingStack,
      amplifyDeploymentJobId: this.amplifyDeploymentJobId,
      repository,
      accessToken,
      buildSpec,
      namePascalCase,
    })

    if (branch) {
      addBranch({
        Resources,
        namePascalCase,
        branch,
        enableAutoBuild,
        stage,
      })
    }

    if (domainName) {
      addDomainName({
        Resources,
        Outputs,
        redirectNakedToWww,
        namePascalCase,
        domainName,
      })
    }
  }

  rollbackAmplify() { }
}

async function createAmplifyDeployment({
  amplifyClient,
  appId,
  branchName,
}) {
  const createAmplifyDeploymentSpinner = ora()
  createAmplifyDeploymentSpinner.start('Creating Amplify Deployment...')
  try {
    const params = {
      appId,
      branchName,
    }

    await cancelAllPendingJob(appId, branchName, amplifyClient)
    const { zipUploadUrl, jobId } = await amplifyClient
      .createDeployment(params)
      .promise()
    createAmplifyDeploymentSpinner.succeed('Amplify Deployment created!')
    const uploadToS3Spinner = ora()
    uploadToS3Spinner.start('Uploading UI package to S3...')
    await httpPutFile(ZIP_FILE_PATH, zipUploadUrl)
    uploadToS3Spinner.succeed('UI Package uploaded to S3!')
    return { jobId }
  } catch (error) {
    createAmplifyDeploymentSpinner.fail('Failed creating Amplify Deployment')
    throw error
  }
}

async function publishFileToAmplify({
  appId,
  branchName,
  jobId,
  amplifyClient,
}) {
  const DEPLOY_ARTIFACTS_MESSAGE = 'Deploying build artifacts to the Amplify Console..'
  const DEPLOY_COMPLETE_MESSAGE = 'Deployment complete!'
  const DEPLOY_FAILURE_MESSAGE = 'Deployment failed!'

  const publishSpinner = ora()
  try {
    const params = {
      appId,
      branchName,
    }
    publishSpinner.start(DEPLOY_ARTIFACTS_MESSAGE)
    await amplifyClient.startDeployment({ ...params, jobId }).promise()
    await waitJobToSucceed({ ...params, jobId }, amplifyClient)
    publishSpinner.succeed(DEPLOY_COMPLETE_MESSAGE)
  } catch (err) {
    publishSpinner.fail(DEPLOY_FAILURE_MESSAGE)
    throw err
  }
}

async function cancelAllPendingJob(appId, branchName, amplifyClient) {
  const params = {
    appId,
    branchName,
  }
  const { jobSummaries } = await amplifyClient.listJobs(params).promise()
  for (const jobSummary of jobSummaries) {
    const { jobId, status } = jobSummary
    if (status === 'PENDING' || status === 'RUNNING') {
      const job = { ...params, jobId }
      await amplifyClient.stopJob(job).promise()
    }
  }
}

function waitJobToSucceed(job, amplifyClient) {
  return new Promise(async (resolve, reject) => {
    const timeout = setTimeout(() => {
      console.log('Job Timeout before succeeded')
      reject()
    }, 1000 * 60 * 10)
    let processing = true
    try {
      while (processing) {
        const getJobResult = await amplifyClient.getJob(job).promise()
        const jobSummary = getJobResult.job.summary
        if (jobSummary.status === 'FAILED') {
          console.log(`Job failed.${JSON.stringify(jobSummary)}`)
          clearTimeout(timeout)
          processing = false
          resolve()
        }
        if (jobSummary.status === 'SUCCEED') {
          clearTimeout(timeout)
          processing = false
          resolve()
        }
        await sleep(1000 * 3)
      }
    } catch (err) {
      processing = false
      reject(err)
    }
  })
}

function sleep(ms) {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(resolve, ms)
    } catch (err) {
      reject(err)
    }
  })
}

async function httpPutFile(filePath, url) {
  await put({
    body: fs.readFileSync(filePath),
    url,
  })
}

function getAmplifyDefaultDomainOutputKey(namePascalCase) {
  return `${namePascalCase}AmplifyDefaultDomain`
}

function getAmplifyDeploymentJobIdOutputKey(namePascalCase) {
  return `AmplifyDeploymentOutputKey`
}

function addBaseResourcesAndOutputs({
  Resources,
  name,
  isManual,
  redirect404PagesToRoot,
  isExistingStack,
  amplifyDeploymentJobId,
  repository,
  accessToken,
  buildSpec,
  Outputs,
  namePascalCase,
}) {
  Resources[`${namePascalCase}AmplifyApp`] = {
    Type: 'AWS::Amplify::App',
    Properties: {
      Name: name,
      BuildSpec: buildSpec,
    },
  }

  if (redirect404PagesToRoot) {
    Resources[`${namePascalCase}AmplifyApp`].Properties.CustomRules = [{
      Source: '</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|ttf|json|map)$)([^.]+$)/>',
      Target: '/',
      Status: 200
    }]
  }

  if (!isManual) {
    Resources[`${namePascalCase}AmplifyApp`].Properties.Repository = repository
    Resources[`${namePascalCase}AmplifyApp`].Properties.AccessToken = accessToken
  } else if (isExistingStack && amplifyDeploymentJobId) {
    Outputs[getAmplifyDeploymentJobIdOutputKey(namePascalCase)] = {
      Value: amplifyDeploymentJobId,
    }
  }

  Outputs[getAmplifyDefaultDomainOutputKey(namePascalCase)] = {
    Value: {
      'Fn::Sub': `\${${namePascalCase}AmplifyBranch.BranchName}.\${${namePascalCase}AmplifyApp.DefaultDomain}`,
    },
  }
}

function addBranch({
  Resources,
  namePascalCase,
  branch,
  enableAutoBuild,
  stage,
}) {
  Resources[`${namePascalCase}AmplifyBranch`] = {
    Type: 'AWS::Amplify::Branch',
    Properties: {
      AppId: { 'Fn::GetAtt': [`${namePascalCase}AmplifyApp`, 'AppId'] },
      BranchName: branch,
      EnableAutoBuild: enableAutoBuild,
      Stage: stage,
    },
  }
}

function addDomainName({
  Resources,
  Outputs,
  redirectNakedToWww,
  namePascalCase,
  domainName,
}) {
  if (redirectNakedToWww) {
    Resources[`${namePascalCase}AmplifyApp`].Properties.CustomRules = {
      Source: `https://${domainName}`,
      Target: `https://www.${domainName}`,
      Status: '302',
    }
  }

  Resources[`${namePascalCase}AmplifyDomain`] = {
    Type: 'AWS::Amplify::Domain',
    Properties: {
      DomainName: domainName,
      AppId: { 'Fn::GetAtt': [`${namePascalCase}AmplifyApp`, 'AppId'] },
      SubDomainSettings: [
        {
          Prefix: '',
          BranchName: { 'Fn::GetAtt': [`${namePascalCase}AmplifyBranch`, 'BranchName'] },
        },
      ],
    },
  }

  Outputs[`${namePascalCase}AmplifyBranchUrl`] = {
    Value: {
      'Fn::Sub': `\${${namePascalCase}AmplifyBranch.BranchName}.\${${namePascalCase}AmplifyDomain.DomainName}`,
    },
  }
}

function amplifyVariableResolver(src) {
  return src.slice('amplify:'.length)
}

function getArtifactFilesYaml(artifactFiles) {
  return artifactFiles
    .map((artifactFile) => `
      - '${artifactFile}'`)
    .join('')
}

function getPreBuildCommands(preBuildWorkingDirectory) {
  const cdWorkingDirectoryCommand = preBuildWorkingDirectory && preBuildWorkingDirectory !== '.' ? `cd ${preBuildWorkingDirectory}` : null
  const commands = [
    cdWorkingDirectoryCommand,
    'npm ci',
  ]
  return commands
    .filter((command) => command)
    .map((command) => `
        - ${command}`)
    .join('')
}

module.exports = ServerlessAmplifyPlugin
