```yaml
plugins:
  - serverless-amplify-plugin

custom:
  amplify:
    repository: https://github.com/USER/REPO
    accessToken: ${{env:GITHUB_PERSONAL_ACCESS_TOKEN}}
    branch: master # optional; default: master
    domainName: example.com # optional
    buildSpec: |- # optional
      version: 0.1
      frontend:
        ...
```

Default BuildSpec

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