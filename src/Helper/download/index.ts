import { promisify } from "util";
import { exec } from "child_process";
import { mkdirSync } from "temp";

import ghdownload from "github-download";
import gitHubURLParser from "parse-github-url";

export const DownloadHelper = {
    DownloadAndGetPath: async (path: string): Promise<string> => {
        try {
            const tempInfo = mkdirSync({
                dir: process.cwd(),
                prefix: ".",
            });

            await new Promise((resolve, reject) => {
                const { owner, name, branch } = gitHubURLParser(path);
                ghdownload(
                    {
                        user: owner,
                        repo: name,
                        ref: branch,
                    },
                    tempInfo,
                ).on("end", function () {
                    exec("tree", function (err, stdout, sderr) {
                        resolve({ path: tempInfo });
                    });
                });
            });
            return tempInfo;
        } catch (e) {
            throw new Error(e instanceof Error ? e.message : (e as string));
        }
    },
};
