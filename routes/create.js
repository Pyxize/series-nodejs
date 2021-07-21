var express = require('express');
var router = express.Router();
const neo4j = require('neo4j-driver');

/* GET Form add serie. */
router.get('/', function (req, res) {
    res.render('formAddSerie');
});

router.post('/', function (req, res) {
    const driver = neo4j.driver(
        'neo4j://localhost:7687',
        neo4j.auth.basic('neo4j', '')
    );

    const session = driver.session({ database:'series' });

    session
        .run('MERGE (s:Serie {  name: $name, season: $season, released_in: $released_in, original_network: $original_network}) MERGE (a:Actors {name: $actor}) CREATE(a)-[test:PLAY_IN]->(s)', 
                { name: req.body.title, season: req.body.season, released_in: req.body.released_in, original_network: req.body.original_network, actor: req.body.actor})    
        .then(() => {
            session.close(() => {
                console.log('create')
            })
        })
        .catch((error) => {
            console.log(error)
            session.close()
        });
    res.redirect('/');
});

const driver = neo4j.driver(
    'neo4j://localhost:7687',
    neo4j.auth.basic('neo4j', '')
);
const session = driver.session({ database:'series' });

// async function main() {
//     try {
//         const result = await session.run("MATCH (n:Serie) RETURN n")
//         const singleRecord = result.records[0]
//         const greeting = singleRecord.get(0)
//         // console.log(greeting)
//     } finally {
//         await session.close()
//     }
//     // on application exit:
//     await driver.close()
// }

module.exports = router;
