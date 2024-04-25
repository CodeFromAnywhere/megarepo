/**

For every package:

- Compares last updated date of src folder to last updated date of build folder.
- Compares last published date of package on npm to last updated date of build folder.
- Looks at build failed parameter and potential build errors

The overview will show the results in a nice tabular way so you can easily fix them.

TODO: Split this up

*/
export declare const findWip: () => {
    buildFailedPackageNames: string[];
    buildNeededPackageNames: string[];
    publishNeededPackageNames: string[];
};
//# sourceMappingURL=findWip.d.ts.map