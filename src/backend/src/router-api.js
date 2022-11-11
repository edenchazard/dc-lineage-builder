const GLOBALS = require('./globals.js');
const validators  = require('./validators.js');
const config =  require('./config.js');
const Router = require('@koa/router');
const crypto  = require('crypto');
const { OnsiteError, getHTMLForPair, checkDragonsMatchGender } = require('./onsite.js');

const router = new Router({
    prefix: config.apiPath
});

router.get('/', (ctx) => {
    ctx.body = "REST API for the lineage builder. You shouldn't be here!";
});

// return a lineage
router.get('/lineage/:hash', async (ctx) => {
    try {
        const hashCode = ctx.params.hash;
        if(!validators.isLineageHash(hashCode)){
            ctx.status = 404;
            ctx.body = "This lineage could not be found.";
            return; //break out early
        }
        const con = await GLOBALS.pool.getConnection();
        const [row] = await con.execute(
            `SELECT content, last_view
            FROM saved_lineages
            WHERE hash = ?
            LIMIT 1`,
            [hashCode]);

        const lineageExists = row[0];
        if(lineageExists){
            // update access time to reset it
            await con.execute(
                `UPDATE saved_lineages
                SET last_view = CURDATE(),
                    hits = hits+1
                WHERE hash = ?`,
                [hashCode]);

            const jsonContent = row[0].content;
            ctx.body = { status: 1, dragon: JSON.parse(jsonContent) };
        }
        else{
            ctx.status = 404;
            ctx.body = "This lineage could not be found.";
        }
        con.release();
    }
    catch(err){
        console.log(err);
        ctx.status = 500;
        ctx.body = GLOBALS.default_error;
    }
});

// Save a new lineage
router.post('/lineage/create', async (ctx) => {
    try{
        /* handle integrity check to stop clever abusers uploading
        any json they want */
        const dragon = ctx.request.body;
        if(!validators.verifyIntegrity(dragon) || !validators.meetsSaveRequirements(dragon)){
            ctx.status = 500;
            ctx.body = GLOBALS.default_error;
            return;
        }

        let hash = crypto.createHash('sha1');
        const jsonString = JSON.stringify(dragon);
        hash.update(config.salt+jsonString);
        const hashCode = hash.digest('hex');

        const con = await GLOBALS.pool.getConnection();
        // Check duplicate hash. If it already exists, just return that.
        const [row] = await con.execute(
            "SELECT 1 FROM `saved_lineages` WHERE `hash`= ? LIMIT 1",
            [hashCode]);

        const lineageExists = row[0];
        if(!lineageExists){
            // hash not in db, which means this lineage is unique. insert it
            await con.execute(
                "INSERT INTO `saved_lineages` (`hash`, `last_view`, `content`) VALUES (?, CURDATE(), ?)",
                [hashCode, jsonString]);
        }

        con.release();
        ctx.body = { status: 1, "hash": hashCode };
    }
    catch(err){
        console.log(err);
        ctx.status = 500;
        ctx.body = GLOBALS.default_error;
    }
});

router.post('/onsite-preview', async (ctx) => {
    const { male, female, doChecks } = ctx.request.body;
    const codesAsArray = [male, female];

    // validate they are valid code syntax
    if(!validators.code(male) || !validators.code(female)){
        ctx.body = {
            status: 2,
            error: "A code has an invalid format."
        }
        return;
    }

    try {
         // do our checks, such as ensuring the dragons match the gender
        if(doChecks){
            const genderChecks = await checkDragonsMatchGender(codesAsArray);
            if(genderChecks.includes(false)){
                ctx.body = {
                    status: 2,
                    error: "One of the dragons is not the correct gender."
                }
                return;
            }
        }

        // try to fetch the html for both codes
        const html = await getHTMLForPair(codesAsArray);
        ctx.body = {
            status: 1,
            html
        }
    }
    catch(err){
        if(err instanceof OnsiteError){
            ctx.body = {
                status: 2,
                error: err.message
            }
        }
        else
            ctx.body = {
                status: 2,
                error: GLOBALS.default_error
            }
    }
});

module.exports = router;