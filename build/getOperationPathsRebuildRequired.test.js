import { getOperationPathsRebuildRequired } from "./getOperationPathsRebuildRequired.js";
const test = async () => {
    const result = await getOperationPathsRebuildRequired({
        absoluteFolderPath: "/Users/king/Desktop/github",
    }).then(console.table);
    // const yay = result
    //   ?.map(
    //     (x) =>
    //       `${path.parse(x.absoluteOperationBasePath).base} ${Math.round(
    //         (Date.now() - x.lastSrcAt) / 1000,
    //       )}s ago`,
    //   )
    //   .join("\n");
    // console.log(yay);
};
test();
//# sourceMappingURL=getOperationPathsRebuildRequired.test.js.map