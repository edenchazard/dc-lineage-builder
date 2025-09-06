import { writeFile, mkdir } from 'fs/promises';

await mkdir('./app/assets/tile-rendering/', { recursive: true });

try {
  const definitions =
    'https://raw.githubusercontent.com/edenchazard/dragcave-breed-data/refs/heads/main/output/breed-definitions.ts';

  const response = await fetch(definitions);
  await writeFile('./app/shared/breed-definitions.ts', await response.text());

  const sprites = [
    'https://raw.githubusercontent.com/edenchazard/dragcave-breed-data/refs/heads/main/output/tile-rendering/fallbacks.css',
    'https://raw.githubusercontent.com/edenchazard/dragcave-breed-data/refs/heads/main/output/tile-rendering/sprites-36x48-0.css',
    'https://raw.githubusercontent.com/edenchazard/dragcave-breed-data/refs/heads/main/output/tile-rendering/sprites-36x48-1.css',
    'https://raw.githubusercontent.com/edenchazard/dragcave-breed-data/refs/heads/main/output/tile-rendering/sprites-36x48-2.css',
    'https://raw.githubusercontent.com/edenchazard/dragcave-breed-data/refs/heads/main/output/tile-rendering/sprites-36x48-3.css',
    'https://raw.githubusercontent.com/edenchazard/dragcave-breed-data/refs/heads/main/output/tile-rendering/sprites-36x48-4.css',
    'https://raw.githubusercontent.com/edenchazard/dragcave-breed-data/refs/heads/main/output/tile-rendering/sprites-36x48-5.css',
    'https://raw.githubusercontent.com/edenchazard/dragcave-breed-data/refs/heads/main/output/tile-rendering/sprites-72x96-0.css',
    'https://raw.githubusercontent.com/edenchazard/dragcave-breed-data/refs/heads/main/output/tile-rendering/sprites-72x96-1.css',
    'https://raw.githubusercontent.com/edenchazard/dragcave-breed-data/refs/heads/main/output/tile-rendering/sprites-72x96-2.css',
    'https://raw.githubusercontent.com/edenchazard/dragcave-breed-data/refs/heads/main/output/tile-rendering/sprites-72x96-3.css',
    'https://raw.githubusercontent.com/edenchazard/dragcave-breed-data/refs/heads/main/output/tile-rendering/sprites-72x96-4.css',
    'https://raw.githubusercontent.com/edenchazard/dragcave-breed-data/refs/heads/main/output/tile-rendering/sprites-72x96-5.css',
  ].map(async (sprite) => {
    const filename = sprite.split('/').pop();
    const response = await fetch(sprite);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${sprite}: ${response.statusText}`);
    }

    const filePath = `./app/assets/tile-rendering/${filename}`;
    await writeFile(filePath, await response.text());
  });

  // fetch and then move the file to the correct location
  await Promise.all(sprites);
} catch (e) {
  console.error(':( Error fetching breed data:', e);
}
