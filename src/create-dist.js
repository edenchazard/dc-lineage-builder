import files from 'fs';
const fs = files.promises;
const DIST = "./dist";
`   rm -rf ./dist/backend &&
    mkdir ./dist/backend &&
    cp -R ./backend/src/* ./dist/backend &&
    cp ./backend/package.json ./dist/backend/package.json &&
    cp ./backend/package-lock.json ./dist/backend/package-lock.json &&
    rm -rf ./dist/frontend &&
    mkdir ./dist/frontend &&
    mv ./frontend/src/dist ./dist/frontend
`;

/*    cd ./frontend/src &&
    vue-cli-service build --modern &&
    cd ... &&*/
async function createDistFolder(){
}

async function buildBackend(){
    const BACKEND = "./backend";


}

async function buildFrontend(){

}

(function(){
    await createDistFolder();
    buildBackend();
    buildFrontend();
})();