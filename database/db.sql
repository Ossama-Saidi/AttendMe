CREATE TABLE administrateur (
    id_admin   INTEGER      PRIMARY KEY
                            UNIQUE,
    username   VARCHAR (30) UNIQUE,
    password   VARCHAR (30) UNIQUE,
    nom        VARCHAR (30),
    id_filiere INTEGER      REFERENCES filiere (id_filiere) 
);
CREATE TABLE attendance (
    id_attendance   INTEGER     PRIMARY KEY,
    id_enrollment   INTEGER,
    id_code         INTEGER,
    date_attendance DATE,
    time_attendance TIME,
    present         VARCHAR (8),
    CONSTRAINT pk_attendance UNIQUE (
        id_attendance
    ),
    FOREIGN KEY (
        id_enrollment
    )
    REFERENCES enrollment (id_enrollment),
    FOREIGN KEY (
        id_code
    )
    REFERENCES qrcodes (id_code) 
);
CREATE TABLE enrollment (
    id_enrollment INTEGER PRIMARY KEY
                          UNIQUE,
    id_etudiant   INTEGER,
    id_module     INTEGER REFERENCES module (id_module),
    FOREIGN KEY (
        id_etudiant
    )
    REFERENCES etudiant (id_etudiant),
    FOREIGN KEY (
        id_module
    )
    REFERENCES module (id_module) 
);
CREATE TABLE etudiant (
    id_etudiant INTEGER      PRIMARY KEY
                             UNIQUE,
    username    INTEGER      UNIQUE,
    password    VARCHAR (30) UNIQUE,
    nom         VARCHAR (20),
    prenom      VARCHAR (20),
    id_semestre INTEGER,
    id_filiere  INTEGER,
    FOREIGN KEY (
        id_semestre
    )
    REFERENCES semestre (id_semestre),
    FOREIGN KEY (
        id_filiere
    )
    REFERENCES filiere (id_filiere) 
);
CREATE TABLE filiere (
    id_filiere INTEGER      UNIQUE,
    nom        VARCHAR (60),
    PRIMARY KEY (
        id_filiere
    )
);
CREATE TABLE module (
    id_module   INTEGER      PRIMARY KEY,
    nom         VARCHAR (60),
    id_prof     INTEGER,
    id_semestre INTEGER,
    id_filiere  INTEGER,
    CONSTRAINT pk_module UNIQUE (
        id_module
    ),
    FOREIGN KEY (
        id_prof
    )
    REFERENCES professeur (id_prof),
    FOREIGN KEY (
        id_semestre
    )
    REFERENCES semestre (id_semestre),
    FOREIGN KEY (
        id_filiere
    )
    REFERENCES filiere (id_filiere) 
);
CREATE TABLE professeur (
    id_prof    INTEGER      PRIMARY KEY
                            UNIQUE,
    username   VARCHAR (30) UNIQUE,
    password   VARCHAR (30) UNIQUE,
    id_filiere INTEGER      REFERENCES filiere (id_filiere),
    nom        VARCHAR (30) 
);
CREATE TABLE qrcodes (
    id_code   INTEGER      UNIQUE,
    id_seance INTEGER,
    qr_code   VARCHAR (80),
    PRIMARY KEY (
        id_code
    ),
    FOREIGN KEY (
        id_seance
    )
    REFERENCES seance (id_seance) 
);
CREATE TABLE seance (
    id_seance      INTEGER       PRIMARY KEY
                                 UNIQUE,
    type           VARCHAR (10),
    date_seance    DATE,
    heure_debut    TIME,
    heure_fin      TIME,
    id_module      INTEGER,
    id_code        INTEGER       REFERENCES qrcodes (id_code),
    numero_semaine INTEGER,
    salle          VARCHAR (100),
    FOREIGN KEY (
        id_module
    )
    REFERENCES module (id_module) 
);
CREATE TABLE semestre (
    id_semestre INTEGER      PRIMARY KEY
                             UNIQUE,
    nom         VARCHAR (10),
    date_debut  DATE,
    date_fin    DATE
);
CREATE TABLE vacances (
    id_vacances    INTEGER      PRIMARY KEY,
    debut_vacances DATE,
    fin_vacances   DATE,
    nombre_jours   INTEGER,
    title          VARCHAR (70),
    CONSTRAINT pk_vacances UNIQUE (
        id_vacances
    )
);