import nodeHTMLParser from 'node-html-parser';
import { u as useRuntimeConfig, o as ofetch } from '../nitro/nitro.mjs';

function createDcApiFetch() {
  const config = useRuntimeConfig();
  return ofetch.create({
    baseURL: "https://dragcave.net/api/v2",
    timeout: 1e4,
    headers: {
      Authorization: `Bearer ${config.clientSecret}`
    }
  });
}
const dcApiFetch = createDcApiFetch;

class OnsiteError extends Error {
  constructor(message) {
    super(message);
    this.name = "OnsiteError";
  }
}
class OnsiteDragonNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "OnsiteDragonNotFoundError";
  }
}
class APIError extends Error {
  constructor(message) {
    super(message);
    this.name = "APIError";
  }
}
async function checkDragonsMatchGender(codes) {
  const response = await dcApiFetch(`/dragons`, {
    body: new URLSearchParams({
      ids: codes.join(",")
    })});
  if (response.errors.length > 0) throw new APIError("Error in response.");
  const checkGender = (code, shouldBe) => {
    if (!(code in response.dragons)) throw new OnsiteDragonNotFoundError(code);
    if ([shouldBe, ""].includes(response.dragons[code].gender)) return true;
    return false;
  };
  return [
    { code: codes[0], correct: checkGender(codes[0], "Male") },
    { code: codes[1], correct: checkGender(codes[1], "Female") }
  ];
}
async function grabHTML(code, options = {}) {
  var _a, _b, _c;
  const _options = {
    dpr: 1,
    filter: false,
    ...options
  };
  const fetchDragon = async (code2, dpr = 1) => {
    return ofetch(`https://dragcave.net/lineage/${code2}`, {
      headers: {
        Cookie: `dpr=${dpr};`
      },
      onResponseError(response2) {
        if (response2.response.status === 404) {
          throw new OnsiteError(`Error while fetching. Dragon: ${code2}`);
        }
        throw new OnsiteError(
          `Unknown error while retrieving. Dragon: ${code2}`
        );
      }
    });
  };
  const getHTML = async (root2, options2) => {
    const baseULTag = root2.querySelector("ul");
    if (baseULTag === null)
      throw new OnsiteError(`Could not find ul tag. Dragon: ${code}`);
    let html = baseULTag.toString();
    if (options2.filter) {
      const images = [
        ...new Set(
          Array.from(baseULTag.querySelectorAll("img")).map(
            (img) => img.getAttribute("src")
          )
        )
      ];
      const base64Images = await Promise.all(
        images.map(async (url) => {
          const response2 = await ofetch(
            new URL(url, "https://dragcave.net").href,
            {
              onResponseError() {
                throw new OnsiteError(
                  `Error while fetching image. Dragon: ${code}`
                );
              }
            }
          );
          return {
            url,
            base64: "data:image/png;base64," + Buffer.from(await response2.arrayBuffer()).toString("base64")
          };
        })
      );
      html = html.replaceAll("<a ", "<a rel='noopener noreferrer' target='_blank' ").replaceAll("/view/", "https://dragcave.net/view/");
      base64Images.forEach(
        (img) => html = html.replaceAll(img.url, img.base64)
      );
    }
    return html;
  };
  const getGen = (root2) => {
    var _a2;
    const genNode = root2.querySelector("span > span:first-child");
    if (genNode === null)
      throw new OnsiteError(`Couldn't find lineage tag. Dragon: ${code}`);
    return parseInt((_a2 = genNode.textContent) != null ? _a2 : "1");
  };
  const response = await fetchDragon(code, (_a = _options.dpr) != null ? _a : 1);
  const root = nodeHTMLParser.parse(response);
  const lineageRoot = (_c = (_b = root == null ? void 0 : root.querySelector(`a[href='/view/${code}']`)) == null ? void 0 : _b.closest("div > ul")) == null ? void 0 : _c.parentNode;
  if (!lineageRoot)
    throw new OnsiteError(`Couldn't find root. Dragon: ${code}`);
  return {
    code,
    html: await getHTML(lineageRoot, _options),
    gen: getGen(lineageRoot)
  };
}
async function getDataForPair(codes, options = {}) {
  const dragons = await Promise.all(
    codes.map((code) => grabHTML(code, { filter: true, ...options }))
  );
  const [male, female] = dragons.map((dragon) => {
    if (dragon instanceof OnsiteError) return dragon;
    else return { ...dragon, html: `<li>${dragon.html}</li>` };
  });
  return {
    male,
    female
  };
}
function getDragonCodesFromHTML(html) {
  const root = nodeHTMLParser.parse(html);
  const codes = Array.from(
    root.querySelectorAll('a[href^="/view/"]'),
    (a) => {
      var _a, _b;
      return (_b = (_a = a.getAttribute("href")) == null ? void 0 : _a.split("/")[2]) != null ? _b : "";
    }
  );
  return codes;
}

export { OnsiteDragonNotFoundError as O, getDragonCodesFromHTML as a, checkDragonsMatchGender as b, createDcApiFetch as c, getDataForPair as d, grabHTML as g };
//# sourceMappingURL=onsite.mjs.map
