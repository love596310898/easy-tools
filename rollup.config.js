// rollup.config.js
export default {
  input: "src/compresslmg.js",
  output: [
    {
      file: "lib/hickey-tools.cjs.js",
      format: "cjs",
    },
    {
      file: "lib/hickey-tools.esm.js",
      format: "esm",
    },
    {
      file: "lib/hickey-tools.umd.js",
      format: "umd",
      name: "_hy",
    },
    {
      file: "lib/hickey-tools.system.js",
      format: "system",
    },
  ],
};
