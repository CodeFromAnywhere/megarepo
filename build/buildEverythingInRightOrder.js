import { path } from "from-anywhere/node";
import { getProjectRoot } from "from-anywhere/node";
import { getOperationPathsRebuildRequired } from "./getOperationPathsRebuildRequired.js";
import { operationGetDependencies } from "swc-util";
import { buildOperationWithHooks } from "./buildOperationWithHooks.js";
import { update } from "fsorm";
import { oneByOne } from "from-anywhere";
/**
 * If the runtime is a runtime that requires you to build before running, this is needed. I hope later to use `bun.sh` and move away from this step enirely and lazy-build, but this isn't done yet.
 *
 * Since different operations rely on each other, it's important to build everything in the right order. This function takes care of that
 */
export const buildEverythingInRightOrder = async (
/**
 * If true, will force require everything to be built
 */
isForced) => {
    const projectRoot = getProjectRoot();
    if (!projectRoot)
        return;
    if (isForced) {
        await update("Operation", (item) => ({
            ...item,
            operation: { ...item.operation, isBuildSuccessful: false },
        }), undefined);
        console.log("successfully set all `isBuildSuccessful` to false");
    }
    const operationPathsRebuildRequired = (await getOperationPathsRebuildRequired())?.filter((x) => (isForced ? true : x.isBuildRequired));
    if (!operationPathsRebuildRequired)
        return;
    console.log({
        operationPathsRebuildRequiredLength: operationPathsRebuildRequired.length,
    });
    // find dependencies for every operation of which a rebuild is required
    const operationsWithDependencies = await oneByOne(operationPathsRebuildRequired, async ({ projectRelativeOperationPath }) => {
        const operationName = path.parse(projectRelativeOperationPath).base;
        const dependencies = await operationGetDependencies(operationName);
        return {
            projectRelativeOperationPath,
            dependencies,
        };
    });
    const initialValue = new Promise((resolve) => resolve(operationsWithDependencies));
    const result = await operationsWithDependencies.reduce(async (operationPathsRebuildRequiredLeftPromise, _, currentIndex) => {
        const operationPathsRebuildRequiredLeft = await operationPathsRebuildRequiredLeftPromise;
        // if `operationPathsRebuildRequiredLeft` is empty, just continue immediately
        if (operationPathsRebuildRequiredLeft.length === 0) {
            return operationPathsRebuildRequiredLeft;
        }
        // filter, finding all the operations that have no dependencies that are in this list
        const operationsCalculatedHasDependencies = operationPathsRebuildRequiredLeft.map((operationWithDependencies) => {
            const isDepFilter = (x) => {
                const operationName = path.parse(x.projectRelativeOperationPath).base;
                const isDependency = operationWithDependencies.dependencies?.includes(operationName) ||
                    false;
                return isDependency;
            };
            const dependenciesInThisList = operationPathsRebuildRequiredLeft.filter(isDepFilter);
            const hasDependenciesInThisList = !!dependenciesInThisList[0];
            return {
                ...operationWithDependencies,
                hasDependenciesInThisList,
                dependenciesInThisListAmount: dependenciesInThisList.length,
            };
        });
        const operationsWithDependencies = operationsCalculatedHasDependencies.filter((x) => x.hasDependenciesInThisList);
        const allHaveDependencies = operationsWithDependencies.length ===
            operationsCalculatedHasDependencies.length;
        const operationPathsWithoutDependencies = operationsCalculatedHasDependencies
            .filter((x) => !x.hasDependenciesInThisList)
            .map((x) => x.projectRelativeOperationPath);
        const operationsToBuild = allHaveDependencies
            ? [
                operationsCalculatedHasDependencies.reduce((previous, current) => previous.dependenciesInThisListAmount >
                    current.dependenciesInThisListAmount
                    ? previous
                    : current, operationsCalculatedHasDependencies[0]).projectRelativeOperationPath,
            ]
            : operationPathsWithoutDependencies;
        const operationsBuildNext = operationsCalculatedHasDependencies.filter((x) => !operationsToBuild.includes(x.projectRelativeOperationPath));
        console.log({
            step: currentIndex + 1,
            allHaveDependencies,
            operationsToBuild,
        });
        // build those with a certain concurrency that doesn't make us run out of memory
        await oneByOne(operationsToBuild, async (operationPath) => {
            const absoluteOperationBasePath = path.join(projectRoot, operationPath);
            await buildOperationWithHooks(absoluteOperationBasePath);
        });
        // return an array without the ones we just built
        return operationsBuildNext;
    }, initialValue);
    console.log("DONE");
};
//# sourceMappingURL=buildEverythingInRightOrder.js.map