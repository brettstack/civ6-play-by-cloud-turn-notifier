# serverless-amplify-plugin

![Test and release](https://github.com/wizeline/serverless-amplify-plugin/workflows/Test%20and%20release/badge.svg) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

<p align="center">
  <img src="https://raw.githubusercontent.com/wizeline/serverless-amplify-plugin/master/wizeline-amplify-serverless-banner.png" alt="wizeline, serverless, and amplify banner">
</p>

A <a href="https://serverless.com/" target="_blank">Serverless Framework</a> plugin that enables you to easily host static websites with <a href="https://aws.amazon.com/amplify/console/" target="_blank">AWS Amplify Console</a> including Continuous Deployment in as few as 3 lines of YAML.

Developed and maintained by <a href="https://www.wizeline.com/" target="_blank">Wizeline</a>. Wizeline understands that great software is built by great people and teams. If you’d like to partner with Wizeline to build your software or expand your existing team with veteran engineers, project managers, technical writers, <a href="https://www.wizeline.com/contact/" target="_blank">reach out to our team</a>.

## Usage

### Install @wizeline/serverless-amplify-plugin:

```shell
npm i -D @wizeline/serverless-amplify-plugin
```

### Create/update your `serverless.yaml`:

```yaml
plugins:
  - serverless-amplify-plugin

custom:
  amplify:
    repository: https://github.com/USER/REPO # required
    accessTokenSecretName: AmplifyGithub # optional
    accessTokenSecretKey: accessToken # optional
    accessToken: ... # 🔒 optional
    branch: master # optional
    domainName: example.com # optional;
    buildSpec: |- # optional
      version: 0.1
      frontend:
        ...
    buildSpecValues: # optional
      artifactBaseDirectory: 'dist' # optional
      artifactFiles: ['**/*'] # optional
      preBuildWorkingDirectory: packages/ui # optional
```

### 🔒 Create your GitHub Personal Access Token and store it AWS Secrets Manager

It's important **not** to paste your GitHub Personal Access Token directly into the `accessToken` property. At a minimum, you should use `${{env:GITHUB_PERSONAL_ACCESS_TOKEN}}` along with the <a href="serverless-dotenv-plugin" target="_blank">serverless-dotenv-plugin</a>, however, this will still be visible in the CloudFormation template and logs.

The recommended way is to store your secret in <a href="https://aws.amazon.com/secrets-manager/" target="_blank">AWS Secrets Manager</a>. You can do this via the AWS Console or by running this command (ensure your profile and region are correct):

```shell
aws secretsmanager create-secret --name AmplifyGithub --secret-string '{"accessToken":"YOUR_GITHUB_PERSONAL_ACCESS_TOKEN"}' --profile YOUR_PROFILE --region YOUR_REGION
```

## Options

### repository (required)

The GitHub repository URL (`https://github.com/USER/REPO`) of the project for which you want to set up Continuous Deployment and hosting.

### accessTokenSecretName (optional)

Shorthand equivalent of `accessToken: '{{resolve:secretsmanager:AmplifyGithub:SecretString:personalAccessToken}}'` where:

```yaml
accessTokenSecretName: AmplifyGithub
accessTokenSecretKey: personalAccessToken
```

**Default**: AmplifyGithub

### accessTokenSecretKey (optional)

**Default:** accessToken

### 🔒 accessToken (optional)

A <a href="https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line" target="_blank">GitHub Personal Access Token</a> with `repo` permissions. Amplify Console sets up a <a href="https://developer.github.com/webhooks/" target="_blank">GitHub Webhook</a> so that it can be notified of new commits to build and deploy any changes.

🔒 This is a secret! It's recommended to store your access token in <a href="https://aws.amazon.com/secrets-manager/" target="_blank">AWS Secrets Manager</a> and reference it in this property with `accessToken: '{{resolve:secretsmanager:AmplifyGithub:SecretString:accessToken}}'`. Alternatively, specify `accessTokenSecretName` and `accessTokenSecretKey` properties.

### branch (optional)

Amplify Console is notified of changes to this branch.

**Default:** master

### domainName (optional)

When specified, Amplify Console sets up a custom domain name for your application. You will need to perform additional <a href="https://docs.aws.amazon.com/amplify/latest/userguide/howto-third-party-domains.html" target="_blank">steps to verify the domain with your DNS provider and approve the SSL Certificate</a>.

**Default:** None. When deployed, your website is accessible via a subdomain `https://{branchName}.{appId}.amplifyapp.com`.

### buildSpec (optional)

Amplify Console executes a build according to these instructions. See <a href="https://docs.aws.amazon.com/amplify/latest/userguide/build-settings.html" target="_blank">Configuring Build Settings</a> for more information.

**Default:** A standard build spec that runs `npm ci` and `npm run build` and expects build artifacts to be stored in `dist/`:

```yaml
version: 0.1
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
      - node_modules/**/*
```

### buildSpecValues (optional)

Specify values in the `buildSpec`. Useful so that you don't need to provide your own custom `buildSpec` if you just need to override some values that are commonly different between projects.

#### buildSpecValues.artifactBaseDirectory (optional)

Sets `frontend.artifacts.baseDirectory` in `buildSpec`.

**Default:** dist

#### buildSpecValues.artifactFiles (optional)

Sets `frontend.artifacts.files` in `buildSpec`.

**Default:** ['**/*']

#### buildSpecValues.preBuildWorkingDirectory (optional)

Adds a command to the `frontend.preBuild.commands` list in `buildSpec` that `cd`s into the path specified. This is especially helpful for Monorepos.

Note: You may also need to prefix **buildSpecValues.artifactBaseDirectory** with this same path if it builds into that directory.

**Default:** *None - uses project root*

## Limitations and future considerations

This plugin is currently only written with a basic single branch setup in mind. In the future we'd like to add support for all of Amplify Console's features including:

1. Multiple branches
2. Multiple domains
3. PR Previews
4. Environment Variables
5. Email Notifications
6. Access Control
7. Rewrites and redirects