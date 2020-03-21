```yaml
plugins:
  - serverless-amplify-plugin

custom:
  amplify:
    repository: https://github.com/USER/REPO
    accessToken: ${{env:GITHUB_PERSONAL_ACCESS_TOKEN}}
    branch: master # optional; default: master
    domainName: example.com # optional
```