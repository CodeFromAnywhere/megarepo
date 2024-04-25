import { path } from "from-anywhere/node";
import { getProjectRoot } from "from-anywhere/node";
import { oneByOne } from "from-anywhere";
import { buildEverythingInRightOrder } from "./buildEverythingInRightOrder.js";
import { buildOperationWithHooks } from "./buildOperationWithHooks.js";
import { getOperationPathsRebuildRequired } from "./getOperationPathsRebuildRequired.js";
/**
 * Provide "!" for all
 */
export const buildOperationNames = async (operationNames: string[]) => {
  console.log({ operationNames });
  const projectRoot = getProjectRoot();
  if (!projectRoot) {
    return;
  }

  if (["@", "!"].includes(operationNames[0])) {
    const isForced = operationNames[0] === "@";
    await buildEverythingInRightOrder(isForced);
    // await updateSchemaFiles();
    return;
  }

  if (operationNames[0] === undefined || operationNames[0]?.trim() === "") {
    // NB: none given, let's build the last updated one
    const operationPathsRebuildRequired =
      await getOperationPathsRebuildRequired();
    if (
      !operationPathsRebuildRequired ||
      operationPathsRebuildRequired.length === 0
    ) {
      return;
    }

    const lastOperationProjectRelativePath =
      operationPathsRebuildRequired[0].projectRelativeOperationPath;

    operationNames[0] = path.parse(lastOperationProjectRelativePath).base;
  }

  const result = await oneByOne(operationNames, async (operationName) => {
    const projectRelativeOperationPath = operations[
      operationName as keyof typeof operations
    ] as string | undefined;

    if (!projectRelativeOperationPath) {
      console.log(`Couldn't find ${operationName}`);
      return { operationName, isSuccessful: false };
    }
    const absoluteOperationPath = path.join(
      projectRoot,
      projectRelativeOperationPath,
    );
    const isSuccessful = await buildOperationWithHooks(absoluteOperationPath);
    return { operationName, isSuccessful };
  });

  // await updateSchemaFiles();
  return result;
};