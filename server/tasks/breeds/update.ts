import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const outputDir = resolve('app/assets/tile-rendering');
const definitionsPath = resolve('app/shared/breed-definitions.ts');

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }

  return response.text();
}

export default defineTask({
  meta: {
    name: 'breeds:update',
    description: 'Fetch the latest breed definitions and tile sprites',
  },
  async run({ payload }) {
    const ref = typeof payload.ref === 'string' ? payload.ref : 'main';
    const sourceRoot = `https://raw.githubusercontent.com/edenchazard/dragcave-breed-data/${ref}/output`;

    await mkdir(outputDir, { recursive: true });
    await writeFile(
      definitionsPath,
      await fetchText(`${sourceRoot}/breed-definitions.ts`),
    );

    const sprites = [
      'fallbacks.css',
      ...Array.from({ length: 6 }, (_, i) => `sprites-36x48-${i}.css`),
      ...Array.from({ length: 6 }, (_, i) => `sprites-72x96-${i}.css`),
    ];

    await Promise.all(
      sprites.map(async (filename) => {
        const css = await fetchText(`${sourceRoot}/tile-rendering/${filename}`);
        await writeFile(resolve(outputDir, filename), css);
      }),
    );

    return { result: `Updated breed data from ${ref}` };
  },
});
