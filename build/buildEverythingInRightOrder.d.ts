/**
 * If the runtime is a runtime that requires you to build before running, this is needed. I hope later to use `bun.sh` and move away from this step enirely and lazy-build, but this isn't done yet.
 *
 * Since different operations rely on each other, it's important to build everything in the right order. This function takes care of that
 */
export declare const buildEverythingInRightOrder: (isForced?: boolean) => Promise<void>;
//# sourceMappingURL=buildEverythingInRightOrder.d.ts.map