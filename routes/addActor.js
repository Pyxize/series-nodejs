var express = require('express');
var router = express.Router();
const neo4j = require('neo4j-driver');

/* GET Form add actor. */
router.get('/:id', function (req, res) {
    res.render('formAddActor', {serieId: req.param.id});
});

router.post('/:id', function (req, res) {
    const driver = neo4j.driver(
        'neo4j://localhost:7687',
        neo4j.auth.basic('neo4j', '')
    );
    idSerie = req.params.id
    const session = driver.session({ database:'series' });
    session
        .run(`MATCH (s:Serie) where id(s) = ${idSerie} MERGE (a:Actors {name: "${req.body.actor}"}) CREATE(a)-[:PLAY_IN]->(s)`)    
        .then(() => {
            session.close(() => {
                console.log('create actor')
            })
        })
        .catch((error) => {
            console.log(error)
            session.close()
        });
    res.redirect('/detail/' + idSerie);
});

const driver = neo4j.driver(
    'neo4j://localhost:7687',
    neo4j.auth.basic('neo4j', '')
);
const session = driver.session({ database:'series' });

module.exports = router;
