# Wizeline Serverless Amplify Plugin - Basic Example

This example showcases how to get a basic website up and running with AWS Amplify Console, Serverless Framework, and the Wizeline Serverless Amplify Plugin.

## Running and deploying the example

To run the example locally, simply perform the following:

1. Clone the repository:
    ```shell
    git clone https://github.com/wizeline/serverless-amplify-plugin/`
    ```
2. Install the example dependencies and run the start command:
    ```shell
    cd serverless-amplify-plugin
    npm i
    npm start
    ```

At this point we're simply running the example app locally. To deploy the website, we need to do the following:

1. Create a new GitHub repository and copy this example app to the repository root
2. [Create a GitHub Personal Access Token](https://github.com/settings/tokens/new) with `repo` scope and store it as a secret in AWS Secrets Manager:
    ```shell
    aws secretsmanager create-secret --name AmplifyGithub --secret-string '{"accessToken":"YOUR_GITHUB_PERSONAL_ACCESS_TOKEN"}'
    ```
3. Update `serverless.yaml` to point to your new `repository`, and remove the `examples/basic/` prefix from the `buildSpecValues` entries.
4. Run `npx serverless deploy` 🚀
5. Run `serverless info -v` and copy-paste the `...DefaultDomain` output value into your browser 🎉

## Building the example from scratch

This basic example was built by performing the following steps:

1. Create a new GitHub repository and clone it to your local machine
2. [Create a GitHub Personal Access Token](https://github.com/settings/tokens/new) with `repo` scope and store it as a secret in AWS Secrets Manager:
    ```shell
    aws secretsmanager create-secret --name AmplifyGithub --secret-string '{"accessToken":"YOUR_GITHUB_PERSONAL_ACCESS_TOKEN"}'
    ```
3. Run `npx create-react-app .`
4. Install serverless and @wizeline/serverless-amplify-plugin:
    ```shell
    npm i -D serverless @wizeline/serverless-amplify-plugin
    ```
5. Create a `serverless.yaml` file with the following:
    ```yaml
    service: wizeline-serverless-amplify-plugin-basic-example
    provider:
      name: aws
    plugins:
      - @wizeline/serverless-amplify-plugin

    custom:
      amplify:
        repository: https://github.com/YOUR_GIT_USER/YOUR_GIT_REPO
        # 👆 Change this to point to your new GitHub repository
        buildSpecValues:
          artifactBaseDirectory: build
          # 👆 create-react-app builds to a `build` directory instead of the default `dist`
    ```
6. Run `npx serverless deploy` 🚀
7. Run `serverless info -v` and copy-paste the `...DefaultDomain` output value into your browser 🎉