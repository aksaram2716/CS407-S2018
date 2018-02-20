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

 Date: 02/18/2018 14:45:37 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `USER_ACCINFOTYPE`
-- ----------------------------
DROP TABLE IF EXISTS `USER_ACCINFOTYPE`;
CREATE TABLE `USER_ACCINFOTYPE` (
  `ACCINFOTYPEID` int(11) NOT NULL AUTO_INCREMENT,
  `ACCINFOTYPE` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ACCINFOTYPEID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `USER_ACCINFOTYPE`
-- ----------------------------
BEGIN;
INSERT INTO `USER_ACCINFOTYPE` VALUES ('1', 'User'), ('2', 'Admin');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
