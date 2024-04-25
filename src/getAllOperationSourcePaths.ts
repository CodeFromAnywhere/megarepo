#!/usr/bin/env node
import { exploreOperationFolders } from "from-anywhere/node";
import { path } from "from-anywhere/node";
import { fs } from "from-anywhere/node";
import { getPathsWithOperations } from "from-anywhere/node";

/**
 * returns src folder paths of all operations
 */
export const getAllOperationSourcePaths = async (config?: {
  manualProjectRoot?: string;
}) => {
  const manualProjectRoot = config?.manualProjectRoot;
  const operationFolders: string[] = await exploreOperationFolders({
    basePath: getPathsWithOperations({ manualProjectRoot }),
  });

  const operationSourceFolders = operationFolders.reduce(
    (allSources, operationPath) => {
      const srcPath = path.join(operationPath, "src");

      if (!fs.existsSync(srcPath)) return allSources;

      return allSources.concat(
        [srcPath],
        // TODO: this function would be great, but the inputs in tsconfig contain glob patterns and that doesn't work.
        // getPackageSourcePaths({ packageFolder: operationPath })
      );
    },
    [] as string[],
  );

  return operationSourceFolders;
};
