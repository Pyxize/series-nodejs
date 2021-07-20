var express = require('express');
var router = express.Router();
const neo4j = require('neo4j-driver');

/* GET home page. */
router.get('/', function (req, res) {
    //res.render('db', { title: 'neo' });
    res.send('nodejs');
});


const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', '')
);
const session = driver.session({database: 'series'})


session.run("MATCH (n:Serie) RETURN n")
    .then((result) => {
        const serieArr = []
        result.records.forEach((record)=> {
            serieArr.push({
                name: record.get('n').properties['name']
            });
            //console.log(record.get('n').properties['season'].low) 
            //console.log(record.get('n').properties['name']) 
        });
        session.close()
        driver.close()
    })
    .catch((error) => {
        console.error(error);
    })
driver.close();

module.exports = router;
