var dbConn = require('../database-config/db');

/*
Visibility study functions are incuded 
*/


//routes
module.exports = function (app) {  //receiving "app" instance
    app.route('/beacon-api/poc/mobile-request-validate')
        .post(validate_mobile_request);

}


function validate_mobile_request(req, res) {


    let jsonArData = req.body;
    console.log("validate_mobile_request", jsonArData[0]);
    let str_json_obj = JSON.stringify(jsonArData[0])
    if (!str_json_obj) {
        return res.status(400).send({ error: true, message: 'Please provide user' });
    }

    console.log("str_json_obj", str_json_obj);
    dbConn.query('CALL sp_beacon_request_log_insert(?)',
        [str_json_obj]
        , function (error, results, fields) {
            if (error) {
                res.json({
                    status: 0,
                    message: error.message,
                    description: "Error occured!"
                });

            } else {

                res.json(results[0]);
            }
        });

}
