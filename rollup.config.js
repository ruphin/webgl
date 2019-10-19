import browserSync from "rollup-plugin-browsersync";
import historyApiFallback from "connect-history-api-fallback";
const { readdirSync } = require("fs");

const browserSyncPlugin =
  process.env.ROLLUP_WATCH &&
  browserSync({
    port: 5000,
    notify: false,
    open: false,
    ui: false,
    logPrefix: "APP",
    snippetOptions: {
      rule: {
        match: '<span id="browser-sync-binding"></span>',
        fn: f => f
      }
    },
    server: {
      baseDir: ["dist", "."],
      middleware: [historyApiFallback()]
    },
    files: ["index.html", "dist/**"]
  });

const bundleConfig = ({ input, output }) => {
  return {
    input: `./src/${input}`,
    output: {
      file: `./dist/${output}`,
      name: "test",
      format: "esm"
    },
    plugins: [browserSyncPlugin]
  };
};

const demos = readdirSync("./src", { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

export default demos.map(demo =>
  bundleConfig({
    input: `${demo}/index.js`,
    output: `${demo}/index.js`
  })
);
