BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "module" (
	"id_module"	INTEGER,
	"nom"	VARCHAR(60),
	"id_prof"	INTEGER,
	"id_semestre"	INTEGER,
	"id_filiere"	INTEGER,
	FOREIGN KEY("id_prof") REFERENCES "professeur"("id_prof"),
	FOREIGN KEY("id_semestre") REFERENCES "semestre"("id_semestre"),
	FOREIGN KEY("id_filiere") REFERENCES "filiere"("id_filiere"),
	PRIMARY KEY("id_module"),
	CONSTRAINT "pk_module" UNIQUE("id_module")
);
CREATE TABLE IF NOT EXISTS "semestre" (
	"id_semestre"	INTEGER UNIQUE,
	"nom"	VARCHAR(10),
	"date_debut"	DATE,
	"date_fin"	DATE,
	PRIMARY KEY("id_semestre")
);
CREATE TABLE IF NOT EXISTS "seance" (
	"id_seance"	INTEGER UNIQUE,
	"type"	VARCHAR(10),
	"date_seance"	DATE,
	"heure_debut"	TIME,
	"heure_fin"	TIME,
	"id_module"	INTEGER,
	"id_code"	INTEGER,
	"numero_semaine"	INTEGER,
	"salle"	VARCHAR(100),
	FOREIGN KEY("id_code") REFERENCES "qrcodes"("id_code"),
	FOREIGN KEY("id_module") REFERENCES "module"("id_module"),
	PRIMARY KEY("id_seance")
);
CREATE TABLE IF NOT EXISTS "professeur" (
	"id_prof"	INTEGER UNIQUE,
	"username"	VARCHAR(30) UNIQUE,
	"password"	VARCHAR(30) UNIQUE,
	"id_filiere"	INTEGER,
	"nom"	VARCHAR(30),
	FOREIGN KEY("id_filiere") REFERENCES "filiere"("id_filiere"),
	PRIMARY KEY("id_prof")
);
CREATE TABLE IF NOT EXISTS "qrcodes" (
	"id_code"	INTEGER UNIQUE,
	"id_seance"	INTEGER,
	"qr_code"	VARCHAR(80),
	FOREIGN KEY("id_seance") REFERENCES "seance"("id_seance"),
	PRIMARY KEY("id_code")
);
CREATE TABLE IF NOT EXISTS "filiere" (
	"id_filiere"	INTEGER UNIQUE,
	"nom"	VARCHAR(60),
	PRIMARY KEY("id_filiere")
);
CREATE TABLE IF NOT EXISTS "enrollment" (
	"id_enrollment"	INTEGER UNIQUE,
	"id_etudiant"	INTEGER,
	"id_module"	INTEGER,
	FOREIGN KEY("id_etudiant") REFERENCES "etudiant"("id_etudiant"),
	FOREIGN KEY("id_module") REFERENCES "module"("id_module"),
	FOREIGN KEY("id_module") REFERENCES "module"("id_module"),
	PRIMARY KEY("id_enrollment")
);
CREATE TABLE IF NOT EXISTS "etudiant" (
	"id_etudiant"	INTEGER UNIQUE,
	"username"	INTEGER UNIQUE,
	"password"	VARCHAR(30) UNIQUE,
	"nom"	VARCHAR(20),
	"prenom"	VARCHAR(20),
	"id_semestre"	INTEGER,
	"id_filiere"	INTEGER,
	FOREIGN KEY("id_semestre") REFERENCES "semestre"("id_semestre"),
	FOREIGN KEY("id_filiere") REFERENCES "filiere"("id_filiere"),
	PRIMARY KEY("id_etudiant")
);
CREATE TABLE IF NOT EXISTS "attendance" (
	"id_attendance"	INTEGER,
	"id_enrollment"	INTEGER,
	"id_code"	INTEGER,
	"date_attendance"	DATE,
	"time_attendance"	TIME,
	"present"	VARCHAR(8),
	FOREIGN KEY("id_enrollment") REFERENCES "enrollment"("id_enrollment"),
	FOREIGN KEY("id_code") REFERENCES "qrcodes"("id_code"),
	PRIMARY KEY("id_attendance"),
	CONSTRAINT "pk_attendance" UNIQUE("id_attendance")
);
CREATE TABLE IF NOT EXISTS "vacances" (
	"id_vacances"	INTEGER,
	"debut_vacances"	DATE,
	"fin_vacances"	DATE,
	"nombre_jours"	INTEGER,
	"title"	VARCHAR(70),
	PRIMARY KEY("id_vacances"),
	CONSTRAINT "pk_vacances" UNIQUE("id_vacances")
);
CREATE TABLE IF NOT EXISTS "administrateur" (
	"id_admin"	INTEGER UNIQUE,
	"username"	VARCHAR(30) UNIQUE,
	"password"	VARCHAR(30) UNIQUE,
	"nom"	VARCHAR(30),
	"id_filiere"	INTEGER,
	FOREIGN KEY("id_filiere") REFERENCES "filiere"("id_filiere"),
	PRIMARY KEY("id_admin")
);
INSERT INTO "module" VALUES (144,'CRISTALLOGRAPHIE GEOMETRIQUE ET CRISTALLOCHIMIE',7,4,4);
INSERT INTO "module" VALUES (151,'java',4,5,1);
INSERT INTO "module" VALUES (161,'php',1,6,1);
INSERT INTO "module" VALUES (261,'base de donnees',2,6,1);
INSERT INTO "module" VALUES (361,'reseau',3,6,1);
INSERT INTO "module" VALUES (461,'programmation systeme',8,6,1);
INSERT INTO "module" VALUES (561,'projet 1',5,6,1);
INSERT INTO "module" VALUES (661,'projet 2',6,6,1);
INSERT INTO "semestre" VALUES (1,'S1','2022-10-01','2023-01-31');
INSERT INTO "semestre" VALUES (2,'S2','2023-02-01','2023-06-31');
INSERT INTO "semestre" VALUES (3,'S3','2022-10-01','2023-01-31');
INSERT INTO "semestre" VALUES (4,'S4','2023-02-01','2023-06-31');
INSERT INTO "semestre" VALUES (5,'S5','2022-10-01','2023-01-31');
INSERT INTO "semestre" VALUES (6,'S6','2023-02-01','2023-06-31');
INSERT INTO "seance" VALUES (10161,'cours','2023-02-01','08:30:00','10:00:00',161,10161,1,NULL);
INSERT INTO "seance" VALUES (10261,'cours','2023-02-05','10:30:00','12:00:00',261,10261,1,NULL);
INSERT INTO "seance" VALUES (11261,'TD','2023-02-06','16:30:00','18:00:00',261,11261,1,NULL);
INSERT INTO "seance" VALUES (12261,'TP','2023-05-06','16:30:00','18:00:00',261,12261,1,NULL);
INSERT INTO "seance" VALUES (20161,'cours','2023-02-08','8:30:00','10:00:00',161,20161,2,NULL);
INSERT INTO "seance" VALUES (21161,'TD','2032-02-16','14:30:00','16:00:00',161,21161,2,NULL);
INSERT INTO "seance" VALUES (22161,'TP',1689423211605,'08:30','08:301.3',161,22161,2,'Aucune');
INSERT INTO "seance" VALUES (30161,'cours','2023-05-22','00:00:00','00:00:05',161,30161,3,NULL);
INSERT INTO "seance" VALUES (32161,'TP',1689423533396,'08:30','10:00',161,32161,3,'Aucune');
INSERT INTO "seance" VALUES (40161,'cours','2023-05-23','00:00:00','20:40:00',161,40161,4,NULL);
INSERT INTO "seance" VALUES (42161,'TP',1689423693958,'08:30','10:00',161,42161,4,'Aucune');
INSERT INTO "seance" VALUES (52161,'TP',1689423890806,'10:00','11:30',161,52161,5,'Aucune');
INSERT INTO "seance" VALUES (60161,'cours','2023-05-13','00:00:00','23:00:00',161,60161,6,NULL);
INSERT INTO "seance" VALUES (62161,'TP','2023-07-15','10:00','11:30',161,62161,6,'Aucune');
INSERT INTO "seance" VALUES (72161,'TP','2023-07-15','10:00','11:30',161,72161,7,'Amphi F');
INSERT INTO "seance" VALUES (80161,'cours','2023-07-15','00:00:00','23:00:00',161,80161,8,'Amphi M');
INSERT INTO "seance" VALUES (82161,'TP','2023-07-15','10:15','11:45',161,82161,8,'Amphi A');
INSERT INTO "seance" VALUES (90161,'cours','2023-07-17','00:00:00','23:00:00',161,90161,9,'Amphi M');
INSERT INTO "seance" VALUES (100161,'cours','2023-05-08','10:00:00','23:00:00',161,100161,10,'Amphi M');
INSERT INTO "professeur" VALUES (1,'prof1','password1',1,'Salhi');
INSERT INTO "professeur" VALUES (2,'prof2','password2',1,'Kader');
INSERT INTO "professeur" VALUES (3,'prof3','password3',1,'nom3');
INSERT INTO "professeur" VALUES (4,'prof4','password4',1,'nom4');
INSERT INTO "professeur" VALUES (5,'prof5','password5',1,'nom5');
INSERT INTO "professeur" VALUES (6,'prof6','password6',1,'nom6');
INSERT INTO "professeur" VALUES (7,'prof7','password7',4,'nom7');
INSERT INTO "professeur" VALUES (8,'prof8','Holamadrid',1,'nom8');
INSERT INTO "qrcodes" VALUES (10161,10161,NULL);
INSERT INTO "qrcodes" VALUES (10261,10261,NULL);
INSERT INTO "qrcodes" VALUES (12261,12261,'seance_12261_code_12261_TP_basededonnees');
INSERT INTO "qrcodes" VALUES (22161,22161,'seance_22161_code_22161_TP_php');
INSERT INTO "qrcodes" VALUES (30161,30161,'seance_30161_code_30161_cours_php');
INSERT INTO "qrcodes" VALUES (32161,32161,'seance_32161_code_32161_TP_php');
INSERT INTO "qrcodes" VALUES (40161,40161,'seance_40161_code_40161_cours_php');
INSERT INTO "qrcodes" VALUES (42161,42161,'seance_42161_code_42161_TP_php');
INSERT INTO "qrcodes" VALUES (52161,52161,'seance_52161_code_52161_TP_php');
INSERT INTO "qrcodes" VALUES (60161,60161,'seance_60161_code_60161_cours_php');
INSERT INTO "qrcodes" VALUES (62161,62161,'seance_62161_code_62161_TP_php');
INSERT INTO "qrcodes" VALUES (72161,72161,'seance_72161_code_72161_TP_php');
INSERT INTO "qrcodes" VALUES (80161,80161,'seance_80161_code_80161_cours_php');
INSERT INTO "qrcodes" VALUES (82161,82161,'seance_82161_code_82161_TP_php');
INSERT INTO "qrcodes" VALUES (90161,90161,'seance_90161_code_90161_cours_php');
INSERT INTO "qrcodes" VALUES (100161,100161,'seance_100161_code_100161_cours_php');
INSERT INTO "filiere" VALUES (0,'FSO');
INSERT INTO "filiere" VALUES (1,'SMI');
INSERT INTO "filiere" VALUES (2,'SMA');
INSERT INTO "filiere" VALUES (3,'SMC');
INSERT INTO "filiere" VALUES (4,'SMP');
INSERT INTO "filiere" VALUES (5,'STU');
INSERT INTO "filiere" VALUES (6,'SVT');
INSERT INTO "filiere" VALUES (7,'STE');
INSERT INTO "filiere" VALUES (8,'FIL1');
INSERT INTO "filiere" VALUES (9,'FIL2');
INSERT INTO "enrollment" VALUES (1443,3,144);
INSERT INTO "enrollment" VALUES (1512,2,151);
INSERT INTO "enrollment" VALUES (1611,1,161);
INSERT INTO "enrollment" VALUES (1612,2,161);
INSERT INTO "enrollment" VALUES (2611,1,261);
INSERT INTO "enrollment" VALUES (3611,1,361);
INSERT INTO "enrollment" VALUES (4611,1,461);
INSERT INTO "enrollment" VALUES (5611,1,561);
INSERT INTO "enrollment" VALUES (6611,1,661);
INSERT INTO "etudiant" VALUES (1,2001663,'H138228673','Saidi','Ossama',6,1);
INSERT INTO "etudiant" VALUES (2,2001549,'H138554678','Effani','Ayoub',6,1);
INSERT INTO "etudiant" VALUES (3,2015432,'H135484561','Bahri','Mohammed',6,4);
INSERT INTO "etudiant" VALUES (4,4000000,'H123456789','Salhi','Mohammed',4,2);
INSERT INTO "etudiant" VALUES (5,5000000,'H125482434','Allali','Assim',5,1);
INSERT INTO "etudiant" VALUES (6,1111,'H1111','nom','prénom',2,1);
INSERT INTO "attendance" VALUES (1,1611,10161,'2023-05-12','12:24:35','présent');
INSERT INTO "attendance" VALUES (6,2611,12261,'2023-05-05','14:11:8','présent');
INSERT INTO "attendance" VALUES (7,1611,30161,'2023-05-23','1:1:37','présent');
INSERT INTO "attendance" VALUES (8,1612,30161,'2023-05-23','1:8:8','absent');
INSERT INTO "attendance" VALUES (9,1611,40161,'2023-05-23','3:57:24','présent');
INSERT INTO "attendance" VALUES (10,1611,80161,'2023-06-27','14:11:53','présent');
INSERT INTO "vacances" VALUES (1,'2022-09-06','2022-09-06',1,'Marche Verte');
INSERT INTO "vacances" VALUES (2,'2023-04-30','2023-05-07',8,'vacance de printemps');
INSERT INTO "vacances" VALUES (3,'2022-10-23','2022-10-30',8,'Aïd Al Mawlid');
INSERT INTO "vacances" VALUES (4,'2022-11-18','2022-11-18',1,'Fête de l’Indépendance');
INSERT INTO "vacances" VALUES (5,'2022-12-04','2022-12-11',8,'Deuxièmes vacances');
INSERT INTO "vacances" VALUES (6,'2023-07-16','2023-07-17',1,'Manifeste de l’Indépendance ');
INSERT INTO "vacances" VALUES (7,'2023-01-22','2023-01-29',8,'Vacances de la fin du semestre');
INSERT INTO "vacances" VALUES (8,'2023-03-12','2023-03-19',8,'Troisièmes vacances');
INSERT INTO "vacances" VALUES (9,'2023-05-01','2023-05-01',1,'Fête du travail');
INSERT INTO "vacances" VALUES (10,'2023-06-20','2023-06-23',3,'Aïd Al Adha');
INSERT INTO "vacances" VALUES (11,'2222-22-22','2222-22-23',2,'vac');
INSERT INTO "administrateur" VALUES (0,'root','root','Tahri',0);
INSERT INTO "administrateur" VALUES (1,'admin1','admin1','Talbi',1);
INSERT INTO "administrateur" VALUES (2,'admin2','admin2','Salhi',2);
INSERT INTO "administrateur" VALUES (3,'admin3','admin3','Saidi',3);
INSERT INTO "administrateur" VALUES (4,'admin4','admin4','Kadim',4);
INSERT INTO "administrateur" VALUES (5,'admin5','admin5','Allami',5);
INSERT INTO "administrateur" VALUES (6,'admin6','admin6','Alaoui',6);
INSERT INTO "administrateur" VALUES (7,'admin7','admin7','Naciri',7);
INSERT INTO "administrateur" VALUES (8,'admin8','admin8','Bekalli',8);
INSERT INTO "administrateur" VALUES (9,'admin','admin','admin',9);
COMMIT;
