const axios = require("axios");
const nodeHTMLParser = require('node-html-parser');
const { getDragonsByCode } = require('./dcapi');

class OnsiteError extends Error {
    constructor(message) {
        super(message);
        this.name = 'OnsiteError';
    }
}

// codes as [male, female]
async function checkDragonsMatchGender(codes){
    const apiDragons = await getDragonsByCode(codes);
    const [ male, female ] = codes;

    const checkGender = (code, shouldBe) => {
        if(!(code in apiDragons))
            return null;

        if([shouldBe, ''].includes(apiDragons[code].gender))
            return true;
        
        return false;
    }

    return [
        { code: male, correct: checkGender(male, 'Male') },
        { code: female, correct: checkGender(female, 'Female') }
    ];
}

async function grabHTML(code, filter = true){ //string){
    const fetchDragon = async (code) => {
        try{ 
            return (await axios.get(`https://dragcave.net/lineage/${code}`)).data;
        }
        catch(err){
            if(err.response){
                if(err.response.status === 404)
                    throw new OnsiteError(`Dragon not found. Possibly fogged or doesn't exist. Dragon: ${code}`);
                else
                    throw new OnsiteError(`Non-200 OK response when grabbing from DC. Dragon: ${code}`);
            }
            else
                throw new OnsiteError(`Unknown error while retrieving. Dragon: ${code}`);
        }
    }

    // root: the root returned by fetchDragon()
    // filter: whether to replace whitespace and fix urls
    const getHTML = (root, filter) => {
        const baseULTag = root.querySelector('._2y_j ul');

        if(baseULTag === null)
            throw new OnsiteError(`Could not find ul tag. Dragon: ${code}`);

        let html = baseULTag.toString();

        if(filter)
            html = html
                // strip large whitespaces
                //.replace(/\s{2,}/g, '')
                // add additional properties to links
                .replaceAll("<a ", "<a rel='noopener noreferrer' target='_blank' ")
                // replace the shorthanded urls with full links to dragcave
                .replaceAll('/images/', 'https://dragcave.net/images/')
                .replaceAll('/view/', 'https://dragcave.net/view/');

        return html;
    }

    const getGen = (root) => {
        const genNodes = root.querySelector('._2y_r');
        if(genNodes === null)
            throw new OnsiteError(`Couldn't find lineage tag. Dragon: ${code}`);

        // we use the text property instead of counting the childnodes length
        // because it could be a lineage > 13 gens
        return parseInt(genNodes.childNodes[0].toString());
    }

    try {
        const response = await fetchDragon(code);
        //const a = performance.now();
        const root = nodeHTMLParser.parse(response);

        //const b = performance.now();
        //console.log(`parse complete in ${(b-a)} for ${code}`);

        return {
            code,
            html: getHTML(root, filter),
            gen: getGen(root)
        }
    }
    catch(ex){
        return ex;
    }
}

async function getDataForPair(codes /*: [string, string] */){
    const dragons = await Promise.all(codes.map(code => grabHTML(code)));

    const [male, female] = dragons.map(dragon => {
        // return with error for this dragon
        if(dragon instanceof OnsiteError)
            return dragon;

        // surround with li tags
        else return {...dragon, html: `<li>${dragon.html}</li>`};
    });

    return {
        male,
        female
    };
}

module.exports = {
    OnsiteError,
    grabHTML,
    getDataForPair,
    checkDragonsMatchGender
}