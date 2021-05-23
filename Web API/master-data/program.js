var dbConn = require('../database-config/db');

module.exports = function (app) {  //receiving "app" instance
    app.route('/beacon-api/kkk/md/program-create').post(create_program);
    app.route('/beacon-api/kkk/md/program-update').post(update_program);
    app.route('/beacon-api/kkk/md/program-inactive').post(inactive_program);
    app.route('/beacon-api/kkk/md/program').post(get_program);
    app.route('/beacon-api/kkk/md/program-list').post(get_program_list);
    app.route('/beacon-api/kkk/md/program-cmb').post(get_program_list_cmb);
}


function create_program(req, res) {
    let json_obj = req.body;
    let json_obj_string = JSON.stringify(json_obj)
    dbConn.query('CALL sp_md_program_insert(?)',
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

function update_program(req, res) {
    let json_obj = req.body;
    let json_obj_string = JSON.stringify(json_obj)
    dbConn.query('CALL sp_md_program_update(?)',
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

function inactive_program(req, res) {
    let json_obj = req.body;
    let json_obj_string = JSON.stringify(json_obj)
    dbConn.query('CALL sp_md_program_inactive(?)',
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

function get_program(req, res) {
    let json_obj = req.body;
    console.log("sp_md_program_select_by_id", json_obj);
    dbConn.query('CALL sp_md_program_select_by_id(?,?)',
        [json_obj.user_id, json_obj.program_id]
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

function get_program_list(req, res) {
    let jsonArData = req.body;
    let str_json_obj = JSON.stringify(jsonArData[0])
    dbConn.query('CALL sp_md_program_select(?)',
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


function get_program_list_cmb(req, res) {
    let json_obj = req.body;
    dbConn.query('CALL sp_md_program_select_cmb(?)',
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