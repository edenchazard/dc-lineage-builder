
import axios from "axios";
import { DragonType, LineageRoot } from "./types";
const API_URL = "/api";

export function callAPI(options){
    options.url = API_URL+options.url;
    const defaults = {
        method: 'get'
    };

    return axios.get({...defaults, ...options })
}

interface LineageResponse {
    data: DragonType
}
export function getLineageData(hash: string){
    return callAPI({ url: `/lineage/${hash}`});
}

export function generateUrl(tree: LineageRoot){
    return callAPI({
        url: `/lineage/create`,
        method: 'post',
        data: tree
    });
}