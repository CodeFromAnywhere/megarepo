import { path } from "from-anywhere/node";
import { getProjectRoot } from "from-anywhere/node";
import { getOperationPathsRebuildRequired } from "./getOperationPathsRebuildRequired.js";
// import { operationGetDependencies } from "swc-util";
import { buildOperationWithHooks } from "./buildOperationWithHooks.js";
// import { update } from "fsorm";
import { OperationInfo } from "./OperationInfo.js";
import { oneByOne } from "from-anywhere";
/**
 * If the runtime is a runtime that requires you to build before running, this is needed. I hope later to use `bun.sh` and move away from this step enirely and lazy-build, but this isn't done yet.
 *
 * Since different operations rely on each other, it's important to build everything in the right order. This function takes care of that
 */
export const buildEverythingInRightOrder = async (
  absoluteFolderPath: string,
  /**
   * If true, will force require everything to be built
   */
  isForced?: boolean,
) => {
  const projectRoot = getProjectRoot();
  if (!projectRoot) return;

  if (isForced) {
    // await update(
    //   "Operation",
    //   (item) => ({
    //     ...item,
    //     operation: { ...item.operation, isBuildSuccessful: false },
    //   }),
    //   undefined,
    // );
    console.log("TODO:successfully set all `isBuildSuccessful` to false");
  }

  const operationPathsRebuildRequired = (
    await getOperationPathsRebuildRequired({ absoluteFolderPath })
  )?.filter((x) => (isForced ? true : x.isBuildRequired));

  if (!operationPathsRebuildRequired) return;

  console.log({
    operationPathsRebuildRequiredLength: operationPathsRebuildRequired.length,
  });

  // find dependencies for every operation of which a rebuild is required
  const operationsWithDependencies = await oneByOne(
    operationPathsRebuildRequired,
    async ({ absoluteOperationBasePath }) => {
      const operationName = path.parse(absoluteOperationBasePath).base;

      //TODO: Fix later
      const dependencies: string[] = []; // await operationGetDependencies(operationName);

      return {
        absoluteOperationBasePath,
        dependencies,
      };
    },
  );

  const initialValue = new Promise<OperationInfo[]>((resolve) =>
    resolve(operationsWithDependencies),
  );

  const result = await operationsWithDependencies.reduce(
    async (operationPathsRebuildRequiredLeftPromise, _, currentIndex) => {
      const operationPathsRebuildRequiredLeft =
        await operationPathsRebuildRequiredLeftPromise;

      // if `operationPathsRebuildRequiredLeft` is empty, just continue immediately
      if (operationPathsRebuildRequiredLeft.length === 0) {
        return operationPathsRebuildRequiredLeft;
      }

      // filter, finding all the operations that have no dependencies that are in this list
      const operationsCalculatedHasDependencies =
        operationPathsRebuildRequiredLeft.map((operationWithDependencies) => {
          const isDepFilter = (x: OperationInfo) => {
            const operationName = path.parse(x.absoluteOperationBasePath).base;

            const isDependency =
              operationWithDependencies.dependencies?.includes(operationName) ||
              false;

            return isDependency;
          };

          const dependenciesInThisList =
            operationPathsRebuildRequiredLeft.filter(isDepFilter);

          const hasDependenciesInThisList = !!dependenciesInThisList[0];

          return {
            ...operationWithDependencies,
            hasDependenciesInThisList,
            dependenciesInThisListAmount: dependenciesInThisList.length,
          };
        });

      const operationsWithDependencies =
        operationsCalculatedHasDependencies.filter(
          (x) => x.hasDependenciesInThisList,
        );

      const allHaveDependencies =
        operationsWithDependencies.length ===
        operationsCalculatedHasDependencies.length;

      const operationPathsWithoutDependencies =
        operationsCalculatedHasDependencies
          .filter((x) => !x.hasDependenciesInThisList)
          .map((x) => x.absoluteOperationBasePath);

      const operationsToBuild = allHaveDependencies
        ? [
            operationsCalculatedHasDependencies.reduce(
              (previous, current) =>
                previous.dependenciesInThisListAmount >
                current.dependenciesInThisListAmount
                  ? previous
                  : current,
              operationsCalculatedHasDependencies[0],
            ).absoluteOperationBasePath,
          ]
        : operationPathsWithoutDependencies;

      const operationsBuildNext = operationsCalculatedHasDependencies.filter(
        (x) => !operationsToBuild.includes(x.absoluteOperationBasePath),
      );

      console.log({
        step: currentIndex + 1,
        allHaveDependencies,
        operationsToBuild,
      });

      // build those with a certain concurrency that doesn't make us run out of memory

      await oneByOne(operationsToBuild, async (absoluteOperationPath) => {
        await buildOperationWithHooks(absoluteOperationPath);
      });

      // return an array without the ones we just built
      return operationsBuildNext;
    },
    initialValue,
  );

  console.log("DONE");
};
