const axios = require("axios");
const nodeHTMLParser = require('node-html-parser');

class OnsiteError extends Error {
    constructor(message) {
        super(message);
        this.name = 'OnsiteError';
    }
}

async function grabHTML(code){ //string){
    const fetchDragon = async (code) => {
        try{ 
            return await axios.get(`https://dragcave.net/lineage/${code}`);
        }
        catch(err){
            if(err.response){
                if(err.response.status === 404)
                    throw new OnsiteError(`Dragon not found. Possibly fogged or doesn't exist. Dragon: ${code}`);
                else
                    throw new OnsiteError(`Non-200 OK response when grabbing from DC. Dragon: ${code}`);
            }
            else
                throw new OnsiteError(`Unknown error while retrieving. Dragon: ${code}`)
        }
    }

    const response = await fetchDragon(code);
    const a = performance.now();
    const root = nodeHTMLParser.parse(response.data);

    /* if(!root)
        throw new Error("Error parsing dragon."); */

    const baseULTag = root.querySelector('._2y_j ul');

    if(baseULTag === null)
        throw new OnsiteError(`Could not find ul tag. Dragon: ${code}`);
    
    const innerHTML = baseULTag.toString();
    const b = performance.now();
    console.log(`parse complete in ${(b-a)} for ${code}`);
    return innerHTML;
}

async function createRootHTMLForPair(codes){ //: [string, string]){
    const [ male, female ] = await Promise.all(codes.map(code => grabHTML(code)));

    /* // one lineage wasn't returned
    if(htmlGrabs.includes(null))
        throw new OnsiteError("Missing dragon."); */

    // create a root ul
    const root = (
        `<ul>
            <li>
                <div>
                    <img src="src/assets/placeholder.png" alt="result placeholder" />
                    <label>Result</label>
                </div>
                <ul>
                    <li>${male}</li>
                    <li>${female}</li>
                </ul>
            </li>
        </ul>`)
        // strip large whitespaces
        .replace(/\s{2,}/g, '')
        // add additional properties to links
        .replaceAll("<a ", "<a rel='noopener noreferrer' target='_blank' ")
        // replace the shorthanded urls with full links to dragcave
        .replaceAll('/images/', 'https://dragcave.net/images/')
        .replaceAll('/view/', 'https://dragcave.net/view/');

    return root;
}

module.exports = {
    OnsiteError,
    grabHTML,
    createRootHTMLForPair
}