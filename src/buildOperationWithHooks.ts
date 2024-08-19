import { Operation } from "from-anywhere/types";
import { updateSingleNestedJsonFile } from "from-anywhere/node";
import { path } from "from-anywhere/node";
import { executeCommandQuietUnlessFail } from "./executeCommandQuietUnlessFail.js";
import { prebuild } from "./prebuild.js";
export const buildOperationWithHooks = async (
  absoluteOperationBasePath: string,
) => {
  await prebuild(absoluteOperationBasePath);

  // // NB: not needed in bun
  const isBuildSuccessful = executeCommandQuietUnlessFail({
    command: "tsc",
    cwd: absoluteOperationBasePath,
    description: `tsc ${path.parse(absoluteOperationBasePath).base}`,
  });

  await updateSingleNestedJsonFile<Operation>(
    path.join(absoluteOperationBasePath, "package.json"),
    { operation: { lastRebuildAt: Date.now(), isBuildSuccessful } },
  );

  return true;
};
