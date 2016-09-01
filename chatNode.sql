CREATE DATABASE chatnode;

USE chatnode;

CREATE TABLE admins
  (
     idamins      INT(11) NOT NULL auto_increment,
     nombre       VARCHAR(45) DEFAULT NULL,
     nick         VARCHAR(45) DEFAULT NULL,
     contrasena   VARCHAR(45) DEFAULT NULL,
     departamento VARCHAR(45) DEFAULT NULL,
     tipo         VARCHAR(45) DEFAULT NULL,
     PRIMARY KEY (idamins)
  );

SELECT *
FROM   admins;

INSERT INTO chatnode.admins
            (idamins,
             nombre,
             nick,
             contrasena,
             departamento,
             tipo)
VALUES      (0,
             'Alberto de Jesús Aguilar López',
             'Jeshua',
             'Aguilar90',
             'Sistemas',
             'Administrador');

CREATE TABLE informacion
  (
     idinformacion INT(11) NOT NULL auto_increment,
     nombre        VARCHAR(45) DEFAULT NULL,
     mail          VARCHAR(45) DEFAULT NULL,
     telefono      FLOAT DEFAULT NULL,
     empresa       VARCHAR(45) DEFAULT NULL,
     informacion   VARCHAR(300) DEFAULT NULL,
     ano           INT(4) DEFAULT NULL,
     mes           INT(2) DEFAULT NULL,
     dia           INT(2) DEFAULT NULL,
     hora          INT(2) DEFAULT NULL,
     minuto        INT(2) DEFAULT NULL,
     PRIMARY KEY (idinformacion)
  );

SELECT *
FROM   informacion; 