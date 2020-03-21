const { pascalCase } = require('pascal-case')

class ServerlessAmplifyPlugin {
  constructor(serverless, options) {
    this.hooks = {
      'before:package:finalize': function () { addAmplify(serverless) }
    }
    this.variableResolvers = {
      amplify: {
        resolver: amplifyVariableResolver,
        isDisabledAtPrepopulation: true,
        serviceName: 'serverless-amplify..'
      }
    }
  }
}

function amplifyVariableResolver(src) {
  return src.slice('amplify:'.length)
}

function addAmplify(serverless) {
  const { service } = serverless
  const { custom, provider, serviceObject } = service
  const { amplify } = custom
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
    baseDirectory: dist
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
        "Fn::Sub": "${" + namePascalCase + "AmplifyBranch.BranchName}.${" + namePascalCase + "AmplifyDomain.DomainName}"
      }
    }
  }

  Outputs[[`${namePascalCase}AmplifyDefaultDomain`]] = {
    "Value": {
      "Fn::Sub": "${" + namePascalCase + "AmplifyBranch.BranchName}.${" + namePascalCase + "AmplifyApp.DefaultDomain}"
    }
  }
}

// now we need to make our plugin object available to the framework to execute
module.exports = ServerlessAmplifyPlugin