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
    const amplifyConfig = {
      repository: 'https://github.com/user/repo',
      accessToken: '123abc123abc123abc123abc',
    }
    const serverless = makeMockServerless({
      amplify: amplifyConfig
    })

    const serverlessAmplifyPluginInstance = new ServerlessAmplifyPlugin(serverless)
    serverlessAmplifyPluginInstance.addAmplify()
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
    expect(MyServiceAmplifyApp).toStrictEqual({
      "Type": "AWS::Amplify::App",
      "Properties": {
        "Name": "my-service",
        "Repository": amplifyConfig.repository,
        "AccessToken": amplifyConfig.accessToken,
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

    expect(MyServiceAmplifyDomain).toBeUndefined()
    expect(MyServiceAmplifyBranchUrl).toBeUndefined()
    expect(MyServiceAmplifyDefaultDomain).toStrictEqual({
      "Value": {
        "Fn::Sub": "${MyServiceAmplifyBranch.BranchName}.${MyServiceAmplifyApp.DefaultDomain}"
      }
    })
  })
  it('creates Amplify resources using all properties', () => {
    const amplifyConfig = {
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
    const serverless = makeMockServerless({
      amplify: amplifyConfig
    })

    const serverlessAmplifyPluginInstance = new ServerlessAmplifyPlugin(serverless)
    serverlessAmplifyPluginInstance.addAmplify()

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
        "Name": amplifyConfig.name,
        "Repository": amplifyConfig.repository,
        "AccessToken": amplifyConfig.accessToken,
        "BuildSpec": amplifyConfig.buildSpec
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
        "BranchName": amplifyConfig.branch,
        "EnableAutoBuild": amplifyConfig.enableAutoBuild
      }
    })

    expect(MyAppAmplifyDomain).toStrictEqual({
      "Type": "AWS::Amplify::Domain",
      "Properties": {
        "DomainName": amplifyConfig.domainName,
        "AppId": {
          "Fn::GetAtt": [
            "MyAppAmplifyApp",
            "AppId"
          ]
        },
        "SubDomainSettings": [
          {
            "Prefix": amplifyConfig.branch,
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
})