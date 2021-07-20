var express = require('express');
var router = express.Router();
const neo4j = require('neo4j-driver');



/* GET home page. */
router.get('/', function(req, res) {
  const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', '')
  );
  const session = driver.session({database: 'series'})
  const allSeries = []
  session.run("MATCH (n:Serie) RETURN n")
    .then((result) => {
        result.records.forEach((record)=> {
            allSeries.push({
                name: record.get('n').properties['name'],
                season: record.get('n').properties['season']
            });
        });
        res.render('index', { allSeries: allSeries});
        session.close()
        driver.close()
    })
    .catch((error) => {
        console.error(error);
    })
  driver.close();
});

module.exports = router;
