/*
 Navicat Premium Data Transfer

 Source Server         : localdb
 Source Server Type    : MySQL
 Source Server Version : 50718
 Source Host           : localhost
 Source Database       : JustRecipes

 Target Server Type    : MySQL
 Target Server Version : 50718
 File Encoding         : utf-8

 Date: 02/18/2018 11:26:35 AM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `USER_INFO`
-- ----------------------------
DROP TABLE IF EXISTS `USER_INFO`;
CREATE TABLE `USER_INFO` (
  `USER_ID` int(11) NOT NULL AUTO_INCREMENT,
  `FNAME` varchar(45) NOT NULL,
  `LNAME` varchar(45) NOT NULL,
  `PASSWORD` varchar(45) NOT NULL,
  `USERCODE` varchar(45) NOT NULL,
  `CANLOGIN` smallint(1) NOT NULL DEFAULT '1',
  `APITOKEN` varchar(80) NOT NULL DEFAULT 'test',
  `PROFILE_IMAGE` text,
  `JOINED` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `LAST_MODIFIED` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`USER_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `USER_INFO`
-- ----------------------------
BEGIN;
INSERT INTO `USER_INFO` VALUES ('1', 'Prithvi', 'Dhelia', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'test', '1', 'test', 'fuckthis', '2018-02-17 23:51:59', '2018-02-18 01:09:16'), ('2', 'John', 'Doe', 'password', 'jdoe@gmail.com', '1', 'thest', 'abcdefgg', '2018-02-18 00:20:15', '2018-02-18 00:20:15');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
