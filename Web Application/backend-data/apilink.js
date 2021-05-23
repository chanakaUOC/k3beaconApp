
//All API paths are defined here

const SERVER_IP = "http://localhost:3008";//API ip address or server name should set according the development environment



const ApiList =
{

        dash_board_total_notification:`${SERVER_IP}/beacon-api/kkk/db/db-total-notification`,
        eval_rep_delivered:`${SERVER_IP}/beacon-api/kkk/notification/notification-delivery-list`,
        eval_rep_request:`${SERVER_IP}/beacon-api/kkk/notification/request-recevied-list`,
        event_user_list:`${SERVER_IP}/beacon-api/kkk/md/event-user-list`,
        location_data_cmb:`${SERVER_IP}/beacon-api/kkk/md/location-cmb`,
        notification_add:`${SERVER_IP}/beacon-api/kkk/notification/create-notification`,
        notification_data_by_id:`${SERVER_IP}/beacon-api/kkk/notification/notification-byid`,
        notification_delete:`${SERVER_IP}/beacon-api/kkk/notification/delete-notification`,
        notification_list:`${SERVER_IP}/beacon-api/kkk/notification/notification-list`,
        notification_mb_user_list:`${SERVER_IP}/beacon-api/kkk/mdusernotification/mdusernotification-list`,
        notification_mb_user_notification_list:`${SERVER_IP}/beacon-api/kkk/notification/notification-list-user`,
        notification_meta_data:`${SERVER_IP}/beacon-api/kkk/notification/notification-metadata`,
        notification_update:`${SERVER_IP}/beacon-api/kkk/notification/update-notification`,
        pd_beacon_data:`${SERVER_IP}/beacon-api/kkk/md/beacon`,
        pd_beacon_data_byid:`${SERVER_IP}/beacon-api/kkk/md/beacon-byid`,
        pd_beacon_location_update:`${SERVER_IP}/beacon-api/kkk/md/beacon-lcoation-assign`,
        pd_event_create:`${SERVER_IP}/beacon-api/kkk/md/event-create`,
        pd_event_data:`${SERVER_IP}/beacon-api/kkk/md/event-list`,
        pd_event_data_by_id:`${SERVER_IP}/beacon-api/kkk/md/event`,
        pd_event_delete:`${SERVER_IP}/beacon-api/kkk/md/event-inactive`,
        pd_event_update:`${SERVER_IP}/beacon-api/kkk/md/event-update`,
        pd_location_create:`${SERVER_IP}/beacon-api/kkk/md/location-create`,
        pd_Location_data:`${SERVER_IP}/beacon-api/kkk/md/location-list`,
        pd_location_data_by_id:`${SERVER_IP}/beacon-api/kkk/md/location`,
        pd_location_delete:`${SERVER_IP}/beacon-api/kkk/md/location-inactive`,
        pd_location_update:`${SERVER_IP}/beacon-api/kkk/md/location-update`,
        user_validate:`${SERVER_IP}/beacon-api/user-management/validate-user-credentials`,
    
}


module.exports.ApiList = ApiList;


