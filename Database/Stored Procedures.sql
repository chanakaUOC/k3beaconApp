DELIMITER $$
CREATE   PROCEDURE "sp_admin_data_clean_data"()
BEGIN

SET SQL_SAFE_UPDATES = 0;

delete from notification_delivered_log where delivery_id>0;
ALTER TABLE notification_delivered_log AUTO_INCREMENT = 1;

delete from beacon_request_log where request_id>0;
ALTER TABLE beacon_request_log AUTO_INCREMENT = 1;

delete from notification_config where notification_id>0;
ALTER TABLE notification_config AUTO_INCREMENT = 1;


delete from notification_delivered_log where notification_id>0;
ALTER TABLE notification_delivered_log AUTO_INCREMENT = 1;

delete from notification_delivered_log where delivery_id>0;
ALTER TABLE notification_delivered_log AUTO_INCREMENT = 1;

delete  from  beacon_request_log where request_id>0;
ALTER    TABLE beacon_request_log AUTO_INCREMENT = 1;

SET SQL_SAFE_UPDATES = 1;



END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_beacon_request_log_insert"(
IN data1 JSON
)
BEGIN

DECLARe p_createed_id INT;
DECLARE p_beacon_id VARCHAR(45);
DECLARE p_beacon_index INT;
DECLARE p_user_mac_address VARCHAR(100);
DECLARE p_mb_user_id INT;
DECLARE p_mb_department INT;
DECLARE p_mb_program INT;
DECLARE p_rssi_reading INT;
DECLARE p_notification_id INT;
DECLARE p_tx_power INT;
DECLARE p_mobile_user_type INT;
-- user_mac_address
SET p_beacon_id=json_unquote(json_extract(data1,'$.beacon_id'));
SET p_user_mac_address=json_unquote(json_extract(data1,'$.user_mac_address'));
SET p_rssi_reading=json_unquote(json_extract(data1,'$.rssi'));



SELECT  beacon_id,tx_power from beacon where beacon_name=p_beacon_id limit 1 into p_beacon_index,p_tx_power;
SELECT user_id,department_id,program_id,user_type  from ma_mobile_user where mac_address=p_user_mac_address limit 1 into p_mb_user_id,p_mb_department,p_mb_program,p_mobile_user_type;






SET p_createed_id=last_insert_id();

DROP TEMPORARY TABLE IF EXISTS delivery_notification;
CREATE temporary table delivery_notification (  `notification_id` INTEGER  ,  `notification_text` varchar(250),`mb_user_id` INT ,PRIMARY KEY (`notification_id`,`mb_user_id`));


insert into delivery_notification(notification_id,notification_text,mb_user_id)
select nc.notification_id,nc.notification_text ,p_mb_user_id
--  as `beacon_message` 
-- , loc.location_name   as   `description` 
from notification_config nc
inner join md_location loc on nc.location_id=loc.location_id
inner join beacon_location_config blc on nc.location_id=blc.location_id and  blc.beacon_id=p_beacon_index
inner join beacon b on blc.beacon_id=b.beacon_id and b.beacon_id =p_beacon_index
left join notification_delivered_log ndl ON nc.notification_id=ndl.notification_id AND ndl.mb_user_id=p_mb_user_id
where 
(nc.mobile_user_id=p_mb_user_id
OR (nc.user_type=0 and nc.program_id is null  and  nc.department_id is null and nc.mobile_user_id is null)
  OR  nc.program_id=p_mb_program 
  OR nc.department_id=p_mb_department 
   OR (nc.event_id =0 and p_mobile_user_type=3 and nc.user_type=p_mobile_user_type)
  OR nc.event_id in (select ue.event_id from user_event ue where  ue.user_id=p_mb_user_id)) 
  
  and ndl.notification_id is null
  and (nc.distance_metrix=0 or (nc.distance_metrix> fn_calculate_distance_by_rssi_environmental_factore(b.tx_power,p_rssi_reading,loc.env_factore_constant) ))
  limit 1
;

  insert into notification_delivered_log(notification_id,mb_user_id,delivered_time,rssi,tx_power,beacon_id)
 select   notification_id,mb_user_id ,now() ,p_rssi_reading,p_tx_power, p_beacon_index from delivery_notification;

 select   notification_id   from delivery_notification limit 1 INTO p_notification_id;

INSERT INTO  beacon_request_log(
beacon_id,
beacon_address,
rssi,
beacon_uuid,
request_user_mac_address,
notification_id,
scan_result,
record_date_time)
values (
p_beacon_id,
json_unquote(json_extract(data1,'$.device_address')),
p_rssi_reading,
json_unquote(json_extract(data1,'$.beacon_id')),
p_user_mac_address,
p_notification_id,
json_unquote(json_extract(data1,'$.scan_result')),
now()
);

SELECT 
notification_text  as `beacon_message` ,
''   as   `description`,mb_user_id FROM delivery_notification;

END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_db_total_mdusernotification"(in jsondata json)
BEGIN

declare p_total_no_of_notifications int;
declare p_total_no_of_notifications_delivered int;
declare p_total_number_of_users INT;
declare p_number_of_locations INT;
declare p_number_of_beacons INT;
declare p_number_of_events INT;
declare p_number_of_request INT;
select count(notification_id) from notification_config into p_total_no_of_notifications;

SELECT count(delivery_id) FROM notification_delivered_log into p_total_no_of_notifications_delivered;

SELECT count(user_id) FROM ma_mobile_user into p_total_number_of_users;

SELECT count(location_id) FROM md_location into p_number_of_locations;

SELECT count(beacon_id) FROM beacon into p_number_of_beacons;

select count(event_id) from md_event into p_number_of_events;

select count(request_id) from beacon_request_log into p_number_of_request;



select 'Beacons' as `Description`,p_number_of_beacons as `Count` union
select 'Locations' as `Description`,p_number_of_locations as `Count` union
select 'Total Notifications' as `Description`,p_total_no_of_notifications as `Count` union
select 'Users' as `Description`,p_total_number_of_users as `Count` union
select 'Delivered' as `Description`,p_total_no_of_notifications_delivered as `Count` union
select 'Events'  as `Description`,p_number_of_events as `Count` union
select 'Requests'  as `Description`,p_number_of_request as `Count`

;

END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_evaluation_notification_deliver"(in jsondata json)
BEGIN
SELECT mbu.first_name,nc.notification_text,ndl.delivered_time
,fn_calculate_distance_by_rssi_environmental_factore(b.tx_power,ndl.rssi,mdl.env_factore_constant) as `Distance`
 FROM notification_delivered_log ndl
 inner join ma_mobile_user mbu on ndl.mb_user_id=mbu.user_id
 inner join notification_config nc on ndl.notification_id=nc.notification_id
  inner join beacon b on ndl.beacon_id= b.beacon_id
  inner join md_location mdl on nc.location_id=mdl.location_id
 
 ;
 select 'successs' as `message`;
END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_evaluation_request_list"(in jsondata json)
BEGIN

SELECT mbu.first_name,ndl.beacon_id ,loc.location_name,ifnull( nc.notification_text,'-- No notification found--') as notification_text,ndl.record_date_time,
fn_calculate_distance_by_rssi_environmental_factore(b.tx_power,ndl.rssi,env_factore_constant) as `Distance`
 FROM beacon_request_log ndl
 inner join ma_mobile_user mbu on ndl.request_user_mac_address=mbu.mac_address
 inner join beacon b on ndl.beacon_id= b.beacon_name
 inner join beacon_location_config bl ON b.beacon_id=bl.beacon_id
 inner join md_location loc ON bl.location_id = loc.location_id
 left  join notification_config nc on ndl.notification_id=nc.notification_id;

select 'successs' as `message`;
END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_event_user_list"(
 IN JSONDATA JSON
-- p_event_id INT
)
BEGIN

 declare p_event_id INT;
 declare p_number_of_users INT;
 declare p_number_of_notification INT;
 SET p_event_id=json_unquote(json_extract(JSONDATA,'$.event_id'));

-- - Get the number of notification list
DROP TEMPORARY TABLE IF EXISTS user_notification;
CREATE temporary table user_notification (  `user_id` INTEGER  , `number_of_notifications` INT ,PRIMARY KEY (`user_id`));

insert into user_notification(user_id,number_of_notifications)
SELECT UE.user_id,COUNT(nc.notification_id) as`NotificationCount`
FROM user_event UE
INNER JOIN ma_mobile_user MU ON UE.user_id=MU.user_id
INNER JOIN md_event E ON UE.event_id=E.event_id
INNER JOIN notification_config nc ON 
((E.event_id=nc.event_id and (nc.mobile_user_id=0 or nc.mobile_user_id is null ))
OR (E.event_id=nc.event_id and nc.mobile_user_id=UE.user_id))
where UE.event_id=p_event_id
group by UE.user_id;

--  Get delivery count
DROP TEMPORARY TABLE IF EXISTS user_notification_delivered;
CREATE temporary table user_notification_delivered (  `user_id` INTEGER  , `number_of_notifications` INT ,PRIMARY KEY (`user_id`));

insert into user_notification_delivered(user_id,number_of_notifications)
SELECT UE.user_id,COUNT(nc.notification_id) as`NotificationCount`
FROM user_event UE
INNER JOIN ma_mobile_user MU ON UE.user_id=MU.user_id
INNER JOIN md_event E ON UE.event_id=E.event_id
INNER JOIN notification_config nc ON 
((E.event_id=nc.event_id and (nc.mobile_user_id=0 or nc.mobile_user_id is null ))
OR (E.event_id=nc.event_id and nc.mobile_user_id=UE.user_id))
INNER JOIN notification_delivered_log ndl ON UE.user_id=ndl.mb_user_id and nc.notification_id=ndl.notification_id
where UE.event_id=p_event_id
group by UE.user_id;




SELECT MU.first_name, MU.last_name,E.event_name,un.number_of_notifications,
und.number_of_notifications as `number_of_notifications_delivered`,ut.user_type
FROM 
user_event UE
INNER JOIN ma_mobile_user MU ON UE.user_id=MU.user_id
INNER JOIN md_event E ON UE.event_id=E.event_id
INNER JOIN  ma_mobile_user_type       ut  ON    MU.user_type=ut.user_type_id
LEFT JOIN user_notification un ON   UE.user_id=un.user_id
LEFT JOIN user_notification_delivered und ON   UE.user_id=und.user_id
where UE.event_id=p_event_id;

select count(user_id) from user_event where       event_id= p_event_id        INTO p_number_of_users;
select count (notification_id) from notification_config  where event_id=p_event_id INTO p_number_of_notification;
select p_number_of_users as 'user_count',p_number_of_notification as 'number_of_notification' ;

END$$
DELIMITER ;



DELIMITER $$
CREATE   PROCEDURE "sp_mb_user_registration"(
IN data1 JSON
)
BEGIN

DECLARe p_user_id INT;
DECLARE p_user_type INT;
DECLARE p_event_id INT;
DECLARE p_user_mac_address VARCHAR(100);
DECLARE p_is_new_user bool;
DECLARE p_update_exis_Data int;

SET p_user_type=json_unquote(json_extract(data1,'$.user_type'));
SET p_user_mac_address=json_unquote(json_extract(data1,'$.mac_address'));
SET p_event_id=json_unquote(json_extract(data1,'$.event_id'));
SET p_update_exis_Data=json_unquote(json_extract(data1,'$.update_data'));


SELECT user_id FROM ma_mobile_user  WHERE mac_address=p_user_mac_address INTO p_user_id;


IF (p_user_id=0 or p_user_id is null) THEN

SET p_is_new_user=1;
INSERT INTO ma_mobile_user(
first_name,
last_name,
login_id,
mac_address,
user_type)
VALUES(
json_unquote(json_extract(data1,'$.first_name')),
json_unquote(json_extract(data1,'$.last_name')),
json_unquote(json_extract(data1,'$.login_id')),
json_unquote(json_extract(data1,'$.mac_address')),
p_user_type
);

SET p_user_id=last_insert_id();

ELSE
if (p_update_exis_Data=1) then
update ma_mobile_user
set 
first_name=json_unquote(json_extract(data1,'$.first_name')),
last_name=json_unquote(json_extract(data1,'$.last_name')),
login_id=json_unquote(json_extract(data1,'$.login_id')),
mac_address=json_unquote(json_extract(data1,'$.mac_address')),
program_id=json_unquote(json_extract(data1,'$.program_id')),
department_id=json_unquote(json_extract(data1,'$.department_id')),
user_type=p_user_type

where 

user_id=p_user_id;
end if;
END IF;

delete  from user_program where user_id=p_user_id;
delete  from user_department where user_id=p_user_id;


IF (p_user_type=1 and p_is_new_user=1)THEN
	INSERT INTO  user_program(user_id,program_id)
	VALUES (p_user_id,json_unquote(json_extract(data1,'$.program_id')));
ELSEIF ( p_user_type=2 and p_is_new_user=1) THEN
	INSERT INTO  user_department(user_id,department_id)
	VALUES (p_user_id,json_unquote(json_extract(data1,'$.department_id')));
ELSEIF ( p_user_type=3 or (p_event_id>0)) THEN
	INSERT INTO user_event (user_id,event_id)
	VALUES (p_user_id,p_event_id);
END IF;



select 'User Registration Successfully Completed'  as `beacon_message` , 'Welcome to K3'   as   `description` ;





END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_mb_user_registration_event"(IN data1 JSON
)
BEGIN

DECLARe p_user_id INT;
DECLARE p_user_type INT;
DECLARE p_event_id INT;
DECLARE p_user_mac_address VARCHAR(100);
DECLARE p_is_new_user bool;
DECLARE p_update_exis_Data int;


SET p_user_mac_address=json_unquote(json_extract(data1,'$.mac_address'));
SET p_event_id=json_unquote(json_extract(data1,'$.event_id'));
SET p_update_exis_Data=json_unquote(json_extract(data1,'$.update_data'));


SELECT user_id FROM ma_mobile_user  WHERE mac_address=p_user_mac_address INTO p_user_id;


IF NOT(p_user_id=0 or p_user_id is null) THEN
INSERT INTO user_event (user_id,event_id)
	VALUES (p_user_id,p_event_id);

END if;


select 'Event Registration Successfully Completed!'  as `beacon_message` , 'Welcome to K3'   as   `description` ;





END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_mb_user_select_by_device_id"(in jsondata json)
BEGIN

declare p_device_id varchar(200);

set p_device_id=json_unquote(json_extract(jsondata,'$.device_id'));

select user_id,first_name , last_name,login_id , mut.user_type as user_type ,mb.user_type as user_type_id

,IFNULL(IFNULL( d.department_name,p.program_name),'' )as registration_type

   from  ma_mobile_user  mb
   left join ma_mobile_user_type mut on mb.user_type=mut.user_type_id
   left join department d on mb.department_id=d.department_id
   left join program p on mb.program_id=p.program_id
   where mb.mac_address=  p_device_id ;


END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_md_beacon_byid"(IN data1 JSON)
BEGIN

declare p_becon_id INT;

SET p_becon_id=json_unquote(json_extract(data1,'$.pr_key'));

select b.beacon_id,b.beacon_name,b.beacon_uuid,b.tx_power,l.location_id,l.location_name from beacon b
left join  beacon_location_config bl  on b.beacon_id=bl.beacon_id
left join md_location l on bl.location_id=l.location_id
where b.beacon_id=p_becon_id;


select location_id as `value`,location_name  as 'label' from md_location where is_active=1;
END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_md_beacon_list"(in jsondata json)
BEGIN


select b.beacon_id,b.beacon_name,b.beacon_uuid,b.tx_power,l.location_id,l.location_name from beacon b
left join  beacon_location_config bl  on b.beacon_id=bl.beacon_id
left join md_location l on bl.location_id=l.location_id;



END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_md_beacon_location_update"(IN data1 JSON)
BEGIN

declare p_becon_id INT;
declare p_location_id INT;

SET p_becon_id=json_unquote(json_extract(data1,'$.beacon_id'));
SET p_location_id=json_unquote(json_extract(data1,'$.location_id'));

delete  from beacon_location_config where beacon_id=p_becon_id;

insert into   beacon_location_config (beacon_id,location_id)
values(p_becon_id,p_location_id);


select  beacon_id from beacon_location_config where beacon_id=p_becon_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_md_department_select"(in jsondata json)
BEGIN

select department_id ,department_name from department;
END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_md_event_inactive"(IN data1 JSON
)
BEGIN
DECLARe p_event_id INT;
SET p_event_id=json_unquote(json_extract(data1,'$.pr_key'));

delete from md_event where event_id=p_event_id;


select p_event_id;

END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_md_event_insert"(
IN data1 JSON
)
BEGIN
DECLARe p_event_id INT;
INSERT INTO md_event (event_name,create_by,create_on)
values (
json_unquote(json_extract(data1,'$.event_name')),
json_unquote(json_extract(data1,'$.user_id')),
NOW()
);

SET p_event_id=last_insert_id();
select p_event_id;


END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_md_event_select"(user_id int)
BEGIN

select event_id,event_name from md_event;


END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_md_event_select_mb"(IN data1 JSON)
BEGIN

select event_id,event_name from md_event;

END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_md_location_inactive"(
IN data1 JSON
)
BEGIN
DECLARe p_location_id INT;
SET p_location_id=json_unquote(json_extract(data1,'$.pr_key'));

update md_location
set 
is_active=0,
update_by=json_unquote(json_extract(data1,'$.user_id')),
update_on =now()
where location_id=p_location_id;


select p_location_id;


END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_md_location_insert"(
IN data1 JSON
)
BEGIN
DECLARe p_location_id INT;
INSERT INTO md_location (location_name,create_by,create_on)
values (
json_unquote(json_extract(data1,'$.location_name')),
json_unquote(json_extract(data1,'$.user_id')),
NOW()
);

SET p_location_id=last_insert_id();
select p_location_id;


END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_md_location_select"(
user_id INT
)
BEGIN

select location_id,location_name from md_location where is_active=1;


END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_md_location_select_by_id"(p_user_id INT,p_location_id INT)
BEGIN
SELECT location_id,location_name FROM md_location where location_id=p_location_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_md_location_select_cmb"(
user_id INT
)
BEGIN

select location_id as `value`,location_name  as 'label' from md_location where is_active=1;


END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_md_location_update"(
IN data1 JSON
)
BEGIN
DECLARe p_location_id INT;
SET p_location_id=json_unquote(json_extract(data1,'$.location_id'));

update md_location
set 
location_name=json_unquote(json_extract(data1,'$.location')),
update_by=json_unquote(json_extract(data1,'$.user_id')),
update_on =now()
where location_id=p_location_id;


select p_location_id;


END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_md_program_select"(userid int)
BEGIN
Select program_id,program_name   from program;
END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_msg_mdusernotification_select"(IN jsonData JSON)
BEGIN

SELECT mu.user_id as `mb_user_id`,mu.first_name,mu.last_name,mu.login_id,mu.mac_address ,
-- user_type 
ifnull( mut.user_type,'')as `user_type`,
ifnull(d.department_name,p.program_name) as department_name
FROM ma_mobile_user mu
left join ma_mobile_user_type mut ON  mu.user_type=mut.user_type_id
left join program p ON mu.program_id=p.program_id
left join department d ON  mu.department_id =d.department_id
;


END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_msg_notification_delete"(
IN data1 JSON
)
BEGIN

DECLARe p_notification_id INT;
set p_notification_id=json_unquote(json_extract(data1,'$.pr_key'));
DELETE FROM notification_config 
WHERE
    notification_id = p_notification_id;


SELECT p_notification_id;




END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_msg_notification_destance"()
BEGIN
SELECT   power(10 ,(((-71)-(rssi))/(10*2))) FROM kkk_beacon_app.beacon_request_log where rssi<0;
END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_msg_notification_distance"()
BEGIN
SELECT   power(10 ,(((-71)-(rssi))/(10*2))) FROM kkk_beacon_app.beacon_request_log where rssi<0;
END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_msg_notification_insert"(
IN data1 JSON
)
BEGIN

DECLARe p_createed_id INT;

declare p_user_type INT;

SET p_user_type=json_unquote(json_extract(data1,'$.user_type'));


INSERT INTO  notification_config(
location_id,
notification_text,
mobile_user_id,
program_id,
user_type,
department_id,
event_id,
distance_metrix,
create_by,
create_on)
values (
json_unquote(json_extract(data1,'$.location_id')),
json_unquote(json_extract(data1,'$.notification_text')),
json_unquote(json_extract(data1,'$.mobile_user_id')),
if(p_user_type=1,json_unquote(json_extract(data1,'$.program_id')),null),
p_user_type,
if(p_user_type=2,json_unquote(json_extract(data1,'$.department_id')),null),
json_unquote(json_extract(data1,'$.event_id')),
json_unquote(json_extract(data1,'$.distance_metrix')),
json_unquote(json_extract(data1,'$.user_id')),
NOW()
);

SET p_createed_id=last_insert_id();
select p_createed_id;




END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_msg_notification_metadata"(IN jsonData JSON)
BEGIN

declare mobile_user_id int;

set mobile_user_id=json_unquote(json_extract(jsonData,'$.mobile_user_id'));


select location_id as `value`,location_name  as 'label' from md_location where is_active=1;

select program_id as `value`,program_name  as 'label' from program ;

select department_id as `value`,department_name  as 'label' from department ;

select event_id as `value`, event_name as 'label' from md_event ;

select first_name,last_name,user_type,'user_description' as user_description from ma_mobile_user  where user_id=mobile_user_id;


END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_msg_notification_select"(IN jsonData JSON)
BEGIN

select  nc.notification_id ,nc.notification_text,nc.location_id ,location_name,
 prg.program_name,
  dep.department_name,
  eve.event_name,
ut.user_type as `user_type`
 
from notification_config  nc 
inner join md_location loc on nc.location_id=loc.location_id
inner join ma_mobile_user_type ut on nc.user_type=ut.user_type_id
left join program prg  on nc.program_id  = prg.program_id
left join department dep  on nc.department_id  = dep.department_id
left join md_event eve  on nc.event_id  = eve.event_id
where (nc.mobile_user_id is null or  nc.mobile_user_id =0)
order by nc.create_on desc
;

END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_msg_notification_select_by_mb_user"(IN jsonData JSON)
BEGIN

declare mobile_user_id int;
set mobile_user_id=json_unquote(json_extract(jsonData,'$.mobile_user_id'));


select  nc.notification_id ,nc.notification_text,nc.location_id ,location_name,
 prg.program_name,
  dep.department_name,
  eve.event_name,
ut.user_type as `user_type`
 
from notification_config  nc 
inner join md_location loc on nc.location_id=loc.location_id
inner join ma_mobile_user_type ut on nc.user_type=ut.user_type_id
left join program prg  on nc.program_id  = prg.program_id
left join department dep  on nc.department_id  = dep.department_id
left join md_event eve  on nc.event_id  = eve.event_id
where (nc.mobile_user_id =mobile_user_id)
;

END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_msg_notification_select_byid"(IN jsonData JSON)
BEGIN
declare p_notification_id INT;
SET p_notification_id=json_unquote(json_extract(jsonData,'$.pr_key'));


select  nc.notification_id ,nc.notification_text,nc.location_id ,location_name
from notification_config  nc 
inner join md_location loc on nc.location_id=loc.location_id
where nc.notification_id=p_notification_id
;

select location_id as `value`,location_name  as 'label' from md_location where is_active=1;



END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_msg_notification_update"(
IN data1 JSON
)
BEGIN

DECLARe p_notification_id INT;
set p_notification_id=json_unquote(json_extract(data1,'$.notification_id'));
update  notification_config
set 
notification_text=json_unquote(json_extract(data1,'$.notification_text')),
update_by=json_unquote(json_extract(data1,'$.user_id')),
location_id=json_unquote(json_extract(data1,'$.location_id')),update_on=NOW()

WHERE 
notification_id=p_notification_id;


select p_notification_id;




END$$
DELIMITER ;

DELIMITER $$
CREATE   PROCEDURE "sp_um_validate_user"(

IN data1 JSON
)
BEGIN

DECLARE Token_Id varchar(200);
DECLARE p_user_index INT;
DECLARE p_user_login_id VARCHAR(100);
DECLARE p_user_password VARCHAR(100);

SET p_user_login_id=json_unquote(json_extract(data1,'$.user_id'));
SET p_user_password=json_unquote(json_extract(data1,'$.user_password'));


  SET p_user_index= (SELECT user_index FROM  um_users
  where   user_pwd=p_user_password AND user_id=p_user_login_id);
  
--   insert into test_log (val1,val2) values(user_email,user_passward);
  
   SET  Token_Id=if(p_user_index>0, MD5(NOW()),'');
 /*
 IF length(Token_Id)>0 THEN
 INSERT into userlogindetails(UserId,LogInTime,SecurityToken)
 values (user_id,now(),Token_Id);
 end if;
 */
 
 SELECT Token_Id as Token_Id,p_user_index as user_id;

END$$
DELIMITER ;
