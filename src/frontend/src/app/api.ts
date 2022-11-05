import axios, { AxiosRequestConfig } from "axios";
import { DragonType, LineageRoot } from "./types";

const http = axios.create({
    method: 'get',
    baseURL: import.meta.env.BASE_URL + "api"
});

function callAPI<T>(url: string, options: AxiosRequestConfig = {}){
    if('url' in options)
        throw Error("options parameter should not contain url");

    // url comes last to prevent it being overwritten via options
    return http.request<T>({...options, url })
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