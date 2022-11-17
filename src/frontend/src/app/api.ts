import axios, { AxiosRequestConfig } from "axios";
import { DragonType, LineageRoot } from "./types";

interface APIResponse {
    errors: Array<{ type: 1 | 2, msg: string }>,
    data: null | Object
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
    data: {
        dragons: {
            male: {
                code: string,
                html: string,
                gen: number
            },
            female: {
                code: string,
                html: string,
                gen: number
            }
        }
    }
}
function getOnSitePreview(male: string, female: string, doChecks: boolean = false){
    return callAPI<OnSitePreviewResponse>(`/onsite-preview`, {
        method: 'post',
        data: {
            male,
            female,
            doChecks
        }
    });
}

export {
    callAPI,
    getLineage,
    saveLineage,
    getOnSitePreview
}