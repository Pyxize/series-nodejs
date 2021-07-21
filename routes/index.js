var express = require('express');
var router = express.Router();
const neo4j = require('neo4j-driver');
const app =  express();



app.use(express.static('public'));
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
                id: record.get('n').identity,
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

/* DELETE serie. */
router.get('/delete/:name', function(req, res) {
  const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', '')
  );
  const session = driver.session({database: 'series'})
  console.log("DelelellLETLlt", req.params.name)
  session.run(`MATCH (s:Serie {name: "${req.params.name}"}) DETACH DELETE s`)
    .then(() => {
        session.close()
        driver.close()
        res.redirect('/');
    })
    .catch((error) => {
        console.error(error)
        session.close()
    })
  driver.close();
});

module.exports = router;
