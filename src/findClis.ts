import {
  canExecute,
  exploreOperationFolders,
  fs,
  readJsonFile,
  getFileFirstLine,
} from "from-anywhere/node";
import path from "path";
import { Operation } from "from-anywhere/types";
import { notEmpty } from "from-anywhere";

export const findClis = async (context: { absoluteFolderPath: string }) => {
  const { absoluteFolderPath } = context;
  const operationFolders = await exploreOperationFolders({
    basePath: absoluteFolderPath,
  });

  const bins = (
    await Promise.all(
      operationFolders.map(async (absoluteFolderPath) => {
        const packageJson = await readJsonFile<Operation>(
          path.join(absoluteFolderPath, "package.json"),
        );

        if (!packageJson?.name || !packageJson?.bin) {
          return;
        }

        return {
          absoluteFolderPath,
          name: packageJson.name,
          bin: packageJson?.bin,
        };
      }),
    )
  ).filter(notEmpty);

  const entireBinList = (
    await Promise.all(
      bins.map(async (item) => {
        const binList = await Promise.all(
          Object.keys(item.bin).map(async (command) => {
            const binLocation = path.join(
              item.absoluteFolderPath,
              item.bin[command],
            );
            const exists = fs.existsSync(binLocation);
            const executable = await canExecute(binLocation);
            const firstLine = (await getFileFirstLine(binLocation))?.trim();
            const isJs = binLocation.endsWith(".js");
            const isNodeEnv = firstLine === "#!/usr/bin/env node";
            const isCool = isJs && isNodeEnv && executable && exists;
            return {
              command,
              exists,
              executable,
              isNodeEnv,
              isJs,
              isCool,
            };
          }),
        );
        return binList.map((x) => ({
          absoluteFolderPath: item.absoluteFolderPath,
          packageName: item.name,
          ...x,
        }));
      }),
    )
  ).flat();

  const goodClis = entireBinList
    .filter((x) => x.isCool)
    .map((x) => ({
      command: x.command,
      absoluteFolderPath: x.absoluteFolderPath,
    }));
  const badClis = entireBinList
    .filter((x) => !x.isCool)
    .map((x) => {
      const {
        absoluteFolderPath,
        command,
        executable,
        exists,
        isJs,
        isNodeEnv,
      } = x;
      return {
        absoluteFolderPath,
        command,
        executable,
        exists,
        isJs,
        isNodeEnv,
      };
    });
  return { goodClis, badClis };
};
