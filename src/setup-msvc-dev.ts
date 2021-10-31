/*
 * Copyright (c) 2019 ilammy
 * Copyright (c) 2021 Leon Linhart
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
import * as core from "@actions/core";
import * as child from "child_process";
import * as constants from "./constants";
import * as fs from "fs";
import * as os from "os";
import * as vswhere from "./vswhere";

async function run() {
    try {
        if (os.platform() != "win32") {
            core.error(`setup-msvc-dev is only supported on Windows (found "${os.platform()}")`);
            return;
        }

        let arch = core.getInput(constants.INPUT_ARCHITECTURE);
        let vsPath = core.getInput(constants.INPUT_VS_PATH);

        let exportVCVarsall = core.getInput(constants.INPUT_EXPORT_VCVARSALL);
        let exportVS = core.getInput(constants.INPUT_EXPORT_VS);

        if (!vsPath) vsPath = vswhere.findVS();

        let pathToVCVarsall = `${vsPath}\\VC\\Auxiliary\\Build`
        let vcvarsallPath = `${pathToVCVarsall}\\vcvarsall.bat`;

        if (!vcvarsallPath || !fs.existsSync(vcvarsallPath)) {
            console.error(`vcvarsall.bat does not exist at expected location '${vcvarsallPath}'`);
            return;
        }

        let tasks = 0;

        if (arch) {
            tasks++;

            arch = normalizeArch(arch);

            let commandOutput;

            try {
                commandOutput = child.execSync(`set && cls && "${vcvarsallPath}" ${arch} && cls && set`, { shell: "cmd" })
                    .toString();
            } catch (error) {
                core.error("vcvarsall.bat invocation failed with error: " + error);
                return;
            }

            const commandOutputParts = commandOutput.split("\f");
            const oldEnvOutput = commandOutputParts[0].split("\r\n");
            const vcvarsallOutput = commandOutputParts[1].split("\r\n");
            const newEnvOutput = commandOutputParts[2].split("\r\n");

            const errorMessages = vcvarsallOutput.filter((line) => line.match(/^\[ERROR.*]/));
            if (errorMessages.length > 0) {
                core.error("Invocation of vcvarsall.bat failed:\r\n" + errorMessages.join("\r\n"));
                return;
            }

            let oldEnv = {};

            for (const string of oldEnvOutput) {
                const [name, value] = string.split("=");
                // @ts-ignore
                oldEnv[name] = value;
            }

            core.startGroup("Environment variables");
            for (const string of newEnvOutput) {
                if (!string.includes("=")) continue;

                let [name, newValue] = string.split("=");

                // @ts-ignore
                if (newValue !== oldEnv[name]) {
                    core.info(`Setting ${name}`);

                    const pathLikeVariables = ["PATH", "INCLUDE", "LIB", "LIBPATH"];
                    if (pathLikeVariables.indexOf(name.toUpperCase()) !== 1) {
                        function unqiue(value: string, index: number, self: string[]) {
                            return self.indexOf(value) === index;
                        }

                        newValue = newValue.split(';')
                            .filter(unqiue)
                            .join(";");
                    }

                    core.exportVariable(name, newValue);
                }
            }

            core.endGroup();
            core.info("Configured Developer Command Prompt");
        }

        if (exportVCVarsall) {
            tasks++;

            core.info(`Exporting path to vcvarsall.bat: ${exportVCVarsall}=${pathToVCVarsall}`);
            core.exportVariable(exportVCVarsall, pathToVCVarsall);
        }

        if (exportVS) {
            tasks++;

            core.info(`Exporting path to Visual Studio: ${exportVS}=${vsPath}`);
            core.exportVariable(exportVS, vsPath);
        }

        if (tasks === 0) {
            core.error("setup-msvc-dev did nothing. Please configure at least one of 'arch', 'exportVCVarsall', or 'exportVS'.");
            return;
        }
    } catch (error) {
        // @ts-ignore
        core.setFailed(error.message);
    }
}

function normalizeArch(arch: string): string {
    function eq(other: string): boolean {
        return arch.localeCompare(other, undefined, { sensitivity: "accent" }) === 0;
    }

    function normalize(arch: string): string {
        if (eq("x86") || eq("win32")) {
            return "x86";
        } else if (eq("x64") || eq("win64") || eq("x86_64") || eq("x86-64")) {
            return "x64";
        } else {
            return arch;
        }
    }

    const normalized = normalize(arch);
    core.info(`Normalized input arch to ${normalized} (from ${arch})`);

    return normalized;
}

run();