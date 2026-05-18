/*
 * Copyright (c) 2019 ilammy
 * Copyright (c) 2021-2026 Leon Linhart
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { defineConfig } from "tsdown";

export default defineConfig({
    entry: {
        index: 'src/setup-msvc-dev.ts',
    },
    format: ["cjs"],            // GitHub Actions run in Node, CJS is the most stable target
    minify: true,               // Equivalent to ncc's minification
    sourcemap: true,            // Helpful for debugging
    clean: true,                // Cleans the dist folder before build
    target: "node24",           // Align with modern GHA runner Node versions
    deps: {
        alwaysBundle: [/(.*)/], // THIS IS CRITICAL: Forces bundling all dependencies
    },
  dts: false,
});
