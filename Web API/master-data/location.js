var dbConn = require('../database-config/db');

module.exports = function (app) {  //receiving "app" instance
    app.route('/beacon-api/kkk/md/location-create').post(create_location);
    app.route('/beacon-api/kkk/md/location-update').post(update_location);
    app.route('/beacon-api/kkk/md/location-inactive').post(inactive_location);
    app.route('/beacon-api/kkk/md/location').post(get_location);
    app.route('/beacon-api/kkk/md/location-list').post(get_location_list);
    app.route('/beacon-api/kkk/md/location-cmb').post(get_location_list_cmb);
}


function create_location(req, res) {
    let json_obj = req.body;
    let json_obj_string = JSON.stringify(json_obj)
    console.log("create_location", json_obj_string);
    dbConn.query('CALL sp_md_location_insert(?)',
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

function update_location(req, res) {
    let json_obj = req.body;
    let json_obj_string = JSON.stringify(json_obj)
    dbConn.query('CALL sp_md_location_update(?)',
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

function inactive_location(req, res) {
    let json_obj = req.body;
    let json_obj_string = JSON.stringify(json_obj)
    dbConn.query('CALL sp_md_location_inactive(?)',
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

function get_location(req, res) {
    let json_obj = req.body;
    dbConn.query('CALL sp_md_location_select_by_id(?,?)',
        [json_obj.user_id, json_obj.location_id]
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

function get_location_list(req, res) {
    let json_obj = req.body;
    dbConn.query('CALL sp_md_location_select(?)',
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


function get_location_list_cmb(req, res) {
    let json_obj = req.body;
    dbConn.query('CALL sp_md_location_select_cmb(?)',
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