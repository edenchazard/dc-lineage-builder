
import axios from "axios";
const API_URL = "./api";

const backend ={
    call(options){
        options.url = API_URL+options.url;
        const defaults = {
            method: 'get'
        };

        return axios({...defaults, ...options })
    },

    getLineageData(hash){
        return backend.call({ url: `/lineage/${hash}`});
    },

    generateUrl(tree){
        return backend.call({
            url: `/lineage/create`,
            method: 'post',
            data: tree
        });
    }
}

export default backend;