const GLOBALS = require('./globals.js');
const validators  = require('./validators.js');
const config =  require('./config.js');
const Router = require('@koa/router');
const crypto  = require('crypto');
const { OnsiteError, getDataForPair, checkDragonsMatchGender } = require('./onsite.js');

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

/*
    errors
    1: warning
    2: attention
*/
router.post('/onsite-preview', async (ctx) => {
    const doChecks = !!ctx.request.body.doChecks;
    const codesAsArray = [ctx.request.body.male, ctx.request.body.female];
    const body = {
        errors: [],
        data: {
            dragons: { }
        }
    };

    // validate both are valid code syntax
    if(!codesAsArray.every(validators.code)){
        body.errors.push({ type: "Error", message: "A code has an invalid format." });
        ctx.body = body;
        return;
    }

    try {
         // do our checks, such as ensuring the dragons match the gender
        if(doChecks){
            const genderChecks = await checkDragonsMatchGender(codesAsArray);
            genderChecks.forEach(dragon => {
                if(dragon.correct === false)
                    body.errors.push({ type: "Warning", message: `Dragon ${dragon.code} is not the correct gender.` });
                else if(dragon.correct === null)
                    body.errors.push({ type: "Error", message: `Dragon ${dragon.code} couldn't be looked at for gender check. It may not exist.` });
            });
        }

        // try to fetch the html for both codes
        const dragons = await getDataForPair(codesAsArray);

        const action = (dragon, gender) => {
            // handle error'd dragon
            if(dragon instanceof OnsiteError){
                // add the error
                body.errors.push({ type: "Warning", message: dragon.message });
                // nullify dragon data
                body.data.dragons[gender] = null;
            }
            else
                body.data.dragons[gender] = dragon;
        };

        action(dragons.male, 'male');
        action(dragons.female, 'female');
    }
    // all other errors
    catch(ex){
        console.log(ex)
        body.errors.push({ type: "Error", message: GLOBALS.default_error });
    }
    finally {
        ctx.body = body;
    }
});

module.exports = router;