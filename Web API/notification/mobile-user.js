var dbConn = require('../database-config/db');




//routes
module.exports = function (app) {  //receiving "app" instance
    app.route('/beacon-api/kkk/mdusernotification/create-mdusernotification')
        .post(create_mdusernotification);
    app.route('/beacon-api/kkk/mdusernotification/mdusernotification-list')
        .post(get_mdusernotification_list);
    app.route('/beacon-api/kkk/mdusernotification/mdusernotification-byid')
        .post(get_mdusernotification_byid);
    app.route('/beacon-api/kkk/mdusernotification/update-mdusernotification')
        .post(udpate_mdusernotification);
    app.route('/beacon-api/kkk/mdusernotification/delete-mdusernotification')
        .post(delete_mdusernotification);
    app.route('/beacon-api/kkk/mdusernotification/mdusernotification-metadata')
        .post(get_mdusernotification_metadata);

}


function create_mdusernotification(req, res) {

    let jsonArData = req.body;
    let str_json_obj = JSON.stringify(jsonArData)

    if (!str_json_obj) {
        return res.status(400).send({ error: true, message: 'Please fill required fields' });
    }

    dbConn.query('CALL sp_msg_mdusernotification_insert(?)',
        str_json_obj
        , function (error, results, fields) {
            if (error) {

                console.log(error);
                res.json({
                    status: 0,
                    message: error.message,
                    description: "Error occured!"
                });

            } else {

                res.json({
                    status: 1,
                    data: results[0],
                    description: "Data successfully saved"
                }
                );
            }
        });


}
//



function delete_mdusernotification(req, res) {

    let jsonArData = req.body;
    let str_json_obj = JSON.stringify(jsonArData)

    if (!str_json_obj) {
        return res.status(400).send({ error: true, message: 'Please provide data' });
    }
    dbConn.query('CALL sp_msg_mdusernotification_delete(?)',
        str_json_obj
        , function (error, results, fields) {
            if (error) {

                console.log(error);
                res.json({
                    status: 0,
                    message: error.message,
                    description: "Error occured!"
                });

            } else {

                res.json({
                    status: 1,
                    data: results[0],
                    description: "Data successfully updated"
                }
                );
            }
        });


}

function get_mdusernotification_list(req, res) {

    let jsonArData = req.body;
    let str_json_obj = JSON.stringify(jsonArData)

    if (!str_json_obj) {
        return res.status(400).send({ error: true, message: 'Please provide data' });
    }

    dbConn.query('CALL sp_msg_mdusernotification_select(?)',
        str_json_obj
        , function (error, results, fields) {
            if (error) {

                console.log(error);
                res.json({
                    status: 0,
                    message: error.message,
                    description: "Error occured!"
                });

            } else {

                res.json({
                    status: 1,
                    data: results[0],
                    description: "Error occured!"
                }
                );
            }
        });


}

function get_mdusernotification_byid(req, res) {

    let jsonArData = req.body;
    let str_json_obj = JSON.stringify(jsonArData)

    if (!str_json_obj) {
        return res.status(400).send({ error: true, message: 'Please provide data' });
    }

    dbConn.query('CALL sp_msg_mdusernotification_select_byid(?)',
        str_json_obj
        , function (error, results, fields) {
            if (error) {

                console.log(error);
                res.json({
                    status: 0,
                    message: error.message,
                    description: "Error occured!"
                });

            } else {

                res.json({
                    status: 1,
                    data: results[0],
                    locationData: results[1]
                }
                );
            }
        });


}
///sp_msg_mdusernotification_update
function udpate_mdusernotification(req, res) {

    let jsonArData = req.body;
    let str_json_obj = JSON.stringify(jsonArData)

    if (!str_json_obj) {
        return res.status(400).send({ error: true, message: 'Please provide data' });
    }

    dbConn.query('CALL sp_msg_mdusernotification_update(?)',
        str_json_obj
        , function (error, results, fields) {
            if (error) {

                console.log(error);
                res.json({
                    status: 0,
                    message: error.message,
                    description: "Error occured!"
                });

            } else {

                res.json({
                    status: 1,
                    data: results[0],
                    description: "Data successfully saved"
                }
                );
            }
        });


}



function get_mdusernotification_metadata(req, res) {

    let jsonArData = req.body;
    let str_json_obj = JSON.stringify(jsonArData)

    if (!str_json_obj) {
        return res.status(400).send({ error: true, message: 'Please provide data' });
    }

    dbConn.query('CALL sp_msg_mdusernotification_metadata(?)',
        str_json_obj
        , function (error, results, fields) {
            if (error) {

                console.log(error);
                res.json({
                    status: 0,
                    message: error.message,
                    description: "Error occured!"
                });

            } else {

                res.json({
                    status: 1,
                    locationData: results[0],
                    programData: results[1],
                    departmentData: results[2],
                    eventData: results[3]

                }
                );
            }
        });


}