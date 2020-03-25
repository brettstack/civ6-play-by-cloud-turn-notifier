# serverless-amplify-plugin

A <a href="https://serverless.com/" target="_blank">Serverless Framework</a> plugin that provides simplified syntax for creating <a href="https://aws.amazon.com/amplify/console/" target="_blank">AWS Amplify Console</a> applications. Amplify console provides hosting and continuous deployment of static websites.

## Usage

```shell
npm i -D serverless-amplify-plugin
```

```yaml
# serverless.yaml
plugins:
  - serverless-amplify-plugin

custom:
  amplify:
    repository: https://github.com/USER/REPO # required
    accessTokenSecretName: AmplifyGithub # optional
    accessTokenSecretKey: accessToken # optional
    branch: master # optional
    domainName: example.com # optional;
    buildSpec: |- # optional
      version: 0.1
      frontend:
        ...
```

### 🔒 Securing your GitHub Personal Access Token Secret

It's important **not** to paste your GitHub Personal Access Token directly into the `accessToken` property. At a minimum, you should use `${{env:GITHUB_PERSONAL_ACCESS_TOKEN}}` along with the <a href="serverless-dotenv-plugin" target="_blank">serverless-dotenv-plugin</a>, however, this will still be visible in the CloudFormation template and logs.

The recommended way is to store your secret in <a href="https://aws.amazon.com/secrets-manager/" target="_blank">AWS Secrets Manager</a>. You can do this via the AWS Console or by running this command (ensure your profile and region are correct):

```shell
aws secretsmanager create-secret --name AmplifyGithub --secret-string '[{"personalAccessToken":"82dcc67482dcc67482dcc67482dcc67482dcc67482dcc674"}]'
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


### 🔒 accessToken  (required*)

A <a href="https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line" target="_blank">GitHub Personal Access Token</a> with `repo` permissions. Amplify Console sets up a <a href="https://developer.github.com/webhooks/" target="_blank">GitHub Webhook</a> so that it can be notified of new commits to build and deploy any changes.

🔒 This is a secret! It's recommended to store this in <a href="https://aws.amazon.com/secrets-manager/" target="_blank">AWS Secrets Manager</a>.

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

## Limitations and future considerations

This plugin is currently only written with a basic single branch setup in mind. In the future we'd like to add support for all of Amplify Console's features including:

1. Multiple branches
2. Multiple domains
3. PR Previews
4. Environment Variables
5. Email Notifications
6. Access Control
7. Rewrites and redirects