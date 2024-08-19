<!--
Way of working is important.

Rather than a monorepo, we have a "megarepo".

Let's put this in a repo

WORK SMARTER, NOT HARDER.

-->

# Good CLI Discovery

- ✅ Fix `newOperation` in `cfa-create`
- ✅ Ensure the global CLI is my local version. Figure out the best way to do that and document it.
- ✅ Ensure we can discover all CLIs in `github` with a cli that explores `package.json#/bin`
- ✅ Make repo for `openapi-fetch-typescript` (its mine already) https://www.npmjs.com/package/openapi-fetch-typescript

# Good operation creation

- ✅ Rename `newOperation` to `cfa-create`
- ✅ Update template of `cfa-create` to include concurrently for tailwind as well as `tsc -w`

# SYNCING PROBLEM: Command to fix `package-lock.json`

Before this, maybe see if using another thing than `npm` might already solve part of the problem. Also clearly separate the different issues I actually have

If we have `^0.0.5` or anything in our own packages, theres a big chance the package doesn't get updated to the latest version. Maybe this is `package-lock.json` at work? In this case, maybe there should be a predeploy that refreshes all packages to the latest version. This way we can be certain about the version number.

Whenever I `npm run build` a package, this needs to happen:

- tsc
- tailwindcss
- update package.json if build fails

Whenever publish happened:

- Update package.json and package-lock.json everywhere where it's a dependency.
- Ensure link is still established everywhere. Re-establish if not.

# `megarepo build`

- ✅ put `lock-util` into `from-anywhere`
- ✅ rename `lock-util` and `edit-json-file` into `from-anywhere/node`
- ✅ add command `mr build` connected to `buidEverythingInRightOrder`
- 🟠 make `buidEverythingInRightOrder` work in `megarepo`

🎉 I can now consistently build everything with a simple command.

# Other commands `megarepo`

- create `findWip` (`mr wip`)
- create `syncLinks` (`mr link`)
- create `publishAndPushAllPublishable` (`mr ship`)
- ✅ add commands: `megarepo wip`, `megarepo link`, `megarepo build`, `megarepo ship`

# 🔴 TODO

fix proper linking and package-lock updating so I can easily develop across independent packages. Everything should be linked to everything.

# Fix OpenAPI to Typescript

- ✅ Fork `redocly-cli`
- ✅ Improve `resolveOpenapiAppRequest` so it takes the entire openapi and resolves all paths, given we have an object of functions.
- Fix the resolving of urls. Maybe it's just a version change of a dependency.
- Confirm that it gives a nice types files including the remote URL resolved type.

# SWC

- `swc-util` needs to become a standalone CLI + api
- Use that api to be able to generate an openapi from code in a serverless environment
- Use that for the below apis I want to setup. This way it should be much faster.
