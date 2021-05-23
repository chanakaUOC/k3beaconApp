CREATE TABLE "beacon" (
  "beacon_id" int NOT NULL AUTO_INCREMENT,
  "beacon_name" varchar(45) DEFAULT NULL,
  "beacon_uuid" varchar(45) DEFAULT NULL,
  "tx_power" int DEFAULT NULL,
  PRIMARY KEY ("beacon_id"),
  UNIQUE KEY "beacon_name_UNIQUE" ("beacon_name")
);

CREATE TABLE "beacon_location_config" (
  "beacon_id" int NOT NULL,
  "location_id" int NOT NULL,
  PRIMARY KEY ("beacon_id","location_id")
);

CREATE TABLE "beacon_request_log" (
  "request_id" int NOT NULL AUTO_INCREMENT,
  "beacon_id" varchar(45) DEFAULT NULL,
  "beacon_address" varchar(45) DEFAULT NULL,
  "rssi" int DEFAULT NULL,
  "beacon_uuid" varchar(45) DEFAULT NULL,
  "request_user_mac_address" varchar(100) DEFAULT NULL,
  "notification_id" int DEFAULT NULL,
  "scan_result" varchar(2500) DEFAULT NULL,
  "record_date_time" datetime DEFAULT NULL,
  PRIMARY KEY ("request_id")
);

CREATE TABLE "department" (
  "department_id" int NOT NULL AUTO_INCREMENT,
  "department_name" varchar(150) DEFAULT NULL,
  PRIMARY KEY ("department_id")
);

CREATE TABLE "ma_mobile_user" (
  "user_id" int NOT NULL AUTO_INCREMENT,
  "first_name" varchar(45) DEFAULT NULL,
  "last_name" varchar(45) DEFAULT NULL,
  "login_id" varchar(45) DEFAULT NULL,
  "mac_address" varchar(45) DEFAULT NULL,
  "user_type" varchar(45) DEFAULT NULL,
  "program_id" int DEFAULT NULL,
  "department_id" varchar(45) DEFAULT NULL,
  PRIMARY KEY ("user_id")
);

CREATE TABLE "ma_mobile_user_type" (
  "user_type_id" int NOT NULL,
  "user_type" varchar(45) DEFAULT NULL,
  PRIMARY KEY ("user_type_id")
);

CREATE TABLE "md_event" (
  "event_id" int NOT NULL AUTO_INCREMENT,
  "event_name" varchar(150) NOT NULL,
  "create_by" int DEFAULT NULL,
  "create_on" datetime DEFAULT NULL,
  PRIMARY KEY ("event_id")
);

CREATE TABLE "md_location" (
  "location_id" int NOT NULL AUTO_INCREMENT,
  "location_code" varchar(45) DEFAULT NULL,
  "location_name" varchar(45) DEFAULT NULL,
  "is_active" tinyint DEFAULT '1',
  "create_by" int DEFAULT NULL,
  "create_on" datetime DEFAULT NULL,
  "update_by" int DEFAULT NULL,
  "update_on" datetime DEFAULT NULL,
  "env_factore_constant" decimal(9,6) DEFAULT '2.000000',
  PRIMARY KEY ("location_id")
);

CREATE TABLE "notification_config" (
  "notification_id" int NOT NULL AUTO_INCREMENT,
  "notification_text" varchar(115) NOT NULL,
  "location_id" int NOT NULL,
  "mobile_user_id" int DEFAULT '0',
  "create_by" int DEFAULT NULL,
  "create_on" datetime DEFAULT NULL,
  "update_by" int DEFAULT NULL,
  "update_on" datetime DEFAULT NULL,
  "program_id" int DEFAULT NULL,
  "user_type" int DEFAULT NULL,
  "department_id" int DEFAULT NULL,
  "event_id" int DEFAULT NULL,
  "distance_metrix" int DEFAULT '0',
  PRIMARY KEY ("notification_id")
);

CREATE TABLE "notification_delivered_log" (
  "delivery_id" int NOT NULL AUTO_INCREMENT,
  "notification_id" int NOT NULL,
  "mb_user_id" int DEFAULT NULL,
  "delivered_time" datetime DEFAULT NULL,
  "rssi" int DEFAULT NULL,
  "tx_power" int DEFAULT NULL,
  "beacon_id" int DEFAULT NULL,
  PRIMARY KEY ("delivery_id")
);

CREATE TABLE "program" (
  "program_id" int NOT NULL AUTO_INCREMENT,
  "program_name" varchar(100) DEFAULT NULL,
  PRIMARY KEY ("program_id")
);

CREATE TABLE "um_userroles" (
  "user_role_index" int NOT NULL AUTO_INCREMENT,
  "user_role_id" varchar(45) NOT NULL,
  "user_role_name" varchar(45) DEFAULT NULL,
  PRIMARY KEY ("user_role_index"),
  UNIQUE KEY "user_role_id_UNIQUE" ("user_role_id")
);

CREATE TABLE "um_users" (
  "user_index" int NOT NULL AUTO_INCREMENT,
  "user_id" varchar(50) NOT NULL,
  "user_pwd" varchar(100) CHARACTER SET latin1 COLLATE latin1_bin NOT NULL,
  "role_id" varchar(100) NOT NULL,
  "is_active" int DEFAULT '0',
  "user_email" varchar(45) DEFAULT NULL,
  "user_phone" varchar(45) DEFAULT NULL,
  PRIMARY KEY ("user_index"),
  UNIQUE KEY "user_id_UNIQUE" ("user_id")
);

CREATE TABLE "user_department" (
  "user_id" int NOT NULL,
  "department_id" varchar(45) DEFAULT NULL,
  PRIMARY KEY ("user_id")
);

CREATE TABLE "user_event" (
  "user_id" int NOT NULL,
  "event_id" int NOT NULL,
  PRIMARY KEY ("user_id","event_id")
);

CREATE TABLE "user_program" (
  "user_id" int NOT NULL,
  "program_id" int NOT NULL,
  PRIMARY KEY ("user_id","program_id")
);
