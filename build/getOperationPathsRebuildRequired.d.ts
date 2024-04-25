/**
 * Find all operations that have ts/tsx code that hasn't been built yet
 *
 * Returns an array of operation paths
 */
export declare const getOperationPathsRebuildRequired: (context: {
    absoluteFolderPath: string;
}) => Promise<{
    absoluteOperationBasePath: string;
    lastSrcAt: number;
    lastBuildAt: number;
    isBuildRequired: boolean;
    srcAgo: string;
    buildAgo: string;
}[] | undefined>;
//# sourceMappingURL=getOperationPathsRebuildRequired.d.ts.map