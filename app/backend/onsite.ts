import axios, { AxiosError } from 'axios';
import nodeHTMLParser from 'node-html-parser';
import { getDragonsByCode } from './dcApi.js';

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

/**
 * Check a pair of dragons are male and female
 * @param codes Format: [male, female]
 */
export async function checkDragonsMatchGender(
  codes: [string, string],
): Promise<{ code: string; correct: boolean | null }[]> {
  const apiDragons = await getDragonsByCode(codes);
  const [male, female] = codes;

  const checkGender = (code: string, shouldBe: 'Male' | 'Female') => {
    if (!(code in apiDragons)) throw new OnsiteDragonNotFoundError(code);

    if ([shouldBe, ''].includes(apiDragons[code].gender)) return true;

    return false;
  };

  return [
    { code: male, correct: checkGender(male, 'Male') },
    { code: female, correct: checkGender(female, 'Female') },
  ];
}

/**
 *
 * @param code
 * @param filter Whether to replace whitespace and fix urls
 * @returns
 */
export async function grabHTML(
  code: string,
  options: GetHTMLOptions,
): Promise<DragonOnsite> {
  const fetchDragon = async (code: string, dpr: GetHTMLOptions['dpr'] = 1) => {
    try {
      return (
        await axios.get(`https://dragcave.net/lineage/${code}`, {
          headers: {
            Cookie: `dpr=${dpr};`,
          },
        })
      ).data;
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        if (err.response.status === 404)
          throw new OnsiteDragonNotFoundError(code);
        else
          throw new OnsiteError(
            `Non-200 OK response when grabbing from DC. Dragon: ${code}`,
          );
      } else
        throw new OnsiteError(
          `Unknown error while retrieving. Dragon: ${code}`,
        );
    }
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
          const image = await axios.get(
            new URL(url, 'https://dragcave.net').href,
            {
              responseType: 'arraybuffer',
            },
          );

          return {
            url,
            base64:
              'data:image/png;base64,' +
              Buffer.from(image.data).toString('base64'),
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

  const response = await fetchDragon(code, options.dpr ?? 1);

  const root = nodeHTMLParser
    .parse(response)
    .querySelector(`a[href='/view/${code}']`)
    ?.closest('div > ul').parentNode as unknown as HTMLElement;

  if (!root) throw new OnsiteError(`Couldn't find root. Dragon: ${code}`);

  return {
    code,
    html: await getHTML(root, options),
    gen: getGen(root),
  };
}

/**
 * Returns data for a male and female pair of dragons
 */
export async function getDataForPair(
  codes: [string, string],
  options: GetHTMLOptions = {},
): Promise<DragonPair> {
  const dragons = await Promise.all(
    codes.map((code) => grabHTML(code, { filter: true, ...options })),
  );

  const [male, female] = dragons.map((dragon) => {
    // return with error for this dragon
    if (dragon instanceof OnsiteError) return dragon;
    // surround with li tags
    else return { ...dragon, html: `<li>${dragon.html}</li>` };
  });

  return {
    male,
    female,
  };
}
