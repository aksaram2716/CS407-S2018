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

 Date: 02/18/2018 14:45:25 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `USER_ACCINFO`
-- ----------------------------
DROP TABLE IF EXISTS `USER_ACCINFO`;
CREATE TABLE `USER_ACCINFO` (
  `ACCINFOID` int(11) NOT NULL AUTO_INCREMENT,
  `ACCINFOTYPEID` int(11) NOT NULL,
  `USER_ID` int(11) unsigned NOT NULL,
  `AUTHORITY` varchar(255) NOT NULL DEFAULT 'ROLE_USER',
  PRIMARY KEY (`ACCINFOID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `USER_ACCINFO`
-- ----------------------------
BEGIN;
INSERT INTO `USER_ACCINFO` VALUES ('1', '1', '1', 'ROLE_USER');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
