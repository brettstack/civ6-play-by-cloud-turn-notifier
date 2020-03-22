const { pascalCase } = require('pascal-case')

class ServerlessAmplifyPlugin {
  constructor(serverless, options) {
    this.serverless = serverless
    this.options = options
    // const credentials = serverless.providers.aws.getCredentials()
    // this.amplifySdk = new serverless.providers.aws.sdk.Amplify(credentials)
    this.hooks = {
      'before:package:finalize': () => this.addAmplify(),
      // TODO: Get correct hook to run after CloudFormation success
      'after:deploy:finalize': () => this.startFirstJob(),
    }
    this.variableResolvers = {
      amplify: {
        resolver: this.amplifyVariableResolver,
        isDisabledAtPrepopulation: true,
        serviceName: 'serverless-amplify..'
      }
    }
  }

  amplifyVariableResolver(src) {
    return src.slice('amplify:'.length)
  }

  addAmplify() {
    const { service } = this.serverless
    const { custom, provider, serviceObject } = service
    const { amplify } = custom
    const { defaultBuildSpecOverrides = {} } = amplify
    const {
      baseDirectory = 'dist'
    } = defaultBuildSpecOverrides
    const {
      buildSpec = `version: 0.1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: ${baseDirectory}
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*`,
      repository,
      accessToken,
      branch = 'master',
      domainName,
      enableAutoBuild = true,
      name = serviceObject.name
    } = amplify
    const { Resources, Outputs } = provider.compiledCloudFormationTemplate
    const namePascalCase = pascalCase(name)
    Resources[`${namePascalCase}AmplifyApp`] = {
      Type: 'AWS::Amplify::App',
      Properties: {
        Name: name,
        Repository: repository,
        AccessToken: accessToken,
        BuildSpec: buildSpec
      }
    }

    Resources[`${namePascalCase}AmplifyBranch`] = {
      Type: 'AWS::Amplify::Branch',
      Properties: {
        AppId: { 'Fn::GetAtt': [`${namePascalCase}AmplifyApp`, 'AppId'] },
        BranchName: branch,
        EnableAutoBuild: enableAutoBuild
      }
    }

    if (domainName) {
      Resources[`${namePascalCase}AmplifyDomain`] = {
        Type: 'AWS::Amplify::Domain',
        Properties: {
          DomainName: domainName,
          AppId: { 'Fn::GetAtt': [`${namePascalCase}AmplifyApp`, 'AppId'] },
          SubDomainSettings: [
            {
              Prefix: branch,
              BranchName: { 'Fn::GetAtt': [`${namePascalCase}AmplifyBranch`, 'BranchName'] }
            }
          ]
        }
      }

      Outputs[`${namePascalCase}AmplifyBranchUrl`] = {
        "Value": {
          "Fn::Sub": `\${${namePascalCase}AmplifyBranch.BranchName}.\${${namePascalCase}AmplifyDomain.DomainName}`
        }
      }
    }

    Outputs[[`${namePascalCase}AmplifyDefaultDomain`]] = {
      "Value": {
        "Fn::Sub": `\${${namePascalCase}AmplifyBranch.BranchName}.\${${namePascalCase}AmplifyApp.DefaultDomain}`
      }
    }
  }

  startFirstJob() {
    // this.amplifySdk.startJob
    // See https://github.com/schwamster/serverless-certificate-creator/blob/051a6e93a19b197a1a144eccbf401c85ef88f103/index.js for more examples
  }
}

module.exports = ServerlessAmplifyPlugin