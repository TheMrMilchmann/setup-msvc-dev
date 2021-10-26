import * as core from "@actions/core";
import * as child from "child_process";

export function findVS(): string {
    try {
        return child.execSync("vswhere -products * -latest -prerelease -property installationPath")
            .toString()
            .trim();
    } catch (error) {
        core.error("vswhere did not find Visual Studio");
        return "";
    }
}