import nodeHTMLParser from 'node-html-parser';
import type {
  DcApiFetch,
  DragonData,
  GetDragonsBulkResponse,
} from './dcApiFetch.js';

export interface DragonOnsite {
  code: string;
  html: string;
  gen: number;
}

export interface DragonPair {
  male: DragonOnsite;
  female: DragonOnsite;
}

export class OnsiteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OnsiteError';
  }
}

export class OnsiteDragonNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OnsiteDragonNotFoundError';
  }
}

interface GetHTMLOptions {
  /**
   * Whether to replace whitespace and fix urls
   */
  filter?: boolean;

  /**
   * Pass a Device Pixel Ratio to return an appropriate result
   */
  dpr?: number;
}

class APIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Check a pair of dragons are male and female
 * @param codes Format: [male, female]
 */
export async function checkDragonsMatchGender(
  codes: [string, string],
  api: DcApiFetch,
): Promise<{ code: string; correct: boolean | null }[]> {
  const response = await api<GetDragonsBulkResponse>(`/dragons`, {
    method: 'POST',
    body: new URLSearchParams({
      ids: codes.join(','),
    }),
    onResponseError() {
      throw new APIError('Error in response.');
    },
  });

  if (response.errors.length > 0) throw new APIError('Error in response.');

  const checkGender = (code: string, shouldBe: DragonData['gender']) => {
    const dragon = response.dragons[code];

    if (!dragon) throw new OnsiteDragonNotFoundError(code);
    if ([shouldBe, ''].includes(dragon.gender)) return true;
    return false;
  };

  return [
    { code: codes[0], correct: checkGender(codes[0], 'Male') },
    { code: codes[1], correct: checkGender(codes[1], 'Female') },
  ];
}

export async function grabHTML(
  code: string,
  options: GetHTMLOptions = {},
): Promise<DragonOnsite> {
  const _options: Required<GetHTMLOptions> = {
    dpr: 1,
    filter: false,
    ...options,
  };
  const fetchDragon = async (code: string, dpr: GetHTMLOptions['dpr'] = 1) => {
    return $fetch<string>(`https://dragcave.net/lineage/${code}`, {
      headers: {
        Cookie: `dpr=${dpr};`,
      },
      onResponseError(response) {
        if (response.response.status === 404) {
          throw new OnsiteError(`Error while fetching. Dragon: ${code}`);
        }

        throw new OnsiteError(
          `Unknown error while retrieving. Dragon: ${code}`,
        );
      },
    });
  };

  /**
   * @param root The root returned by fetchDragon()
   */
  const getHTML = async (
    root: HTMLElement,
    options: GetHTMLOptions,
  ): Promise<string> => {
    const baseULTag = root.querySelector('ul');

    if (baseULTag === null)
      throw new OnsiteError(`Could not find ul tag. Dragon: ${code}`);

    // node-html-parser's toString() produces the markup we need here.
    let html = baseULTag.toString();

    if (options.filter) {
      // grab all the images and make base64 data encodes of them
      const images = [
        ...new Set(
          Array.from(baseULTag.querySelectorAll('img')).map(
            (img) => img.getAttribute('src') as string,
          ),
        ),
      ];

      const base64Images = await Promise.all(
        images.map(async (url) => {
          const response = await $fetch<Response>(
            new URL(url, 'https://dragcave.net').href,
            {
              onResponseError() {
                throw new OnsiteError(
                  `Error while fetching image. Dragon: ${code}`,
                );
              },
            },
          );

          return {
            url,
            base64:
              'data:image/png;base64,' +
              Buffer.from(await response.arrayBuffer()).toString('base64'),
          };
        }),
      );

      html = html
        .replaceAll('<a ', "<a rel='noopener noreferrer' target='_blank' ")
        .replaceAll('/view/', 'https://dragcave.net/view/');

      base64Images.forEach(
        (img) => (html = html.replaceAll(img.url, img.base64)),
      );
    }

    return html;
  };

  /**
   * Returns the generation of a dragon
   */
  const getGen = (root: HTMLElement): number => {
    const genNode = root.querySelector('span > span:first-child');
    if (genNode === null)
      throw new OnsiteError(`Couldn't find lineage tag. Dragon: ${code}`);

    // we use the text property instead of counting the childnodes length
    // because it could be a lineage > 13 gens
    return parseInt(genNode.textContent ?? '1');
  };

  const response = await fetchDragon(code, _options.dpr ?? 1);

  const root = nodeHTMLParser.parse(response);

  const lineageRoot = root
    ?.querySelector(`a[href='/view/${code}']`)
    ?.closest('div > ul')?.parentNode as unknown as HTMLElement;

  if (!lineageRoot)
    throw new OnsiteError(`Couldn't find root. Dragon: ${code}`);

  return {
    code,
    html: await getHTML(lineageRoot, _options),
    gen: getGen(lineageRoot),
  };
}

/**
 * Returns data for a male and female pair of dragons
 */
export async function getDataForPair(
  codes: [string, string],
  options: GetHTMLOptions = {},
): Promise<DragonPair> {
  const [male, female] = await Promise.all([
    grabHTML(codes[0], { filter: true, ...options }),
    grabHTML(codes[1], { filter: true, ...options }),
  ]);

  const withListItem = (dragon: DragonOnsite): DragonOnsite => ({
    ...dragon,
    html: `<li>${dragon.html}</li>`,
  });

  return {
    male: withListItem(male),
    female: withListItem(female),
  };
}

/**
 * Returns a list of dragon codes present in the lineage.
 */
export function getDragonCodesFromHTML(html: string): string[] {
  const root = nodeHTMLParser.parse(html);

  const codes = Array.from(
    root.querySelectorAll('a[href^="/view/"]'),
    (a) => a.getAttribute('href')?.split('/')[2] ?? '',
  );

  return codes;
}
