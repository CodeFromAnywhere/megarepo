#!/usr/bin/env node
import path from "path";
import { buildEverythingInRightOrder } from "./buildEverythingInRightOrder.js";
import { findClis } from "./findClis.js";
import { findWip } from "./findWip.js";
import { syncLinks } from "./syncLinks.js";
import { sleep } from "from-anywhere";

const cli = async () => {
  const [command, basePath] = process.argv.slice(2);

  const absoluteFolderPath =
    !basePath || basePath.startsWith(".")
      ? path.join(process.cwd(), basePath || ".")
      : basePath;

  console.log({ command });
  if (command === "clis") {
    await findClis({ absoluteFolderPath }).then((result) => {
      if (result.badClis.length) {
        console.log("BAD CLIS");
        console.table(result.badClis);
      }

      if (result.goodClis.length) {
        console.log("GOOD CLIS");
        console.table(result.goodClis);
      }

      console.log("Make sure your CLIs are also linked using npm link.");
    });
    return;
  }

  if (command === "build") {
    await buildEverythingInRightOrder(absoluteFolderPath);
    return;
  }

  if (command === "wip") {
    await findWip();

    return;
  }

  if (command === "link") {
    await syncLinks();
    return;
  }

  if (command === "ship") {
    await sleep(1000);
    return;
  }

  console.log(`Usage: Use a command:

- clis: shows all clis and whether or not they can be used and why
- link: syncs all links across your repos
- ship: publishes and pushes all changes
- wip: shows status of your packages
- build: builds everything that needs building

`);
};
cli();
