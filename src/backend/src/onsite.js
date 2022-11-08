const axios = require("axios");
const nodeHTMLParser = require('node-html-parser');
//import util from 'util';

const error = 'e';
async function grabHTML(code){ //string){
    try {
        const response = await axios.get("https://dragcave.net/lineage/" + code);
        const a = performance.now();
        const root = nodeHTMLParser.parse(response.data);
        const baseULTag = root.querySelector('._2y_j ul');

        if(baseULTag.constructor.name === "HTMLElement"){
            const innerHTML = baseULTag.toString();
            const b = performance.now();
            //console.log(util.inspect(div, {showHidden: false, depth: 2, colors: true}));
            console.log(`parse complete in `+(b-a));
            return innerHTML;
        }
    }
    catch (e){
        error;
    }

    return null;
}

async function getRootHTMLForPair(codes){ //: [string, string]){
    try{
        const htmlGrabs = await Promise.all(codes.map(code => grabHTML(code)));

        console.log(htmlGrabs)
        // one lineage wasn't returned
        if(htmlGrabs.includes(null))
            error;

        const [ male, female ] = htmlGrabs;

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
            // replace the shorthanded urls with full links to dragcave
            .replaceAll('/images/', 'https://dragcave.net/images/')
            .replaceAll('/view/', 'https://dragcave.net/view/');

        return root;
    }
    catch (e){
        error;
    }
}

module.exports = {
    grabHTML,
    getRootHTMLForPair
}