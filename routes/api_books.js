var express = require('express');
var router = express.Router();
const redis = require("redis");
const {promisify} = require('util');
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const mgetAsync = promisify(client.mget).bind(client);
const zrevrangeAsync = promisify(client.zrevrange).bind(client);
import LibBooks from "../libs/LibBooks"

//
router.get('/', function(req, res, next) {
    res.send('respond with a resource-1234');
});

/******************************** 
* 
*********************************/
router.get('/tasks_index',async function(req, res) {
    client.on("error", function(error) {
        console.error(error);
    });
    try{
        var data = await zrevrangeAsync("sorted-books", 0, -1 );
        var reply_books = await mgetAsync(data);
        const book_items =  LibBooks.string_to_obj(reply_books)
//console.log(book_items);
        var category_keys = LibBooks.get_category_keys(book_items)
        var reply_category = await mgetAsync(category_keys);
        var category_items = LibBooks.string_to_obj(reply_category)
        var ret_items = [];
        book_items.forEach(function(book){
            var name = LibBooks.get_category_name(book.category_id, category_items)
            // console.log(book.category_id, name)
            book.category_name = name
            ret_items.push(book)
        });
//       console.log(reply_category);
       var param = {"docs": ret_items };
       res.json(param);       
    } catch (e) {
        console.log(e);
    }
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
module.exports = router;
