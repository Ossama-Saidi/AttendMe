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