var express = require('express');
var router = express.Router();
import Mysql from "../libs/Mysql"

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource-1234');
});
/******************************** 
* 
*********************************/
router.get('/tasks_index', function(req, res) {
    let connection
    Mysql.get_connection()
    .then((conn) => {
        connection = conn;
       return connection.query('SELECT * FROM tasks order by id desc');
    }).then((results) => {
        connection.end();

        var param = {"docs": results };
        res.json(param);
    });    
});
/******************************** 
* 
*********************************/
router.post('/tasks_new', function(req, res, next){
    let data = req.body

    let sql = `
        INSERT INTO tasks (title , content, created_at ) VALUES
        ('${ data.title }',
        '${ data.content }',
        now() 
        )
    `;
    let connection;
    Mysql.get_connection()
    .then((conn) => {
        connection = conn;
        connection.query( sql )
        connection.end();
        res.json(data);
    });
});
/******************************** 
* 
*********************************/
router.get('/tasks_show/:id', function(req, res, next) {
    let sql = `
        SELECT * FROM tasks where id=${ req.params.id }
    `;
    let connection;
    Mysql.get_connection()
    .then((conn) => {
        connection = conn;
       return connection.query(sql);
    }).then((results ) => {
//        console.log(results );
        results.forEach(result => {
            console.log(result.id );
        });
        connection.end();
        var param = {"docs": results };
        res.json(param);
    });
});
/******************************** 
* 
*********************************/
router.post('/tasks_update', function(req, res, next){
    let data = req.body

    let sql = `
        update tasks set title = '${ data.title }' 
        , content = '${ data.content }'
        where id = ${data.id}
    `;
    let connection ;
    Mysql.get_connection().then((conn) => {
        connection = conn;
        connection.query( sql )
        connection.end();
        res.json(data);
    });
});
/******************************** 
* 
*********************************/
router.get('/tasks_delete/:id', function(req, res, next){
    let sql = `
        delete from tasks where id = ${req.params.id};
    `;
    let connection;
    Mysql.get_connection().then((conn) => {
        connection = conn;
        connection.query( sql )
        connection.end();
        res.json(req.params.id);
    });
});

module.exports = router;
