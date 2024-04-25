export declare const findClis: (context: {
    absoluteFolderPath: string;
}) => Promise<{
    goodClis: {
        command: string;
        absoluteFolderPath: string;
    }[];
    badClis: {
        absoluteFolderPath: string;
        command: string;
        executable: boolean;
        exists: boolean;
        isJs: boolean;
        isNodeEnv: boolean;
    }[];
}>;
//# sourceMappingURL=findClis.d.ts.map