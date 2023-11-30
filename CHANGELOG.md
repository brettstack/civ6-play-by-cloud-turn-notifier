## [1.13.8](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.13.7...v1.13.8) (2023-11-30)


### Bug Fixes

* remove alarms ([6684b8b](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/6684b8b55a4c1d53f52d72475690646e53853447))

## [1.13.7](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.13.6...v1.13.7) (2023-11-30)


### Bug Fixes

* force release ([23ac04a](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/23ac04aefda9151c9d9bfea1bb174cd67b7a0d31))

## [1.13.6](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.13.5...v1.13.6) (2023-11-30)


### Bug Fixes

* force release ([123b06e](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/123b06ea157ed6fbd05e011cac35a518733afc3a))

## [1.13.5](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.13.4...v1.13.5) (2023-11-30)


### Bug Fixes

* add code genie mention ([d6e200e](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/d6e200ed2c9abf4c30c557bd621b2aed1fd9c9b8))
* remove npm audit ([7a8306d](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/7a8306d7224177a05d080242207e8ba5a1c51018))
* update to node 16 ([e3b2996](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/e3b29964a9a6765fdd030517e126c18ebe5ff59a))

## [1.13.4](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.13.3...v1.13.4) (2021-04-12)


### Bug Fixes

* **ui:** fix submit refreshing page in firefox ([63a0469](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/63a0469b57e04a89e0658565ef79d58745bd36e5))
* **ui:** fix submit refreshing page in firefox ([af9ebd1](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/af9ebd1bb0d7416f13b16c8a5e1a761902b6ed79))

## [1.13.3](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.13.2...v1.13.3) (2021-02-07)


### Bug Fixes

* update dependencies ([87b652f](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/87b652f1daf2a69dcbb205dbdc3b519d259475e4))

## [1.13.2](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.13.1...v1.13.2) (2021-02-07)


### Bug Fixes

* cleanup; handle additional discord 4xx; adjust alarms; use serverless-amplify-plugin package; automerge dependabot; fix PR sandbox stacks ([ade08ea](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/ade08ea4586a25522e3d7bebc6e71152102ab5aa))

## [1.13.1](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.13.0...v1.13.1) (2021-01-17)


### Bug Fixes

* add Lambda Insights ([a18d47a](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/a18d47a90ef09a7f7f5235beecceff2ca9311e88))
* fix manifest and sourcemaps loading in UI ([c56151a](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/c56151a452635ecb539bf06e9586df058f6e8b93))
* optimize lambda+sqs integration ([77b5bbc](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/77b5bbcf307b518e89d5327dbb5ab6e43dc4ed4b))

# [1.13.0](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.12.2...v1.13.0) (2021-01-11)


### Bug Fixes

* add ingestionTime to error log and log game in PROCESS_MESSAGE:ERROR_PROCESSING_NOT_OK_RESPONSE ([94ab57e](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/94ab57e79b82f72a5560c66d2e5a4369c5dcdc5f))
* change lambda functions to 128MB ([9f9972d](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/9f9972d23b51f6e03a96daf9630ee5c48727c6ce))
* increase lambda duration to 20s ([040554b](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/040554b3d03df05d931386c8f3248a1758a0c42d))
* update lambda function memorySizes ([66b45b2](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/66b45b28ba15331b73708b202eeab08e66c18f19))
* **ops:** add cost alert; tweak duration alarm; update dashboard ([7b4ae4a](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/7b4ae4aa8f88627e7b608cbf5bacce21ec301ab6))


### Features

* set NONE discordWebhookUrl when one doesn't exist; test with dynalite ([226b326](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/226b32644b2b5799736e98b7fbc112f83967d1eb))
* update to serverless@2 and @vendia/serverless-express@4.rc ([572ba79](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/572ba795dc4f5a78078e1d6a37da39c51d594fc9))

## [1.12.2](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.12.1...v1.12.2) (2021-01-01)


### Bug Fixes

* fix ApiEndpoint output ([8d77f0a](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/8d77f0a41b50979a230e74d42af85dc44b643a4b))

## [1.12.1](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.12.0...v1.12.1) (2021-01-01)


### Bug Fixes

* add MainTable (unused) ([e795d65](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/e795d656f9ff61b3223d5997969e8835e8687e05))
* add missing import dynamodb-toolbox ([1cc806c](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/1cc806c5f240e724e9b805c4f53fbf62485b67a1))

# [1.12.0](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.11.3...v1.12.0) (2020-12-31)


### Bug Fixes

* add required to discordWebhookUrl ([b2aeb77](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/b2aeb776644c647c50ecc7a558957f68cdcf47e5))
* mark game as inactive if it doesn't have a discordWebhookUrl ([6581051](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/6581051ee55f027a21a595654501bef19ae1ec3a))
* **dashboard:** add no-notifications-sent alarm ([de45031](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/de4503107f4ba5351b78c00a857a1da2e0de1261))
* **dashboard:** fix no-notifications-sent alarm ([d0f4e27](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/d0f4e27f9a27f22dc385846259033db2ce70c2f5))
* update player length to 12 ([90dca4d](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/90dca4d0c0be5f7873c94093dee6a42084ae09f0))
* **dashboard:** fix positioning and logs ([82c3d37](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/82c3d37d941cf4500532385c84f34bfadb758d30))


### Features

* **ops:** add NoGamesCreated alarm ([76c298f](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/76c298fdd98553aab1974b41877c4d45cd511eb4))
* add custom logger to api lambda ([893c8f6](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/893c8f6196df5c603cf51bfbfdda67ed361a3aab))
* add logging to api lambda ([f8265db](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/f8265db718fd7f70c9595b99f18dfc92e121e86a))
* use serverless-express@v4 ([af83ff8](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/af83ff89efa9d98e072fbdc3c91db1bde1f4592d))

## [1.11.3](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.11.2...v1.11.3) (2020-12-27)


### Bug Fixes

* **dashboard:** add active games widget ([4628ee1](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/4628ee198a9dd5938e59adfb92155d81febdb7b4))

## [1.11.2](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.11.1...v1.11.2) (2020-12-27)


### Bug Fixes

* **alarm:** increase duration alarm to 5000 ([acc7584](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/acc7584d056d76a9fcaf85248dde97dd6c91baec))

## [1.11.1](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.11.0...v1.11.1) (2020-12-27)


### Bug Fixes

* **dashboard:** minor improvements to log widget ([3e1decc](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/3e1decc20e5882210d3c517ca0dc3181332b430d))
* minor dashboard improvements ([4a086d9](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/4a086d97d8cb2307601161ff1c9370d522abc56d))
* treat NO_GAME_FOUND as client error (don't throw) ([22794e7](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/22794e7873a52a40e7b82a3079a9f0fa86589fae))

# [1.11.0](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.10.2...v1.11.0) (2020-12-24)


### Bug Fixes

* **alarms:** remove throttle alarm ([7ca9720](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/7ca9720a0303586a3f3b98122f2c2a4ce8807780))
* **ui:** fix typos ([d52927b](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/d52927bc1245bed6d55d28a46fc167c17f5d197b))
* **ui:** respect user preference for dark/light modoe ([1907211](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/1907211b352977d6cbd06571d4bae4380f1f7ae3))


### Features

* **ui:** dark mode ([6f7dc56](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/6f7dc56b90ccb73e626697bfdcde06de94747537))

## [1.10.2](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.10.1...v1.10.2) (2020-12-24)


### Bug Fixes

* change function duration alarm ([c3459d2](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/c3459d22d218d75a7b752df710ca52d12771deda))

## [1.10.1](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.10.0...v1.10.1) (2020-12-23)


### Bug Fixes

* add min, avg max webhook duration to dashboard ([7c8ae72](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/7c8ae7290ae790e0531a02932c98c917d2b687a8))
* fix duration and num dlq messages widgets ([d28cd96](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/d28cd966898f635cfe2412e15c76189fb03ce305))
* return null in getGame when game doesn't exist ([06ee810](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/06ee8108c94c6dc54b85c13a348e9af9b95e0cd2))
* show existing player mappings ([0c39c14](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/0c39c1435eced689eb56d57707c5abd180449a1d))

# [1.10.0](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.9.2...v1.10.0) (2020-12-23)


### Features

* add metrics and dashboard ([1e599ca](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/1e599cac9891c2a84781e08029bed3b21ec0ef7f))

## [1.9.2](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.9.1...v1.9.2) (2020-12-22)


### Bug Fixes

* add link for getting discord user id ([aca05fd](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/aca05fd78f9105dc20d518a8ad267d1fb1f97243)), closes [#21](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/issues/21)

## [1.9.1](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.9.0...v1.9.1) (2020-12-22)


### Bug Fixes

* fix Lambda source maps ([4b725dd](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/4b725ddba458c6d9db2d278b2f69d31ce9f0473d))

# [1.9.0](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.8.3...v1.9.0) (2020-12-22)


### Features

* mark games as inactive when discord webhook doesn't exist ([#32](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/issues/32)) ([8b3d298](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/8b3d298c79c8bdab62eede22e5e6fb0ea6d666a5))

## [1.8.3](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.8.2...v1.8.3) (2020-12-21)


### Bug Fixes

* **ui:** use REACT_APP_ApiEndpoint even in development mode ([775a477](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/775a4779877dc7c7ae1c63e3ea39b836672733a8))

## [1.8.2](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.8.1...v1.8.2) (2020-12-21)


### Bug Fixes

* **ci:** include serverless-amplify-plugin in release ([f6d2aec](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/f6d2aeca1fd075c7cfb5b583c9f4a46c04f8dbb4))

## [1.8.1](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.8.0...v1.8.1) (2020-12-21)


### Bug Fixes

* **ci:** rename actions ([5114c0a](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/5114c0a83ba641265cb3203a9ead78fcdfdfa682))

# [1.8.0](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.7.3...v1.8.0) (2020-12-20)


### Features

* add custom domain name ([9d928e8](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/9d928e8ba90da14dafd0a72ca3792541c0768616))
* add retainDataResources and pointInTimeRecoveryEnabled ([8eaadcd](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/8eaadcdb470c34a761045fc2a4cd6b154668a447))
* add serverless-amplify-plugin ([0cddaca](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/0cddaca6fdcb546beb7235c579b4572a9dbba6a6))
* large refactor ([40d9b77](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/40d9b77a9277ad8cb5096be59b5c460be108e063))

## [1.7.3](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.7.2...v1.7.3) (2020-12-16)


### Bug Fixes

* retain dynamodb table when stack is deleted ([de8011f](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/de8011f17ea6c7d8a76e7902d8e877d52cfc75d8))

## [1.7.2](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.7.1...v1.7.2) (2020-11-20)


### Bug Fixes

* remove IS_OFFLINE default empty value ([bcfb124](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/bcfb124001f5f82653d4b47c8bee0d9f92b0948a))

## [1.7.1](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.7.0...v1.7.1) (2020-11-20)


### Bug Fixes

* log errors ([a37f93b](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/a37f93b5c897830c360f5dc86a23bf79a0896e9c))

# [1.7.0](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.6.6...v1.7.0) (2020-11-20)


### Bug Fixes

* increase webhook function memory to 256 and set log retention ([afe5f01](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/afe5f010cc462af6c991cf07c38267e06e009196))
* npm audit fix ([9da7770](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/9da7770fbe468da87c75cb74ee2f5751cbd40dbc))


### Features

* add logging to webhook handler ([b4f09d5](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/b4f09d5bc1a3ff1971f635534c27966733beb38f))

## [1.6.6](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.6.5...v1.6.6) (2020-11-17)


### Bug Fixes

* fix amplify buildspec ([83a1df0](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/83a1df0c1ef14a44bf9414d9ca7fdb273e85eae2))

## [1.6.5](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.6.4...v1.6.5) (2020-11-16)


### Bug Fixes

* redirect ui routes to / and let client router take over ([bb9b42b](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/bb9b42b5252b25f241e5e14c1f17b70adb95b1db))

## [1.6.4](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.6.3...v1.6.4) (2020-11-16)


### Bug Fixes

* save players map as { discordUserId } instead of discordUserId ([9c95caf](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/9c95cafdbcc2e884f41030339b56452e4af9ba8c))

## [1.6.3](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.6.2...v1.6.3) (2020-11-16)


### Bug Fixes

* fix amplify buildspec ([75679a0](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/75679a091efa8ab490d743ad14490cdb1a267e99))

## [1.6.2](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.6.1...v1.6.2) (2020-11-16)


### Bug Fixes

* fix amplify buildspec ([6ff84fd](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/6ff84fdb603e7d15672562aba88e97cab333d3ff))

## [1.6.1](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.6.0...v1.6.1) (2020-11-16)


### Bug Fixes

* fix amplify buildspec ([e3dc515](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/e3dc515e096827f3340bf1dca753af38cfcc6c72))
* fix amplify buildspec ([8853e9d](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/8853e9d3d76bf9adbb46311704a6dff05dbc28ae))

# [1.6.0](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.5.0...v1.6.0) (2020-11-16)


### Features

* add player config (wip) ([f794c70](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/f794c70377da17330dee0d47b2fd2537ec5e81c8))
* add players config to UI and API ([c6dcb1a](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/c6dcb1aa4bea6bcac3347b1ebfb958f4e7b08676))

# [1.5.0](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.4.0...v1.5.0) (2020-11-13)


### Bug Fixes

* fix build ([6f6c914](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/6f6c914aa9255d1adf6780580a968b0c486c1d02))
* npm audit fix ([4cdb097](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/4cdb0972927b9b43211a02255615e56651e456f5))
* **api:** npm audit fix depth ([8a04ed1](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/8a04ed10d578857ad03d5b6aa910539ba8b2d29f))
* **ui:** npm audit fix depth ([26c07fd](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/26c07fd52cb6343ea06fd14cf00af65317f04da2))
* npm audit fix ([917a446](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/917a44619ddd7fe7ee46a936fce63165fc0a5632))


### Features

* add contact and feedback section to service ([803032a](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/803032a08fedba6929bcc00bb69e0474b2ce4c77))
* add game route ([c0d1e98](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/c0d1e98e27f59c87a5c478759c68860a74e7fe51))
* add players config to webhook lambda ([ae4ea08](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/ae4ea0889e83fefaa204e4821d455043b5ef64b3))

# [1.4.0](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.3.0...v1.4.0) (2020-06-13)


### Features

* add dashboard ([c28e2ab](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/c28e2ab0bb5b5e9ddb8cf75ba9dda7cf722ead96))

# [1.3.0](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.2.0...v1.3.0) (2020-06-13)


### Features

* add dashboard ([68cbe64](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/68cbe64f9103e42b83b105e50b52207abdc9970c))

# [1.2.0](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.1.1...v1.2.0) (2020-06-13)


### Features

* add additional content/instructions/faq to ui ([baa66c8](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/baa66c8c1ce4931d762bf8345eff41bc1805f310))

## [1.1.1](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.1.0...v1.1.1) (2020-06-11)


### Bug Fixes

* improve content ([679050c](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/679050c481052a5359ded421ced3b084abe3ea3d))

# [1.1.0](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.0.5...v1.1.0) (2020-06-09)


### Bug Fixes

* npm audit fix ([e57bcf9](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/e57bcf970f55d26232f659406f8001c6b46f9940))
* npm audit fix ([1feeebf](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/1feeebfec58fa61c2ac7642a4fdd69852dcb19e8))


### Features

* add google analytics ([329bd2e](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/329bd2e35d8e374041e4b32e0cac5164fe35c542))

## [1.0.5](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.0.4...v1.0.5) (2020-04-15)


### Bug Fixes

* update dependencies ([034f14c](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/034f14c804fbd9fbf664478d3c9c19cd79353a86))
* update dependencies ([9167076](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/9167076d868361d478e710a34947640cafe27f92))

## [1.0.4](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.0.3...v1.0.4) (2020-04-15)


### Bug Fixes

* **ui:** wrap @wizeline/serverless-amplify-plugin in quotes ([c8a8054](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/c8a805435c77b0a84098d408331abdd719cbf0f5))
* use @wizeline/serverless-amplify-plugin from npm ([f3284fe](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/f3284fe0fda71a9156d851749d6b0f620c73a6aa))

## [1.0.3](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.0.2...v1.0.3) (2020-04-12)


### Bug Fixes

* add link to civilization.com ([90627fc](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/90627fc9d21b4cf4590f7d0e58d9adbc4708021d))

## [1.0.2](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.0.1...v1.0.2) (2020-04-12)


### Bug Fixes

* rename serverless.yml to .yaml ([59f5a27](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/59f5a279b40370f211a6c275c46b9238b9ee5572))

## [1.0.1](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/compare/v1.0.0...v1.0.1) (2020-04-12)


### Bug Fixes

* add explanation to the UI ([d815348](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/d81534869b997241ef6edb55e467d60420f77ccf))

# 1.0.0 (2020-04-11)


### Bug Fixes

* throw error on game not found and fix tests ([79195ef](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/79195ef9774133fe56ed53fe7bc8a19e160e9269))
* update website name and description ([d2bf781](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/d2bf78175023f4411e94fab6d55ee58e97378ee3))
* **ui:** fix copy pbc url to clipboard ([7d02c02](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/7d02c025224a510d11522e555b1888b8c7fb346e))
* **ui:** fix webhook url format ([b52432c](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/b52432c4617848d531019f1aa4ae9501397614fc))
* fix amplify resource; OauthToken => AccessToken ([9e4ccaa](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/9e4ccaa6fb6e44791c9d4e85bf669afca907ecfa))
* fix ui serverless artifacts buildSpec ([79d46e0](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/79d46e0467b3f2f64bfd4c05298c5b6b4f1476af))
* improve discord message ([713e08f](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/713e08fd2d8b53e013b4634d1359345d0dd5d4da))
* manually delete successfully processed messages from the queue ([9ce60af](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/9ce60af5dd547c98949327621e06765bbf268f0c))
* move startFirstJob to after:deploy:finalize hook ([4006ebc](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/4006ebc7115ab618c3d9710a87765168d851c5c7))
* rename App2.js to App.js ([3b4f62b](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/3b4f62b93ec0af873c54d41de18a66cf21cc1b85))


### Features

* add instructions to UI ([5978b3f](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/5978b3f0c807e79ec3e9817d6263ece8e98f86ce))
* use shortid instead of guid for Game id ([cd1227f](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/cd1227fad2545606cc0e11f62ce18c0e2c3415bf))
* **api:** add express api with post /game endpoint ([a4d20b0](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/a4d20b0dd20fd709dad60218196666d3ced74c1d))
* **api:** update webhook to query Game table for discord webhook ([176a6fa](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/176a6fa316e011c0f5c9847272bec2a99cb7d3a7))
* **serverless-amplify-plugin:** add shorthand accessTokenSecretName and accessTokenSecretKey ([0282185](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/0282185c68ab7887aea2777e10aa43810292d827))
* **serverless-amplify-plugin:** change domain to use empty prefix ([a3968f3](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/a3968f38f223d72dcad1770fcd49bfac791e751e))
* **ui:** add generate pbc webhook and copy to clipboard ([741a06e](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/741a06eb9a3947d07b8837a7a98220624869f65d))
* **ui:** use production api when ui is built for production ([b7fcaeb](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/b7fcaeb76f4c43702d6bf7688f03053483e506b7))
* add api gateway logs ([49a929d](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/49a929d5f136342b2305caafc4301d44c3437e9c))
* add custom domain name ([acc2f70](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/acc2f709c287968304e7d65062bf9a9b18df91bb))
* add defaultBuildSpecOverrides ([6b6cd54](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/6b6cd541ddf499228de716abdcaf27d1ec9d9aea))
* add discord webhook ([2ab3cd0](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/2ab3cd09416b70a55521c3e46ac81c539e713c44))
* add GeneratePlayByCloudWebhook ([d4d3da2](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/d4d3da2373391a36beb2a21de4f2f126750a63ec))
* add loading indicator to GeneratePlayByCloudWebhook ([ce59c8a](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/ce59c8aa6981d7523514129ce27ceaf3e64fe4cd))
* add sample logging and correlation id middleware ([d63a698](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/d63a698445fb49824227995ec2953c072633f8dd))
* add stage option ([b242bd0](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/b242bd0b5971a41b2a5d4b6806baeccd346099c8))
* add subdomain ([effb047](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/effb0479a25e37cf1007a2cb955f0ab41cd5bf8f))
* add ui ([ca2b6a0](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/ca2b6a0b7ba7d42080fa6c1da2b06fab87973002))
* add wip amplify plugin ([18344d1](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/18344d17d465e15ccb113dfe34409904e92deeb9))
* change amplify artifacts directory to build for CRA ([ba1a593](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/ba1a5939b5e27ad1d48b69da8f987353cfbdfe3f))
* change api basepath ([a7044a0](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/a7044a05c3322b2e5a6c7e69a498d28b07a40b4c))
* change webhook path from / to /webhook ([4cdb474](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/4cdb474f6598381c16dd89ffb7155c2cfe2052e9))
* init create-react-app ([9ee756f](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/9ee756fd5db813923fe4af6592a244dc8bcc87f5))
* make sqs middleware more configurable ([d0ffcc1](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/d0ffcc11ae5ae37234af6f30877f8469665ef9ef))
* move additional logic to middleware ([fc27c5c](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/fc27c5cfe026206d172c02517ac46751a8d3a568))
* move sqs handler logic to custom middy middleware ([3ab6006](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/3ab60068c9e81e1e4db071cd0b03d3c2aef5cc4e))
* refactor to use serverless-apigateway-service-proxy ([4150dba](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/4150dba967a91554d98bd90521f922469da52c7c))
* update prod branch from ui to master ([13ee5e2](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/13ee5e212793aab0860dd755ecfe06ba11dfbfa7))
* update UI with discord webhook url input ([83104a6](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/83104a6d70c49dfc1d0376a47203bd9825b3f610))
* use sqs-partial-batch-failure middleware ([c48b894](https://github.com/brettstack/civ6-play-by-cloud-turn-notifier/commit/c48b894458b0e2c27d8269880166ce91e1828e4e))
