var dbConn = require('../database-config/db');




//routes
module.exports = function (app) {  //receiving "app" instance
    app.route('/beacon-api/kkk/notification/create-notification')
        .post(create_notification);

    app.route('/beacon-api/kkk/notification/notification-list')
        .post(get_notification_list);

    app.route('/beacon-api/kkk/notification/notification-byid')
        .post(get_notification_byid);
    //udpate_notification
    app.route('/beacon-api/kkk/notification/update-notification')
        .post(udpate_notification);
    //sp_msg_notification_delete
    app.route('/beacon-api/kkk/notification/delete-notification')
        .post(delete_notification);

    app.route('/beacon-api/kkk/notification/notification-metadata')
        .post(get_notification_metadata);

    app.route('/beacon-api/kkk/notification/notification-list-user')
        .post(get_notification_list_by_mb_user);

    app.route('/beacon-api/kkk/notification/notification-delivery-list')
        .post(get_notification_delivery_list);

    app.route('/beacon-api/kkk/notification/request-recevied-list')
        .post(get_request_received_list);


}

// Create Notification 
function create_notification(req, res) {

    let jsonArData = req.body;
    let str_json_obj = JSON.stringify(jsonArData)

    if (!str_json_obj) {
        return res.status(400).send({ error: true, message: 'Please provide data' });
    }


    dbConn.query('CALL sp_msg_notification_insert(?)', //MySQL Store procedure execution
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



function delete_notification(req, res) {

    let jsonArData = req.body;
    let str_json_obj = JSON.stringify(jsonArData)

    if (!str_json_obj) {
        return res.status(400).send({ error: true, message: 'Please provide data' });
    }


    dbConn.query('CALL sp_msg_notification_delete(?)',
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

function get_notification_list(req, res) {

    let jsonArData = req.body;
    let str_json_obj = JSON.stringify(jsonArData)

    if (!str_json_obj) {
        return res.status(400).send({ error: true, message: 'Please provide data' });
    }

    console.log("str_json_obj", str_json_obj);

    dbConn.query('CALL sp_msg_notification_select(?)',
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


function get_notification_list_by_mb_user(req, res) {

    let jsonArData = req.body;
    let str_json_obj = JSON.stringify(jsonArData)

    if (!str_json_obj) {
        return res.status(400).send({ error: true, message: 'Please provide data' });
    }


    dbConn.query('CALL sp_msg_notification_select_by_mb_user(?)',
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

function get_notification_byid(req, res) {

    let jsonArData = req.body;
    let str_json_obj = JSON.stringify(jsonArData)

    if (!str_json_obj) {
        return res.status(400).send({ error: true, message: 'Please provide data' });
    }


    dbConn.query('CALL sp_msg_notification_select_byid(?)',
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



function udpate_notification(req, res) {

    let jsonArData = req.body;
    let str_json_obj = JSON.stringify(jsonArData)

    if (!str_json_obj) {
        return res.status(400).send({ error: true, message: 'Please provide data' });
    }
    dbConn.query('CALL sp_msg_notification_update(?)',
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



function get_notification_metadata(req, res) {

    let jsonArData = req.body;
    let str_json_obj = JSON.stringify(jsonArData)

    if (!str_json_obj) {
        return res.status(400).send({ error: true, message: 'Please provide data' });
    }
    dbConn.query('CALL sp_msg_notification_metadata(?)',
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
                    eventData: results[3],
                    mobileUserData: results[4]

                }
                );
            }
        });


}


function get_notification_delivery_list(req, res) {

    let jsonArData = req.body;
    let str_json_obj = JSON.stringify(jsonArData)

    if (!str_json_obj) {
        return res.status(400).send({ error: true, message: 'Please provide data' });
    }

    dbConn.query('CALL sp_evaluation_notification_deliver(?)',
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
                    eventstat: results[1]
                }
                );
            }
        });


}


function get_request_received_list(req, res) {

    let jsonArData = req.body;
    let str_json_obj = JSON.stringify(jsonArData)

    if (!str_json_obj) {
        return res.status(400).send({ error: true, message: 'Please provide data' });
    }

    dbConn.query('CALL sp_evaluation_request_list(?)',
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
                    eventstat: results[1]
                }
                );
            }
        });


}