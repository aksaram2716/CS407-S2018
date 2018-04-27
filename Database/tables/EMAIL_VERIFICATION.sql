/*
 Navicat Premium Data Transfer

 Source Server         : localdb
 Source Server Type    : MySQL
 Source Server Version : 50718
 Source Host           : localhost
 Source Database       : SpiceVeg

 Target Server Type    : MySQL
 Target Server Version : 50718
 File Encoding         : utf-8

 Date: 03/10/2018 13:07:29 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `EMAIL_VERIFICATION`
-- ----------------------------
DROP TABLE IF EXISTS `EMAIL_VERIFICATION`;
CREATE TABLE `EMAIL_VERIFICATION` (
  `EMAIL_VERIFICATION_ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `USER_ID` int(11) NOT NULL,
  `CREATED_TIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `USER_IDENTIFIER` varchar(255) NOT NULL,
  `IS_VERIFIED` bit(1) NOT NULL,
  `VERIFICATION_TOKEN` varchar(255) NOT NULL,
  `VERIFICATION_TIME` timestamp NULL DEFAULT NULL,
  `LAST_MODIFIED` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`EMAIL_VERIFICATION_ID`),
  UNIQUE KEY `UNIQUE_EMAIL_VERIFICATION_USERID` (`USER_ID`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `EMAIL_VERIFICATION`
-- ----------------------------
BEGIN;
INSERT INTO `EMAIL_VERIFICATION` VALUES ('5', '26', '2017-12-28 01:33:40', 'f6bab16055db454e98d4d114eb8e65d5', b'0', '', null, '2018-03-03 00:34:11'), ('6', '27', '2017-12-28 20:58:09', '3168231f2a164d3ba95f25d983e4b0fd', b'0', '', null, '2018-03-03 00:34:11'), ('9', '34', '2017-12-29 23:06:18', '808589b318bb4c2387fc8552d3f28eff', b'0', '35c331cbe3bb4317997b785d369af1e3', null, '2018-03-03 00:34:11'), ('10', '35', '2017-12-30 18:36:11', 'aa0b40e8bb3043ce9254a7e0259004df', b'1', '2017-12-30 22:01:29', null, '2018-03-03 00:34:11'), ('11', '36', '2017-12-30 22:11:48', 'b54297a3a54948c6ae505c755526620c', b'1', 'ffa5658e43714daaa2e6b5dd7233cb1a', '2017-12-30 22:35:56', '2018-03-03 00:34:11'), ('12', '37', '2018-02-17 00:08:29', '83d6801148d44d14bd9fe54f33d39744', b'0', '1e8b4e270a4b4c3a924d1e98ea6f5fa9', null, '2018-03-03 00:34:11'), ('13', '38', '2018-03-03 02:02:18', '2dcdeca7889f4cbf9b330ad078538599', b'1', 'de629b54157c4eed871ca8709996e697', '2018-03-03 02:02:55', '2018-03-03 02:02:18'), ('14', '39', '2018-03-03 02:08:13', '04aa83b86e72467abf758d3f86f602e1', b'0', 'c34c0996966f40208d64c5b7d807363f', null, '2018-03-03 02:08:13'), ('15', '40', '2018-03-03 09:27:59', 'cd831b27ecc24e54b3183de87c400165', b'0', '6775d4bc6a0b465cb9ec847927e3f165', null, '2018-03-03 09:27:59'), ('16', '41', '2018-03-03 09:49:01', 'c2554a223b654d828d758f910e6cb404', b'0', 'c139e986c3b0443aa9e1ae5a9f3dfd71', null, '2018-03-03 09:49:01');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
