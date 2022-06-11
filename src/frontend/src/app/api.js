
import axios from "axios";
const API_URL = "./api";

export function callAPI(options){
    options.url = API_URL+options.url;
    const defaults = {
        method: 'get'
    };

    return axios({...defaults, ...options })
}

export function getLineageData(hash){
    return callAPI({ url: `/lineage/${hash}`});
}

export function generateUrl(tree){
    return callAPI({
        url: `/lineage/create`,
        method: 'post',
        data: tree
    });
}