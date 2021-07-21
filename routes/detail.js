var express = require('express');
var router = express.Router();
const neo4j = require('neo4j-driver');

/* GET serie page. */
router.get('/:id', function(req, res) {
  const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', '')
  );
  const session = driver.session({database: 'series'})
  const actors = []
  const serie = []
  session.run(`match (a:Actors)-->(s:Serie) where id(s) = ${req.params.id} return a, s`)
    .then((result) => {
        result.records.forEach((record)=> {
          actors.push({
                id: record.get('a').identity,
                name: record.get('a').properties['name']
          });
        });
        serie.push({
          id: result.records[0].get('s').identity,
          name: result.records[0].get('s').properties['name'],
          released_in: result.records[0].get('s').properties['released_in'],
          season: result.records[0].get('s').properties['season'],
          original_network: result.records[0].get('s').properties['original_network']
      });
        res.render('seriePage', { serie: serie, actors: actors});
        session.close()
        driver.close()
    })
    .catch((error) => {
        console.error(error);
    })
  driver.close();
});

module.exports = router;
