#!/usr/bin/env node
import { findClis } from "./findClis.js";
const absoluteFolderPath = process.cwd();
findClis({ absoluteFolderPath }).then(console.log);
//# sourceMappingURL=findClis.cli.js.map