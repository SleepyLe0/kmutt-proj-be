import * as fs from 'fs';
import * as path from 'path';

const findTsFilesInDirectory = (directory: string): string[] => {
    const tsFiles: string[] = [];

    function findFilesRecursively(dir: string) {
        const files = fs.readdirSync(dir);

        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                findFilesRecursively(filePath);
            } else {
                tsFiles.push(filePath);
            }
        });
    }

    findFilesRecursively(directory);

    return tsFiles;
}

export { findTsFilesInDirectory }