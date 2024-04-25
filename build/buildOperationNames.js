import { path } from "from-anywhere/node";
import { getProjectRoot } from "from-anywhere/node";
import { oneByOne } from "from-anywhere";
import { buildEverythingInRightOrder } from "./buildEverythingInRightOrder.js";
import { buildOperationWithHooks } from "./buildOperationWithHooks.js";
import { getOperationPathsRebuildRequired } from "./getOperationPathsRebuildRequired.js";
/**
 * Provide "!" for all
 */
export const buildOperationNames = async (absoluteFolderPath, operationNames) => {
    // TODO;FIX
    const operations = {};
    console.log({ operationNames });
    const projectRoot = getProjectRoot();
    if (!projectRoot) {
        return;
    }
    if (["@", "!"].includes(operationNames[0])) {
        const isForced = operationNames[0] === "@";
        await buildEverythingInRightOrder(absoluteFolderPath, isForced);
        // await updateSchemaFiles();
        return;
    }
    if (operationNames[0] === undefined || operationNames[0]?.trim() === "") {
        // NB: none given, let's build the last updated one
        const operationPathsRebuildRequired = await getOperationPathsRebuildRequired({ absoluteFolderPath });
        if (!operationPathsRebuildRequired ||
            operationPathsRebuildRequired.length === 0) {
            return;
        }
        const lastOperationAbsolutePath = operationPathsRebuildRequired[0].absoluteOperationBasePath;
        operationNames[0] = path.parse(lastOperationAbsolutePath).base;
    }
    const result = await oneByOne(operationNames, async (operationName) => {
        const projectRelativeOperationPath = operations[operationName];
        if (!projectRelativeOperationPath) {
            console.log(`Couldn't find ${operationName}`);
            return { operationName, isSuccessful: false };
        }
        const absoluteOperationPath = path.join(projectRoot, projectRelativeOperationPath);
        const isSuccessful = await buildOperationWithHooks(absoluteOperationPath);
        return { operationName, isSuccessful };
    });
    // await updateSchemaFiles();
    return result;
};
//# sourceMappingURL=buildOperationNames.js.map