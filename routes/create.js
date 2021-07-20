var express = require('express');
var router = express.Router();
const neo4j = require('neo4j-driver');

/* GET Form add serie. */
router.get('/', function (req, res) {
    res.render('formAddSerie');
});

router.post('/', function (req, res) {
    console.log("AJOUT SERIE TEST")
    console.log(req.body.title)
    console.log(req.body.season)
    const driver = neo4j.driver(
        'neo4j://localhost:7687',
        neo4j.auth.basic('neo4j', '')
    );

    const session = driver.session({ database:'series' });
    session.run('CREATE (loki:Serie {  name: $name, season: $season})', { name: req.body.title, season: req.body.season})
    .then(() => {
        session.close(() => {
            console.log('create')
        })
    })
    res.redirect('/');
});

const driver = neo4j.driver(
    'neo4j://localhost:7687',
    neo4j.auth.basic('neo4j', '')
);
const session = driver.session({ database:'series' });

async function main() {
    try {
        const result = await session.run("MATCH (n:Serie) RETURN n")
        const singleRecord = result.records[0]
        const greeting = singleRecord.get(0)
        // console.log(greeting)
    } finally {
        await session.close()
    }
    // on application exit:
    await driver.close()
}

main();


// session.run('CREATE (loki:Serie { name: $name })', { name: "loki" })
//     .then(() => {
//         session.close(() => {
//             console.log('create')
//         })
//     })
module.exports = router;
