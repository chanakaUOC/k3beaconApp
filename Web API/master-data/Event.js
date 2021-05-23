var dbConn = require('../database-config/db');

module.exports = function (app) {  //receiving "app" instance
        app.route('/beacon-api/kkk/md/event-create').post(create_event);
        app.route('/beacon-api/kkk/md/event-update').post(update_event);
        app.route('/beacon-api/kkk/md/event-inactive').post(inactive_event);
        app.route('/beacon-api/kkk/md/event').post(get_event);
        app.route('/beacon-api/kkk/md/event-list').post(get_event_list);
        app.route('/beacon-api/kkk/md/event-list-mb').post(get_event_list_mb);
        app.route('/beacon-api/kkk/md/event-cmb').post(get_event_list_cmb);
        app.route('/beacon-api/kkk/md/event-user-list').post(get_event_user_list);
        
}


function create_event(req, res) {   
    let json_obj = req.body;
    let json_obj_string=  JSON.stringify(json_obj)
    dbConn.query('CALL sp_md_event_insert(?)',
    json_obj_string
        , function (error, results, fields) {
            if (error) {
                console.log(error.message);
                res.json({
                    status: 0,
                    error: error.message
                });
            } else {              
                res.json({
                    status: 1,
                    data: results[0],
                    error: ''
                });
            }
        });
}

function update_event(req, res) {   
    let json_obj = req.body;
    let json_obj_string=  JSON.stringify(json_obj)
    dbConn.query('CALL sp_md_event_update(?)',
    json_obj_string
        , function (error, results, fields) {
            if (error) {
                res.json({
                    status: 0,
                    error: error.message
                });
            } else {              
                res.json({
                    status: 1,
                    data: results[0],
                    error: ''
                });
            }
        });
}

function inactive_event(req, res) {   
    let json_obj = req.body;
  let json_obj_string=  JSON.stringify(json_obj)
  dbConn.query('CALL sp_md_event_inactive(?)',
  json_obj_string
      , function (error, results, fields) {
          if (error) {
              res.json({
                  status: 0,
                  error: error.message
              });
          } else {              
              res.json({
                  status: 1,
                  data: results[0],
                  error: ''
              });
          }
      });
}

function get_event(req, res) {   
    let json_obj = req.body;
      dbConn.query('CALL sp_md_event_select_by_id(?,?)',
     [ json_obj.user_id,json_obj.event_id]
          , function (error, results, fields) {
              if (error) {
                  res.json({
                      status: 0,
                      error: error.message
                  });
              } else {              
                  res.json({
                      status: 1,
                      data: results[0],
                      error: ''
                  });
              }
          });   
}

function get_event_list(req, res) {   
    let json_obj = req.body;
    dbConn.query('CALL sp_md_event_select(?)',
    json_obj.user_id
        , function (error, results, fields) {
            if (error) {
                res.json({
                    status: 0,
                    error: error.message
                });
            } else {              
                res.json({
                    status: 1,
                    data: results[0],
                    error: ''
                });
            }
        });
}


function get_event_list_cmb(req, res) {   
    let json_obj = req.body;  
    dbConn.query('CALL sp_md_event_select_cmb(?)',
    json_obj.user_id
        , function (error, results, fields) {
            if (error) {
                res.json({
                    status: 0,
                    error: error.message
                });
            } else {              
                res.json({
                    status: 1,
                    data: results[0],
                    error: ''
                });
            }
        });
}
//

function get_event_user_list(req, res) {   
    let json_obj = req.body; 
  let json_obj_string=  JSON.stringify(json_obj)
    dbConn.query('CALL sp_event_user_list(?)',
    json_obj_string
        , function (error, results, fields) {
            if (error) {
                res.json({
                    status: 0,
                    error: error.message
                });
            } else {        
                
                console.log(results[1]);
                res.json({
                    status: 1,
                    data: results[0],
                    eventstat:results[1],
                    error: ''
                });
            }
        });
}



function get_event_list_mb(req, res) {  
    let jsonArData = req.body;
    let str_json_obj = JSON.stringify(jsonArData[0])
 dbConn.query('CALL sp_md_event_select_mb(?)',
    [str_json_obj.user_id]
        , function (error, results, fields) {
            if (error) {
                res.json({
                    status: 0,
                    error: error.message
                });
            } else {              
                res.json(results[0]);
            }
        });
}