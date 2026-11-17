import { expect, test, type Locator, type Page } from '@playwright/test';

interface SavedDragon {
  breed: string;
  parents: Record<string, SavedDragon | undefined>;
}

function collectDragons(dragon: SavedDragon): SavedDragon[] {
  return [
    dragon,
    ...Object.values(dragon.parents ?? {}).flatMap((parent) =>
      parent ? collectDragons(parent) : [],
    ),
  ];
}

async function selectBreed(page: Page, tile: Locator, breed: string) {
  await tile
    .locator(':scope > .tile > button.dragon-breed-picker-button')
    .click();

  const dialog = page.locator('#breed-selector-wrapper');
  await expect(dialog).toBeVisible();

  // Breed picks made within 250ms of opening are ignored as accidental taps.
  await page.waitForTimeout(300);

  const search = dialog.locator('#results-search');
  await search.fill(breed);
  await expect(search).toHaveValue(breed);

  await dialog.getByRole('button', { name: breed, exact: true }).click();
  await expect(dialog).toBeHidden();
}

test('creates a lineage with four breeds and saves it to the server', async ({
  page,
  request,
}) => {
  await page.goto('/');

  const rootTile = page.locator('.lineage-root > li.tile-container');
  await expect(rootTile).toBeVisible();

  await rootTile
    .locator(':scope > .tile button[title="Add ancestors"]')
    .click();

  const parentTiles = rootTile.locator(
    ':scope > .tile-parents > li.tile-container',
  );
  await expect(parentTiles).toHaveCount(2);
  await parentTiles
    .first()
    .locator(':scope > .tile button[title="Add ancestors"]')
    .click();

  const grandparentTiles = parentTiles
    .first()
    .locator(':scope > .tile-parents > li.tile-container');
  await expect(grandparentTiles).toHaveCount(2);

  // Root, both parents and one grandparent get a breed; the other
  // grandparent stays the placeholder. Saving requires at least 2 generations.
  const breeds = ['Ochredrake', 'Red', 'Purple', 'Stone'];
  const tiles = [
    rootTile,
    parentTiles.nth(0),
    parentTiles.nth(1),
    grandparentTiles.nth(0),
  ];
  for (const [index, tile] of tiles.entries()) {
    await selectBreed(page, tile, breeds[index]);
  }

  await expect(page.locator('li.tile-container')).toHaveCount(5);

  const saveResponse = page.waitForResponse(
    (response) =>
      response.url().includes('/api/lineage') &&
      response.request().method() === 'POST' &&
      response.status() === 201,
  );

  await page.getByTitle('Get Link').click();

  const response = await saveResponse;
  const { hash } = (await response.json()) as { hash: string };
  expect(hash).toMatch(/^[a-f0-9]{40}$/);

  await expect(
    page.locator('#dialog-generate input[placeholder="link"]'),
  ).toHaveValue(new RegExp(`/view/${hash}$`));

  const stored = await request.get(`api/lineage/${hash}`);
  expect(stored.ok()).toBeTruthy();

  const { lineage } = (await stored.json()) as { lineage: SavedDragon };
  const savedBreeds = collectDragons(lineage).map((dragon) => dragon.breed);

  expect(savedBreeds).toHaveLength(5);
  for (const breed of breeds) {
    expect(savedBreeds).toContain(breed);
  }
  expect(
    new Set(savedBreeds.filter((breed) => breed !== 'Placeholder')).size,
  ).toBe(4);
});
