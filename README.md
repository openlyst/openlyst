# Openlyst
Source code for [https://openlyst.ink/](https://openlyst.ink/).

You are free to do anything you want with this website. You dont need a database everything is JSON.
Just respect our Liecnce and remeber open-srouce makes everything better. 

note images out of date
![](static/icons/openylst/home.png)
![](static/icons/openylst/app.png) 
## Release Metadata Automation

Release metadata can now be synced from a builder manifest:

- `npm run sync-release-manifest -- --manifest <path/to/build-manifest.json>`
- `npm run validate-release-data`

`validate-release-data` is also enforced in GitLab CI.
