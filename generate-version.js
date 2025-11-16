import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  const version = readFileSync(join(__dirname, 'VERSION'), 'utf8').trim();
  const content = `// This file is auto-generated during build
export const version = '${version}';
`;
  writeFileSync(join(__dirname, 'app/shared/version.ts'), content, 'utf8');
  console.log(`Generated version.ts with version: ${version}`);
} catch (error) {
  if (error.code === 'ENOENT') {
    console.warn('VERSION file not found, using fallback version 0.0.0');
  } else {
    console.error('Failed to generate version.ts:', error.message);
  }
  // Create a fallback version file
  const content = `// This file is auto-generated during build
export const version = '0.0.0';
`;
  writeFileSync(join(__dirname, 'app/shared/version.ts'), content, 'utf8');
  console.log('Generated version.ts with fallback version: 0.0.0');
}
