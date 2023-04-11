import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

// Node modules don't support __dirname and __filename
// This will provide that functionality.
export function getFileAndDirName() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    console.log(import.meta.url, __dirname)
    return { __filename, __dirname };
}

// takes a file path expecting to be a breeds file and sorts
// all keys alphabetically and formats them to look nicer.
// it's good for our git diffs.
export async function prettyPrintJSONFile(jsonFileLocation) {
    // https://stackoverflow.com/a/24630587
    const objectKeySort = (object) => {
        if (typeof object !== "object" || object instanceof Array) // Not to sort the array
            return object;
        var keys = Object.keys(object);
        keys.sort();
        var newObject = {};
        for (var i = 0; i < keys.length; i++) {
            newObject[keys[i]] = objectKeySort(object[keys[i]])
        }
        return newObject;
    }

    // https://stackoverflow.com/a/54931396
    const prettyPrintArray = (json, indent = 2) => {
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }
        const output = JSON.stringify(json, function (k, v) {
            if (v instanceof Array)
                return JSON.stringify(v);
            return v;
        }, indent).replace(/\\/g, '')
            .replace(/\"\[/g, '[')
            .replace(/\]\"/g, ']')
            .replace(/\"\{/g, '{')
            .replace(/\}\"/g, '}');

        return output;
    }

    // Fetch the file, then sort the keys, and then prettify it before
    // overwriting it.
    const input = await fs.readFile(jsonFileLocation, { encoding: 'utf8' });
    const pretty = prettyPrintArray(objectKeySort(JSON.parse(input)));
    await fs.writeFile(jsonFileLocation, pretty);
    console.log(`Prettified ${jsonFileLocation}`);
}