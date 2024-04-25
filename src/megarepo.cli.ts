#!/usr/bin/env node

import { findClis } from "./findClis.js";

const cli = async () => {
  const [command] = process.argv.slice(2);
  console.log({ command });
  if (command === "clis") {
    await findClis({ absoluteFolderPath: process.cwd() }).then((result) => {
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

  console.log(`Usage: Use a command:

- clis: shows all clis and whether or not they can be used and why

`);
};
cli();
