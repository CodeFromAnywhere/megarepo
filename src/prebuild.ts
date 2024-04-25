import { path } from "from-anywhere/node";
import { findOperationBasePath } from "from-anywhere/node";
import { generateSimpleIndex } from "./generateSimpleIndex.js";
export const prebuild = async (sourceFilePath: string) => {
  const operationBasePath = findOperationBasePath(sourceFilePath);
  if (!operationBasePath) {
    return;
  }
  const operationName = path.parse(operationBasePath).base;

  await generateSimpleIndex({ operationName });
};
