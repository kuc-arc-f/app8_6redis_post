var express = require('express');
var router = express.Router();
const redis = require("redis");
const client = redis.createClient();

// import Mysql from "../libs/Mysql"

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource-1234');
});
/******************************** 
* 
*********************************/
router.get('/tasks_index', function(req, res) {
    client.on("error", function(error) {
        console.error(error);
    });
    /*
    */
    var key_list ="list_3"
    var items = [];
    client.lrange(key_list, 0, -1, (err, reply) => {
        reply.forEach((item, i) => {
console.log(item, i)
            var dat = JSON.parse(item || '[]')
            items.push(dat)
        })        
        var param = {"docs": items };
        res.json(param);
    })    
});


module.exports = router;
