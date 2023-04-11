import { promises as fs } from 'fs';

class cache {
    path = null;

    constructor(cachePath) {
        this.path = cachePath;
    }

    static async load(cachePath) {
        try {
            await fs.access(cachePath);
            return new this(cachePath);
        }
        catch (e) {
            throw new Error(`Cannot access cache: ${cachePath}`);
        }
    }
}

class portraitCache extends cache {
    constructor(cachePath) {
        super(cachePath);
    }

    // returns a new page with custom headers and cookies for dc
    // set
    async newPage(browser, options = {}) {
        // apply defaults and then overwrite
        options = { device: null, dpr: 1, ...options };

        const page = await browser.newPage();

        if (options.device !== null) {
            // emulate specifed device
            await page.emulate(options.device);
        }

        // set device pixel ratio in the header and cookie
        await page.setExtraHTTPHeaders({ "dpr": options.dpr.toString() });

        const cookies = [
            {
                'name': 'dpr',
                'value': options.dpr.toString(),
                'domain': '.dragcave.net'
            }
        ];

        await page.setCookie(...cookies);
        return page;
    }

    async downloadPortrait(code, browser, browserSettings) {
        const filePath = `${this.path}${code}.png`;

        console.log(`... Downloading image for ${code} to ${this.path}`);
        const page = await this.newPage(browser, browserSettings);

        // navigate to the lineage page
        await page.goto(`https://dragcave.net/lineage/${code}`);

        // find the img tag of the dragon we're looking for
        const element = await page.$(`img[alt='${code}']`);

        // get the uniquely generated src
        const imgUrl = await (await element.getProperty('src')).jsonValue();

        // go to the image and then download it to our cache
        const image = await page.goto(imgUrl);
        await fs.writeFile(filePath, await image.buffer());
        page.close();
    }
}

export {
    cache,
    portraitCache
}