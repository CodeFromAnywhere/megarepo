# Megarepo

Megarepo is a monorepo - but not really. It consists of a set of github repositories that have interdependencies, and the goal fo Megarepo is to make these repos sync nicely.

## Motivation

- `npm link` isn't always working and you don't want to be linking everything manually all the time
- Even if you link manually (which can be a lot of overhead with lots of packages) you will end up with problems in the deployed environment because installation is often cached and it will not install the latest version.
- monorepos are great, but not if you want to distribute things as small packages and repositories.

More info coming soon.

# Docs

The cli `mr` or `megarepo` will show the available commands.

# Convention

- There is no nestedness in the folder structure (for now)
- Root of the GitHub repo is also the npm package
- a [Zelda](https://github.com/feross/zelda)-like CLI can link all packages to eachother with ease.
- Require the package-name, the repo-name and the folder-name to be all equal.
- Require the package-name to be available in NPM.
- Require the package-name to be descriptive, but a little flavor in branding is allowed.
- I can be flexible in which frontend-frameworks are used as long as it's react-based to keep all code available.

# How to have monorepo-like behavior when not using a monorepo?

Run [zelda](https://github.com/feross/zelda/blob/master/index.js) in a package to link everything to everything.

# How to take a monorepo package and make it a published and linked NPM package?

1. change the name of the folder and `package.json#name` to something that can be published
2. use global replace to change `from "old"` into `from "new"`
3. run `node /Users/king/Desktop/github/os/packages/typescript-swc/development/build/cli/buildEverythingInRightOrder.cli.js` to ensure this change is done.
4. Make repo: `git init`, `git set remote`, `git add/commit/push`
5. Publish on NPM: `npm publish`
6. Copy the folder to `github` folder (to prevent code breaking)
7. run `addDependency($1)`
8. run `zelda` in the package
9. remove the folder from original location (now that new location is linked)

The package should now be auto-linked to every package it's used, including all packages in the monorepo.

# How to make a local CLI publicly available

1. Ensure your executing CLI file has `#!/usr/bin/env node` on top
2. Add a `"bin": { "your-cli-command": "./path-to-cli.js" }` in your `package.json`
3. Run `chmod +x ./path-to-cli.js`
4. Run `npm link`

# Tips & tricks

How to list all linked packages:

`npm ls --link --global`

How to see which packages are symlinked in your node_modules:

`ls -l node_modules | grep ^l`

..or for a specific package:

`ls -l node_modules | grep ^l | grep YOUR_PACKAGE`
