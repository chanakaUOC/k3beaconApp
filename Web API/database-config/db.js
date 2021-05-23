var mysql = require('mysql');
var dbConn = mysql.createConnection({
    /*
    My SQL Connection details goes here 
    */
  /*
    host: ,
    port: ,
    user: ,
    password: ,
    database: 
    */

});
dbConn.connect(function(err) {
    if (err) {
console.log('Connection error: '+err.message);

    }else{
        console.log('Database :Successfully connected!!');
    }
});

module.exports = dbConn;