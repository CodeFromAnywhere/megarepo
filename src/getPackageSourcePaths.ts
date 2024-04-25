#!/usr/bin/env node
import { path } from "from-anywhere/node";
import { explore } from "from-anywhere/node";

// import { getTsConfig } from "get-ts-config";

/**
Returns an array of absolute file paths of (typescript) files in the src of your operation
 
TODO: we need a way to explore these glob patterns inside of tsConfig.include.
until then, just assume we use "src" as the only folder
 */
export const getPackageSourcePaths = async ({
  operationBasePath,
  ignoreIndexFiles,
  allTypes,
}: {
  operationBasePath: string;
  ignoreIndexFiles?: boolean;
  /**
   * by default, only searches for ts and tsx files, if this is true, it will search for any type
   */
  allTypes?: boolean;
}) => {
  const filePaths = (
    await explore({
      basePath: path.join(operationBasePath, "src"),
      extension: allTypes ? undefined : ["ts", "tsx"],
      ignore: ignoreIndexFiles ? ["index.ts", "index.tsx"] : undefined,
    })
  ).map((x) => x.path);

  return filePaths;
};
