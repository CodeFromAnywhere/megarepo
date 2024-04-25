/**
To symlink + update every linked package, everywhere:

1. Get all linked packages: `npm ls --link --global`
2. In every package.json everywhere, list the dependency on one of these links.
3. If there is one or more:
 - Run `ls -l node_modules | grep ^l` to find the symlinked folders. The dependencies that don't show up need to be linked using `npm link [packagename]`
 - Update package.json and package-lock.json to the latest version of the linked package.

*/
export declare const syncLinks: () => Promise<void>;
//# sourceMappingURL=syncLinks.d.ts.map