import fs from "fs";
import path from "path"
import {promisify} from "util";

async function main() {
    {
        const source = path.join(process.cwd(), "README.md");
        const dest = path.join(process.cwd(), "dist", "README.md");
        await copy(source, dest);
    }
    {
        const source = path.join(process.cwd(), "__scripts__", "package.json");
        const dest = path.join(process.cwd(), "dist", "package.json");
        await copy(source, dest);
    }
}

async function copy(from, to) {
    const targetDir = path.dirname(to);
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, {recursive: true});
    }

    const copyFile = promisify(fs.copyFile);
    await copyFile(from, to);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
