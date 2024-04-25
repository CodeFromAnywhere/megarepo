/**

For every package:

- Compares last updated date of src folder to last updated date of build folder.
- Compares last published date of package on npm to last updated date of build folder.
- Looks at build failed parameter and potential build errors

The overview will show the results in a nice tabular way so you can easily fix them.

*/
export const findWip = () => {
    // for npm, use https://www.npmjs.com/package/npm-api or the source of that (openapi + sdk?)
    const buildNeededPackageNames = [];
    const publishNeededPackageNames = [];
    // For this, check a package.json#/operation parameter
    const buildFailedPackageNames = [];
    return {
        buildFailedPackageNames,
        buildNeededPackageNames,
        publishNeededPackageNames,
    };
};
//# sourceMappingURL=findWip.js.map