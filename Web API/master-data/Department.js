var dbConn = require('../database-config/db');

module.exports = function (app) {  //receiving "app" instance
    app.route('/beacon-api/kkk/md/department-create').post(create_department);
    app.route('/beacon-api/kkk/md/department-update').post(update_department);
    app.route('/beacon-api/kkk/md/department-inactive').post(inactive_department);
    app.route('/beacon-api/kkk/md/department').post(get_department);
    app.route('/beacon-api/kkk/md/department-list').post(get_department_list);
    app.route('/beacon-api/kkk/md/department-cmb').post(get_department_list_cmb);
}

function create_department(req, res) {
    let json_obj = req.body;
    let json_obj_string = JSON.stringify(json_obj)
    console.log("create_department", json_obj_string);
    dbConn.query('CALL sp_md_department_insert(?)',
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

function update_department(req, res) {
    let json_obj = req.body;
    let json_obj_string = JSON.stringify(json_obj)
    dbConn.query('CALL sp_md_department_update(?)',
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

function inactive_department(req, res) {
    let json_obj = req.body;
    let json_obj_string = JSON.stringify(json_obj)
    dbConn.query('CALL sp_md_department_inactive(?)',
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

function get_department(req, res) {
    let json_obj = req.body;
    dbConn.query('CALL sp_md_department_select_by_id(?,?)',
        [json_obj.user_id, json_obj.department_id]
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

function get_department_list(req, res) {

    let jsonArData = req.body;
    let str_json_obj = JSON.stringify(jsonArData[0])
    dbConn.query('CALL sp_md_department_select(?)',
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
function get_department_list_cmb(req, res) {
    let json_obj = req.body;
    dbConn.query('CALL sp_md_department_select_cmb(?)',
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