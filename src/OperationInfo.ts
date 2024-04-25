export type OperationInfo = {
  projectRelativeOperationPath: string;
  dependencies: string[] | undefined;
  hasDependenciesInThisList?: boolean;
  dependenciesInThisListAmount?: number;
};
