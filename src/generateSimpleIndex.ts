import fs from "node:fs";
const fsPromises = fs.promises;

import path from "node:path";
import { getOperationClassification } from "from-anywhere/node";
import { getOperationPath } from "from-anywhere/node";
import { getSrcRelativeFileId } from "from-anywhere/node";
import { makeRelative } from "from-anywhere";
import { isIndexableFileId } from "from-anywhere";
import { getPackageSourcePaths } from "./getPackageSourcePaths.js";

/**
generates operation index and writes it to index.ts in src of the operation.

NB: This overwrites the indexfile of the operation in the src folder! Make sure you don't have anything there still.. All functions should be in other filenames.

Should be ran every time an operation changes

 */
export const generateSimpleIndex = async (config: {
  operations: { [key: string]: string };
  /**
   * if given, just exports * from those
   */
  operationName: string;
  manualProjectRoot?: string;
}): Promise<string | undefined> => {
  const { operationName, manualProjectRoot, operations } = config;
  if (!operationName) {
    console.log("No operation name, can't create index", { type: "error" });
    return;
  }
  const operationBasePath = await getOperationPath(operationName, {
    manualProjectRoot,
    operationPathsObject: operations,
  });

  if (!operationBasePath) {
    console.log(`operationPath not found ${operationName}`, { type: "error" });
    return;
  }

  const classification = getOperationClassification(operationBasePath);

  if (classification === "ui-web") {
    console.log("Not generating index.ts for next.js project, not needed.", {
      type: "default",
    });
    return;
  }

  const outputPath = path.join(operationBasePath, "src", "index.ts");

  const files = await getPackageSourcePaths({ operationBasePath });

  const srcRelativeFileIds = files.map((fullPath) =>
    getSrcRelativeFileId(makeRelative(fullPath, operationBasePath)),
  );

  const indexationString = srcRelativeFileIds
    .filter(isIndexableFileId)
    .map((id) => `export * from "./${id}.js";`)
    .join("\n");

  await fsPromises.writeFile(outputPath, indexationString, {
    encoding: "utf8",
  });

  return outputPath;
};
