#!/usr/bin/env node
import { generateSimpleIndex } from "./generateSimpleIndex.js";

const [operationName] = process.argv.slice(2);
generateSimpleIndex({ operationName });
