var express = require('express');
var router = express.Router();
const redis = require("redis");
// const {promisify} = require('util');
const client = redis.createClient();
import LibSortedTasks from "../libs/LibSortedTasks"

//
function convert_array(get_items ){
    var ret = [];
    get_items.forEach(async function (get_item) {
        var row = JSON.parse(get_item || '[]')
//        console.log( row )
        ret.push(row)
    });
    return ret;
}

//
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
    var key_sorted  = "sorted_tasks";
    client.zrevrange(key_sorted, 0, -1, function(err, reply){
        if(err){
            console.log("error-zrevrange:"+ err );
            return;
        }else{
            client.mget(reply, function(err, reply_get) {
// console.log( reply_get );
                var d= convert_array(reply_get)
                var param = {"docs": d };
                res.json(param); 
//    console.log( "soated-items : ", d );
            });
        }
    });
});
/******************************** 
* 
*********************************/
router.get('/tasks_show/:id', function(req, res, next) {
    console.log(req.params.id );
    client.on("error", function(error) {
        console.error(error);
    });  
    client.get(req.params.id, function(err, reply_get) {
        console.log(reply_get );
        var row = JSON.parse(reply_get || '[]')
        var param = {"docs": row };
        res.json(param); 
    });        

});
/******************************** 
* 
*********************************/
router.post('/tasks_new', function(req, res, next){
    let data = req.body
//    console.log( data );
    var key_idx  = "idx-task";
    var key_head  = "task:";
    var key_sorted  = "sorted_tasks";
    client.on("error", function(error) {
        console.error(error);
    });    
    client.incr(key_idx, function(err, reply) {
        var key = key_head + String(reply)
        console.log( key );
        client.zadd(key_sorted , reply , key );
        var item = {
            title: data.title ,  
            content: data.content ,
            id: key,
        };
        var json = JSON.stringify( item );
        client.set(key , json , function() {
            var param = {"ret": 1 };
            res.json(param); 
        });
    });      
});
/******************************** 
* 
*********************************/
router.post('/tasks_update', function(req, res, next){
    let data = req.body
console.log( data );
    client.on("error", function(error) {
        console.error(error);
    });
    var key = data.id;
    var item = {
        title: data.title ,  
        content: data.content ,
        id: data.id,
    };
    var json = JSON.stringify( item );
//console.log( json );
    client.set(key , json , function() {
        var param = {"ret": 1 };
        res.json(param);
    });
});
/******************************** 
* 
*********************************/
router.get('/tasks_delete/:id', function(req, res, next){
    let data = req.body
console.log( req.params.id );
    client.on("error", function(error) {
        console.error(error);
    });  
    var key_sorted  = "sorted_tasks";  
    client.zrem(key_sorted , req.params.id , function() {
        var param = {"ret": 1 };
        res.json(param);
    });
});
/******************************** 
* 
*********************************/
router.post('/file_receive', function(req, res, next) {
    let data = req.body
    var items = JSON.parse(data.data || '[]')
    var ret_arr = {ret:0, msg:""}
    client.on("error", function(error) {
        console.error(error);
        ret_arr.msg = error
        res.json(ret_arr);
    });  
//console.log( items )
    var ret = LibSortedTasks.add_items(client, items);
    var param = {"ret": ret };
    res.json(param);
});
module.exports = router;
