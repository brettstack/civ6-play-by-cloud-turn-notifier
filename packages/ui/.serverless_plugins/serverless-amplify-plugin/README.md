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
    accessToken: ${{env:GITHUB_PERSONAL_ACCESS_TOKEN}} # required
    branch: master # optional; default: master
    domainName: example.com # optional; 
    buildSpec: |- # optional; default: 
      version: 0.1
      frontend:
        ...
```

## Options

### repository (required)

The GitHub repository URL (`https://github.com/USER/REPO`) of the project for which you want to set up Continuous Deployment and hosting.

### accessToken

A <a href="https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line" target="_blank">GitHub Personal Access Token</a> with `repo` permissions. Amplify Console sets up a <a href="https://developer.github.com/webhooks/" target="_blank">GitHub Webhook</a> so that it can be notified of new commits to build and deploy any changes.

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