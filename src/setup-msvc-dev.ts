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

            try {
                child.execSync(`"${vcvarsallPath}" ${arch}`);
            } catch (error) {
                core.error("vcvarsall.bat invocation failed with error: " + error);
                return;
            }
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