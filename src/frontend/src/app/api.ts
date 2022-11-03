import axios, { AxiosRequestConfig } from "axios";
import { DragonType, LineageRoot } from "./types";
const API_URL = import.meta.env.BASE_URL + "api";

function callAPI<T>(url: string, options: AxiosRequestConfig = {}){
    url = API_URL + url;

    if(options.url)
        throw Error("options parameter should not contain url");

    const defaults: AxiosRequestConfig = {
        method: 'get'
    };

    // url comes last to prevent it being overwritten via options
    return axios.request<T>({...defaults, ...options, url })
}

interface LineageResponse {
    status: number,
    dragon: DragonType
}
async function getLineage(hash: string){
    return callAPI<LineageResponse>(`/lineage/${hash}`)
}

interface LineageGenerationResponse {
    status: number,
    hash: string
}
function saveLineage(tree: LineageRoot){
    return callAPI<LineageGenerationResponse>('/lineage/create', {
        method: 'post',
        data: tree
    });
}

export {
    callAPI,
    getLineage,
    saveLineage
}