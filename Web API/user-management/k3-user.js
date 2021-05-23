var dbConn = require('../database-config/db');




//routes
module.exports = function (app) {  //receiving "app" instance
    app.route('/beacon-api/user-management/add-user')
        .post(add_user);
    app.route('/beacon-api/user-management/validate-user-credentials')
        .post(validate_user_credentials);
    app.route('/beacon-api/user-management/validate-user-token')
        .post(validate_user_token);
    app.route('/beacon-api/user-management/logout-user')
        .post(logout_user);
    app.route('/beacon-api/user-management/canvas-list')
        .get(get_canvas_list);
}


function get_canvas_list(req, res) {
    dbConn.query('select CanvasId,CanvasName,ImageUrl,CampaignId from canvas', function (error, results, fields) {
        if (error) {
            return res.send({ status: 0, data: results, error: error.message });

        } else {
            return res.send({ status: 1, data: results, message: 'Canvas list', error: '' });
        }
    });
}
//API functions
// Add a new user  
function add_user(req, res) {
    let user = req.body.user;
    if (!user) {
        return res.status(400).send({ status: 0, error: 'User is not defined!' });
    }


    dbConn.query('CALL sp_user_insert(?,?,?)',
        [user.user_email, user.user_passward, user.user_name]
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

function validate_user_credentials(req, res) {



    let json_obj = req.body.user;
    let str_json_obj = JSON.stringify(json_obj)

    console.log("validate_user_credentials", str_json_obj);

    if (!json_obj) {
        return res.status(400).send({ error: true, message: 'Please provide user' });
    }


    dbConn.query('CALL sp_ig_um_validate_user(?)',
        str_json_obj
        , function (error, results, fields) {


            if (error) {
                res.json({
                    status: 0,
                    error: error.message
                });

            } else {
                data_result = results[0];
                res.json({
                    status: 1,
                    data: data_result,
                    error: ''
                });
            }
        });
}

function validate_user_token(req, res) {

    let user = req.body.user;


    if (!user) {
        return res.status(400).send({ error: true, message: 'Please provide user' });
    }


    dbConn.query('CALL sp_user_token_is_valid(?,?)',
        [user.user_id, user.user_token]
        , function (error, results, fields) {


            if (error) {
                res.json({
                    status: 0,
                    error: error.message
                });

            } else {
                data_result = results[0];
                console.log(data_result.length);

                if (data_result.length > 0) {
                    res.json({
                        status: 1,
                        data: data_result,
                        error: ""
                    });


                } else {
                    res.json({
                        status: 0,
                        data: data_result,
                        error: "Invalid Token"
                    });


                }

            }
        });
}


function logout_user(req, res) {

    let user = req.body.user;


    if (!user) {
        return res.status(400).send({ error: true, message: 'Please provide user' });
    }


    dbConn.query('CALL sp_user_logout(?,?)',
        [user.user_id, user.user_token]
        , function (error, results, fields) {


            if (error) {
                res.json({
                    status: 0,
                    error: error.message
                });

            } else {
                data_result = results[0];
                console.log(data_result.length);

                if (data_result.length > 0) {
                    res.json({
                        status: 1,
                        data: data_result,
                        error: ""
                    });


                } else {
                    res.json({
                        status: 0,
                        data: data_result,
                        error: "Invalid Token"
                    });


                }

            }
        });
}