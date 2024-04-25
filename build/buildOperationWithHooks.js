import { postbuild } from "./postbuild.js";
import { updateSingleNestedJsonFile } from "edit-json-file";
import { path } from "from-anywhere/node";
import { executeCommandQuietUnlessFail } from "from-anywhere/node";
import { prebuild } from "./prebuild.js";
export const buildOperationWithHooks = async (absoluteOperationBasePath) => {
    await prebuild(absoluteOperationBasePath);
    // // NB: not needed in bun
    const isBuildSuccessful = executeCommandQuietUnlessFail({
        command: "tsc",
        cwd: absoluteOperationBasePath,
        description: `tsc ${path.parse(absoluteOperationBasePath).base}`,
    });
    await postbuild(absoluteOperationBasePath);
    await updateSingleNestedJsonFile(path.join(absoluteOperationBasePath, "package.json"), { operation: { lastRebuildAt: Date.now(), isBuildSuccessful } });
    return true;
};
//# sourceMappingURL=buildOperationWithHooks.js.map