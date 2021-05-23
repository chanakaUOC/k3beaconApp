
const dbConn = require("../database-config/db")
//routes
module.exports = function (app) {  //receiving "app" instance
    app.route('/beacon-api/kkk/db/db-total-notification')
        .post(get_total_notifications);


}

/// Get  notification details
function get_total_notifications(req, res) {

    let jsonArData = req.body;
    let str_json_obj = JSON.stringify(jsonArData)

    if (!str_json_obj) {
        return res.status(400).send({ error: true, message: 'Please provide data' });
    }

    console.log("create_mdusernotification", str_json_obj);

    dbConn.query('CALL sp_db_total_mdusernotification(?)',
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