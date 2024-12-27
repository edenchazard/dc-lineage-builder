import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import { tags } from '../app/shared/types';

// Node modules don't support __dirname and __filename
// This will provide that functionality.
export function getFileAndDirName(): { __filename: string; __dirname: string } {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return { __filename, __dirname };
}

// takes a file path expecting to be a breeds file and sorts
// all keys alphabetically and formats them to look nicer.
// it's good for our git diffs.
function isRecord(what: unknown): what is Record<string, unknown> {
  return !Array.isArray(what) && typeof what === 'object' && what !== null;
}

export async function prettyPrintJSONFile(
  jsonFileLocation: string,
): Promise<void> {
  const objectKeySort = <T>(what: T): T => {
    // don't sort arrays or primitive values
    if (isRecord(what)) {
      const sortedObject: Record<string, unknown> = {};

      Object.keys(what)
        .sort()
        .forEach((key) => (sortedObject[key] = objectKeySort(what[key])));

      return sortedObject as T;
    }

    return what;
  };

  // https://stackoverflow.com/a/54931396
  const prettyPrintArray = (
    json: Record<string, unknown>,
    indent = 2,
  ): string => {
    if (typeof json === 'string') {
      json = JSON.parse(json);
    }
    const output = JSON.stringify(
      json,
      function (_, v) {
        if (v instanceof Array) return JSON.stringify(v);
        return v;
      },
      indent,
    )
      .replace(/\\/g, '')
      .replace(/"\[/g, '[')
      .replace(/\]"/g, ']')
      .replace(/"\{/g, '{')
      .replace(/\}"/g, '}');

    return output;
  };

  // Fetch the file, then sort the keys, and then prettify it before
  // overwriting it.
  const input = await fs.readFile(jsonFileLocation, { encoding: 'utf8' });
  const pretty = prettyPrintArray(objectKeySort(JSON.parse(input)));
  await fs.writeFile(jsonFileLocation, pretty);
  console.log(`Prettified ${jsonFileLocation}`);
}
