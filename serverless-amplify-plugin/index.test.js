const _ = require('lodash')
const ServerlessAmplifyPlugin = require('./index')

const repository = 'https://github.com/user/repo'

beforeAll(() => {
  jest.spyOn(ServerlessAmplifyPlugin.prototype, 'packageWeb').mockImplementation(() => 'Hello')
  jest.spyOn(ServerlessAmplifyPlugin.prototype, 'describeStack').mockImplementation(() => 'Hello')
  jest.spyOn(ServerlessAmplifyPlugin.prototype, 'deployWeb').mockImplementation(() => 'Hello')
});

afterAll(() => {
  jest.restoreAllMocks();
});

function makeMockServerless({ amplify, overrides = {} } = {}) {
  const serverlessBase = {
    service: {
      custom: {
        amplify: {
          repository,
        }
      },
      serviceObject: {
        name: 'my-service'
      },
      provider: {
        compiledCloudFormationTemplate: {
          Resources: {},
          Outputs: {}
        }
      }
    },
    getProvider() { }
  }

  return _.merge(
    serverlessBase,
    {
      service: {
        custom: {
          amplify
        }
      }
    },
    overrides
  )
}

describe('happy path', () => {
  it('creates Amplify resources using only required properties', () => {
    const serverless = makeMockServerless()

    const serverlessAmplifyPluginInstance = new ServerlessAmplifyPlugin(serverless)
    serverlessAmplifyPluginInstance.hooks['before:aws:common:validate:validate']()
    serverlessAmplifyPluginInstance.hooks['before:package:finalize']()
    const { Resources, Outputs } = serverless.service.provider.compiledCloudFormationTemplate
    const {
      MyServiceAmplifyApp,
      MyServiceAmplifyBranch,
      MyServiceAmplifyDomain
    } = Resources
    const {
      MyServiceAmplifyBranchUrl,
      MyServiceAmplifyDefaultDomain
    } = Outputs
    const defaultBuildSpec = `version: 0.1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*`
    expect(MyServiceAmplifyApp).toStrictEqual({
      "Type": "AWS::Amplify::App",
      "Properties": {
        "Name": "my-service",
        "Repository": serverless.service.custom.amplify.repository,
        "AccessToken": '{{resolve:secretsmanager:AmplifyGithub:SecretString:accessToken}}',
        "BuildSpec": defaultBuildSpec
      }
    })

    expect(MyServiceAmplifyBranch).toStrictEqual({
      "Type": "AWS::Amplify::Branch",
      "Properties": {
        "AppId": {
          "Fn::GetAtt": [
            "MyServiceAmplifyApp",
            "AppId"
          ]
        },
        "BranchName": "master",
        "Stage": "PRODUCTION",
        "EnableAutoBuild": true
      }
    })

    expect(MyServiceAmplifyDomain).toBeUndefined()
    expect(MyServiceAmplifyBranchUrl).toBeUndefined()
    expect(MyServiceAmplifyDefaultDomain).toStrictEqual({
      "Value": {
        "Fn::Sub": "${MyServiceAmplifyBranch.BranchName}.${MyServiceAmplifyApp.DefaultDomain}"
      }
    })
  })
  it('creates Amplify resources using all properties', () => {
    const buildSpec = `version: 0.1
frontend:
phases:
  preBuild:
    commands:
      - npm ci
  build:
    commands:
      - npm run build
artifacts:
  baseDirectory: public
  files:
    - '**/*'`
    const amplifyConfig = {
      accessTokenSecretName: 'MySecret',
      accessTokenSecretKey: 'personalAccessToken',
      branch: 'dev',
      stage: 'BETA',
      domainName: 'asdf',
      enableAutoBuild: false,
      name: 'my-app',
      buildSpec
    }
    const serverless = makeMockServerless({
      amplify: amplifyConfig
    })

    const serverlessAmplifyPluginInstance = new ServerlessAmplifyPlugin(serverless)
    serverlessAmplifyPluginInstance.hooks['before:aws:common:validate:validate']()
    serverlessAmplifyPluginInstance.hooks['before:aws:common:validate:validate']()
    serverlessAmplifyPluginInstance.hooks['before:package:finalize']()

    const { Resources, Outputs } = serverless.service.provider.compiledCloudFormationTemplate
    const {
      MyAppAmplifyBranchUrl,
      MyAppAmplifyDefaultDomain
    } = Outputs
    const {
      MyAppAmplifyApp,
      MyAppAmplifyBranch,
      MyAppAmplifyDomain
    } = Resources
    expect(MyAppAmplifyApp).toStrictEqual({
      "Type": "AWS::Amplify::App",
      "Properties": {
        "Name": serverless.service.custom.amplify.name,
        "Repository": serverless.service.custom.amplify.repository,
        "AccessToken": '{{resolve:secretsmanager:MySecret:SecretString:personalAccessToken}}',
        "BuildSpec": serverless.service.custom.amplify.buildSpec
      }
    })

    expect(MyAppAmplifyBranch).toStrictEqual({
      "Type": "AWS::Amplify::Branch",
      "Properties": {
        "AppId": {
          "Fn::GetAtt": [
            "MyAppAmplifyApp",
            "AppId"
          ]
        },
        "BranchName": serverless.service.custom.amplify.branch,
        "Stage": "BETA",
        "EnableAutoBuild": serverless.service.custom.amplify.enableAutoBuild
      }
    })

    expect(MyAppAmplifyDomain).toStrictEqual({
      "Type": "AWS::Amplify::Domain",
      "Properties": {
        "DomainName": serverless.service.custom.amplify.domainName,
        "AppId": {
          "Fn::GetAtt": [
            "MyAppAmplifyApp",
            "AppId"
          ]
        },
        "SubDomainSettings": [
          {
            "Prefix": '',
            "BranchName": {
              "Fn::GetAtt": [
                "MyAppAmplifyBranch",
                "BranchName"
              ]
            }
          }
        ]
      }
    })

    expect(MyAppAmplifyBranchUrl).toStrictEqual({
      "Value": {
        "Fn::Sub": "${MyAppAmplifyBranch.BranchName}.${MyAppAmplifyDomain.DomainName}"
      }
    })
    expect(MyAppAmplifyDefaultDomain).toStrictEqual({
      "Value": {
        "Fn::Sub": "${MyAppAmplifyBranch.BranchName}.${MyAppAmplifyApp.DefaultDomain}"
      }
    })
  })
  it('creates buildSpec based on buildSpecValues', () => {
    const amplifyConfig = {
      buildSpecValues: {
        artifactBaseDirectory: 'public',
        artifactFiles: ['index.js', 'dist/**/*'],
        preBuildWorkingDirectory: 'packages/ui'
      }
    }
    const serverless = makeMockServerless({
      amplify: amplifyConfig
    })

    const serverlessAmplifyPluginInstance = new ServerlessAmplifyPlugin(serverless)
    serverlessAmplifyPluginInstance.hooks['before:aws:common:validate:validate']()
    serverlessAmplifyPluginInstance.hooks['before:package:finalize']()
    expect(serverless.service.provider.compiledCloudFormationTemplate.Resources.MyServiceAmplifyApp.Properties.BuildSpec).toStrictEqual(`version: 0.1
frontend:
  phases:
    preBuild:
      commands:
        - cd packages/ui
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: public
    files:
      - 'index.js'
      - 'dist/**/*'
  cache:
    paths:
      - node_modules/**/*`)
  })
  it('sets AccessToken based on accessToken', () => {
    const amplifyConfig = {
      accessToken: '123abc123abc123abc123abc123abc123abc'
    }
    const serverless = makeMockServerless({
      amplify: amplifyConfig
    })

    const serverlessAmplifyPluginInstance = new ServerlessAmplifyPlugin(serverless)
    serverlessAmplifyPluginInstance.hooks['before:aws:common:validate:validate']()
    serverlessAmplifyPluginInstance.hooks['before:package:finalize']()
    expect(serverless.service.provider.compiledCloudFormationTemplate.Resources.MyServiceAmplifyApp.Properties.AccessToken).toStrictEqual(serverless.service.custom.amplify.accessToken)
  })
  it('doesn\'t create an AWS::Amplify::Branch resource if branch is empty', () => {
    const amplifyConfig = {
      branch: ''
    }
    const serverless = makeMockServerless({
      amplify: amplifyConfig
    })

    const serverlessAmplifyPluginInstance = new ServerlessAmplifyPlugin(serverless)
    serverlessAmplifyPluginInstance.hooks['before:aws:common:validate:validate']()
    serverlessAmplifyPluginInstance.hooks['before:package:finalize']()
    expect(serverless.service.provider.compiledCloudFormationTemplate.Resources.MyServiceAmplifyBranch).toBeUndefined()
  })
})