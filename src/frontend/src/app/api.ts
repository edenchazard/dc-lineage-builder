import axios, { AxiosRequestConfig } from "axios";
import { DragonType, LineageRoot } from "./types";

interface APIResponse {
    status: number
}

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

interface LineageResponse extends APIResponse {
    dragon: DragonType
}
async function getLineage(hash: string){
    return callAPI<LineageResponse>(`/lineage/${hash}`)
}

interface LineageGenerationResponse extends APIResponse {
    hash: string
}
function saveLineage(tree: LineageRoot){
    return callAPI<LineageGenerationResponse>('/lineage/create', {
        method: 'post',
        data: tree
    });
}

interface OnSitePreviewResponse extends APIResponse {
    html: string
}
function getPreviewOnsite(maleCode: string, femaleCode: string){
    return callAPI<OnSitePreviewResponse>(`/onsite-preview/${maleCode}/${femaleCode}`, {
        method: 'post'
    });
}

export {
    callAPI,
    getLineage,
    saveLineage,
    getPreviewOnsite
}