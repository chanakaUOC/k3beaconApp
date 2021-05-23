var dbConn = require('../database-config/db');

module.exports = function (app) {  //receiving "app" instance
    app.route('/beacon-api/kkk/md/beacon').post(get_beacon_list);
    app.route('/beacon-api/kkk/md/beacon-byid').post(get_beacon_byid);
    app.route('/beacon-api/kkk/md/beacon-lcoation-assign').post(update_beacon_location);


}


function get_beacon_list(req, res) {
    let json_obj = req.body;
    let json_obj_string = JSON.stringify(json_obj)
    dbConn.query('CALL sp_md_beacon_list(?)',
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
function get_beacon_byid(req, res) {
    let json_obj = req.body;
    let json_obj_string = JSON.stringify(json_obj)
    dbConn.query('CALL sp_md_beacon_byid(?)',
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
                    locationData: results[1],
                    error: ''
                });
            }
        });
}

function update_beacon_location(req, res) {
    let json_obj = req.body;
    let json_obj_string = JSON.stringify(json_obj)
    
    dbConn.query('CALL sp_md_beacon_location_update(?)',
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