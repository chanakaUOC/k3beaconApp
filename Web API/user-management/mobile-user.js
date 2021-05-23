var dbConn = require('../database-config/db');




//routes
module.exports = function (app) {  //receiving "app" instance

    app.route('/beacon-api/mb-user-management/register')
        .post(register_user);

    app.route('/beacon-api/mb-user-management/user-details')
        .post(get_user_details);

    app.route('/beacon-api/mb-user-management/register-event')
        .post(register_user_event);

}

function register_user(req, res) {
    let jsonArData = req.body;
    let str_json_obj = JSON.stringify(jsonArData[0])
    dbConn.query('CALL sp_mb_user_registration(?)',
        str_json_obj
        , function (error, results, fields) {
            if (error) {
                console.log(error.message);
                res.json({
                    status: 0,
                    error: error.message
                });
            } else {
                res.json(results[0]);
            }
        });
}

function register_user_event(req, res) {
    let jsonArData = req.body;
    let str_json_obj = JSON.stringify(jsonArData[0])
    dbConn.query('CALL sp_mb_user_registration_event(?)',
        str_json_obj
        , function (error, results, fields) {
            if (error) {
                console.log(error.message);
                res.json({
                    status: 0,
                    error: error.message
                });
            } else {
                res.json(results[0]);
            }
        });
}

function get_user_details(req, res) {
    let jsonArData = req.body;
    let str_json_obj = JSON.stringify(jsonArData[0])
    dbConn.query('CALL sp_mb_user_select_by_device_id(?)',
        str_json_obj
        , function (error, results, fields) {
            if (error) {
                console.log(error.message);
                res.json({
                    status: 0,
                    error: error.message
                });
            } else {
                res.json(results[0]);
            }
        });
}