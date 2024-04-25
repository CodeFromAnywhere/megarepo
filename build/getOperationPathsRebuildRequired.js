import { exploreOperationFolders, folderGetUpdatedAt, readJsonFile, } from "from-anywhere/node";
import { path } from "from-anywhere/node";
import { getHumanReadableAgoTime, notEmpty } from "from-anywhere";
/**
 * Find all operations that have ts/tsx code that hasn't been built yet
 *
 * Returns an array of operation paths
 */
export const getOperationPathsRebuildRequired = async (context) => {
    const { absoluteFolderPath } = context;
    const operationFolders = await exploreOperationFolders({
        basePath: absoluteFolderPath,
    });
    const operationPathsRebuidRequired = (await Promise.all(operationFolders.map(async (absoluteOperationBasePath) => {
        const packageJsonPath = path.join(absoluteOperationBasePath, "package.json");
        const operation = await readJsonFile(packageJsonPath);
        if (!operation) {
            // no package.json
            return;
        }
        const isBuildFailed = operation.operation?.isBuildSuccessful === false;
        const lastSrcAt = await folderGetUpdatedAt({
            folderPath: path.join(absoluteOperationBasePath, "src"),
        });
        const lastBuildAt = await folderGetUpdatedAt({
            folderPath: path.join(absoluteOperationBasePath, "build"),
        });
        const isBuildRequired = lastBuildAt < lastSrcAt;
        return {
            absoluteOperationBasePath,
            lastSrcAt,
            lastBuildAt,
            isBuildRequired,
            isBuildFailed,
            srcAgo: getHumanReadableAgoTime(lastSrcAt),
            buildAgo: getHumanReadableAgoTime(lastBuildAt),
        };
    }))).filter(notEmpty);
    return operationPathsRebuidRequired.sort((a, b) => a.lastSrcAt - b.lastSrcAt);
};
//# sourceMappingURL=getOperationPathsRebuildRequired.js.map