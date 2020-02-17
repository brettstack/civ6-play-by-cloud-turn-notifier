# Civilization 6 Turn Notifier

## Architecture

![architecture diagram](https://raw.githubusercontent.com/brettstack/civ6-play-by-cloud-turn-notifier/master/architecture-diagram.jpg)

## Domain

1. After deploying the stack, run `sls create_domain` to create the API Gateway Custom Domain.
2. Run `npm run deploy` again to create the base path mappings
3. In DNS settings, create a CNAME record, 
   1. Specify the subdomain in the `@` field (e.g. `civ`)
   2. Copy `Target Domain Name` from the API Gateway console into `Target Domain`
   3. This takes time to propagate

## TODO
[] Add query string params to the method request as required; set request validator on method; add documentation for each parameter
