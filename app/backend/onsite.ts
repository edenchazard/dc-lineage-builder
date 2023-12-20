import axios, { AxiosError } from 'axios';
import nodeHTMLParser from 'node-html-parser';
import { getDragonsByCode } from './dcapi';

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
    if (!(code in apiDragons)) return null;

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
  filter = true,
): Promise<DragonOnsite> {
  const fetchDragon = async (code: string) => {
    try {
      return (await axios.get(`https://dragcave.net/lineage/${code}`)).data;
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        if (err.response.status === 404)
          throw new OnsiteError(
            `Dragon not found. Possibly fogged or doesn't exist. Dragon: ${code}`,
          );
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
   * @param filter Whether to replace whitespace and fix urls
   */
  const getHTML = (root: HTMLElement, filter: boolean): string => {
    const baseULTag = root.querySelector('ul');

    if (baseULTag === null)
      throw new OnsiteError(`Could not find ul tag. Dragon: ${code}`);

    let html = baseULTag.toString();

    if (filter)
      html = html
        // strip large whitespaces
        //.replace(/\s{2,}/g, '')
        // add additional properties to links
        .replaceAll('<a ', "<a rel='noopener noreferrer' target='_blank' ")
        // replace the shorthanded urls with full links to dragcave
        .replaceAll('/images/', 'https://dragcave.net/images/')
        .replaceAll('/view/', 'https://dragcave.net/view/');

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

  try {
    const response = await fetchDragon(code);
    //const a = performance.now();
    const root = nodeHTMLParser
      .parse(response)
      .querySelector(`a[href='/view/${code}']`)
      ?.closest('div > ul').parentNode as unknown as HTMLElement;

    if (!root) throw new OnsiteError(`Couldn't find root. Dragon: ${code}`);

    //const b = performance.now();
    //console.log(`parse complete in ${(b-a)} for ${code}`);

    return {
      code,
      html: getHTML(root, filter),
      gen: getGen(root),
    };
  } catch (ex: unknown) {
    return ex;
  }
}

/**
 * Returns data for a male and female pair of dragons
 */
export async function getDataForPair(
  codes: [string, string],
): Promise<DragonPair> {
  const dragons = await Promise.all(codes.map((code) => grabHTML(code)));

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
