var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors') // Enable cross domain compatibility
var app = express();
app.use(cors())




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));





require("./user-management/k3-user")(app);
require("./user-management/mobile-user")(app);
require("./master-data/location")(app);
require("./master-data/Event")(app);
require("./master-data/program")(app);
require("./master-data/Department")(app);
require("./notification/notification")(app);
require("./notification/mobile-user")(app);
require("./master-data/Beacon")(app);
require("./poc/BeaconPOC")(app);
require("./dash-board/dashboard")(app);


module.exports = app;


//set port
app.listen(3008, function () {
    console.log('Node app is running on port 3008');
});
