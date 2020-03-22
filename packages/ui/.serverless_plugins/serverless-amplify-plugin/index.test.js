const _ = require('lodash')
const ServerlessAmplifyPlugin = require('./index')

function makeMockServerless({ amplify, overrides = {} }) {
  const serverlessBase = {
    // getProvider: ,
    service: {
      custom: {
        amplify: {}
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
    }
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
    const serverless = makeMockServerless({
      amplify: {
        repository: 'https://github.com/user/repo',
        accessToken: '123abc123abc123abc123abc',
      }
    })

    const serverlessAmplifyPluginInstance = new ServerlessAmplifyPlugin(serverless)
    serverlessAmplifyPluginInstance.addAmplify()
    const { MyServiceAmplifyApp, MyServiceAmplifyBranch } = serverless.service.provider.compiledCloudFormationTemplate.Resources
    expect(MyServiceAmplifyApp).toStrictEqual({
      "Type": "AWS::Amplify::App",
      "Properties": {
        "Name": "my-service",
        "Repository": "https://github.com/user/repo",
        "AccessToken": "123abc123abc123abc123abc",
        "BuildSpec": `version: 0.1
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
        "EnableAutoBuild": true
      }
    })
  })
  it('creates Amplify resources using all properties', () => {
    const serverless = makeMockServerless({
      amplify: {
        repository: 'https://github.com/user/repo',
        branch: 'dev',
        domainName: 'asdf',
        accessToken: '123abc123abc123abc123abc',
        enableAutoBuild: false,
        name: 'my-app',
        buildSpec: `version: 0.1
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
      }
    })

    const serverlessAmplifyPluginInstance = new ServerlessAmplifyPlugin(serverless)
    serverlessAmplifyPluginInstance.addAmplify()
    const { MyAppAmplifyApp, MyAppAmplifyBranch } = serverless.service.provider.compiledCloudFormationTemplate.Resources
    expect(MyAppAmplifyApp).toStrictEqual({
      "Type": "AWS::Amplify::App",
      "Properties": {
        "Name": "my-app",
        "Repository": "https://github.com/user/repo",
        "AccessToken": "123abc123abc123abc123abc",
        "BuildSpec": `version: 0.1
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
        "BranchName": "dev",
        "EnableAutoBuild": false
      }
    })
  })
})