// import babel from "rollup-plugin-babel";
import browserSync from "rollup-plugin-browsersync";
import cleanup from "rollup-plugin-cleanup";
import { terser } from "rollup-plugin-terser";
import historyApiFallback from "connect-history-api-fallback";

const license = `/**
 * @license
 * MIT License
 *
 * Copyright (c) 2019 Goffert van Gool
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
`;

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

const bundleConfig = ({
  input,
  output,
  format,
  transpiled = false,
  minified = false,
  watch = false
}) => {
  return {
    input: `./src/${input}`,
    output: {
      file: `./dist/${output}`,
      name: "test",
      format,
      sourcemap: minified,
      banner: license
    },
    plugins: [
      transpiled &&
        babel({
          presets: [["@babel/preset-env", { modules: false }]]
        }),
      !minified &&
        cleanup({
          maxEmptyLines: 1,
          comments: [/^((?!\(c\) \d{4})[\s\S])*$/]
        }),
      minified &&
        terser({
          warnings: true,
          mangle: { module: true },
          output: { preamble: license }
        }),
      watch && browserSyncPlugin
    ].filter(Boolean)
  };
};

const config = [
  // bundleConfig({
  //   input: "index.js",
  //   output: "index.nomodule.js",
  //   transpiled: true,
  //   format: "iife"
  // }),
  bundleConfig({
    input: "index.js",
    output: "index.js",
    transpiled: false,
    minified: true,
    format: "esm",
    watch: true
  })
];

export default config;
