import sharp from 'sharp';
import { caches } from './files';
import path from 'path';
import fs from 'fs';

// A function that traverses all the images in the input directory and converts them to webp format
export async function processImages() {
  const files = fs.readdirSync(caches.cache36.settings.folder);
  for (const file of files) {
    const inputPath = path.join(caches.cache36.settings.folder, file);
    try {
      fs.mkdirSync(path.join(caches.cache36.settings.folder, '/webp/'));
    } catch (e) {}
    const outputPath = path.join(
      caches.cache36.settings.folder,
      '/webp/',
      file.replace('.png', '.webp'),
    );
    await sharp(inputPath)
      .webp({ quality: 95, nearLossless: true })
      .toFile(outputPath);
  }
}

await processImages();
