import { getOperationPathsRebuildRequired } from "./getOperationPathsRebuildRequired.js";
const test = async () => {
    const result = await getOperationPathsRebuildRequired({
        absoluteFolderPath: "/Users/king/Desktop/github",
    }).then(console.table);
};
test();
//# sourceMappingURL=getOperationPathsRebuildRequired.test.js.map