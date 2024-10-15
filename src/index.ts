/**
 * @fileoverview Find and remove unused es6 modules
 * @author Mikkel Holmer Pedersen
 */
import exhaustiveDeps from "./rules/exhaustive-deps";
import { ESLint } from "eslint";

const plugin: ESLint.Plugin = {
    meta: {
        name: "react-hooks-better-static",
    },
    rules: {
        "exhaustive-deps": exhaustiveDeps as any,
    },
};

export default plugin;
