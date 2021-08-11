"use strict";
import clear from "rollup-plugin-clear";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import screeps from "rollup-plugin-screeps";
import typescript from "rollup-plugin-typescript2";

let cfg;
const dest = process.env.DEST;
if (!dest) {
  console.log("No destination specified - code will be compiled but not uploaded");
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-var-requires
} else if ((cfg = require("./screeps.json")[dest]) == null) {
  throw new Error("Invalid upload destination");
}

export default {
  input: "src/main.ts",
  output: {
    file: "dist/main.js",
    format: "cjs",
    sourcemap: true
  },

  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    clear({ targets: ["dist"] }),
    resolve({ rootDir: "src" }),
    commonjs({
      namedExports: {
        "node_modules/node-random-name/lib/index.js": ["getName"],
        "node_modules/utility-ai/UtilityAi.js": ["UtilityAi"]
      }
    }),
    typescript({ tsconfig: "./tsconfig.json" }),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    screeps({ config: cfg, dryRun: cfg == null })
  ]
};
