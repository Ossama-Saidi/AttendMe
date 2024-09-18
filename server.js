//--------------------------------------------------------------------
/*                                                                  */
/*                             API FILE                             */
/*                                                                  */
//--------------------------------------------------------------------
//--------les modules nécessaires :
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
// Import the QR code generator library
// const qr = require('qrcode');
// const fs = require('fs');
//--------Créer une instance de l'application Express :
const app = express();
const PORT = 3001;// le port sur lequel votre serveur doit écouter
const IP_ADDRESS = '0.0.0.0'; // l'adresse IP sur laquelle votre serveur doit écouter (toutes les interfaces)
//--------Configurer l'application Express pour utiliser le middleware Cors :
app.use(cors());
//--------le middleware 'body-parser' pour la gestion des requêtes POST :
app.use(bodyParser.json());
//--------the session middleware to your app by using the app.use() method :
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
  }));
//---------Messages des errors :
  const ERROR_MESSAGES = {
    USERNAME_PASSWORD_REQUIRED: 'Nom d\'utilisateur et mot de passe sont obligatoires',
    INVALID_CREDENTIALS: 'Nom d\'utilisateur ou mot de passe incorrect',
  }; 
//--------Créer une connexion à la base de données SQLite :
const db = new sqlite3.Database('./database/database.db', (err) => {
   if (err) {
      console.error(err.message);
   }
   console.log('Connecté à la base de données SQLite.');
});
app.get('/', (req, res) => {
   res.send('Bienvenue sur le serveur backend.');
});
//--------Define our API routes:
//--------------------------------------------------------------------
/*                                                                  */
/*                          DEBUT ROUTES                            */
/*                                                                  */
//--------------------------------------------------------------------


  //--------------------------------------------------------------------
  /*                                                                  */
  /*                           Route Login                            */
  /*                                                                  */
  //--------------------------------------------------------------------
    // Créer une nouvelle route POST pour la vérification des informations d'identification
    const failedAttempts = {};
    app.post(`/login`, (req, res) => {
        const { username, password, type} = req.body;

        if (failedAttempts[username] && failedAttempts[username].count >= 7) {
          const currentTime = Date.now();
          const timeoutDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
          const timeoutEndTime = failedAttempts[username].timestamp + timeoutDuration;
      
          if (currentTime < timeoutEndTime) {
            const remainingTime = Math.ceil((timeoutEndTime - currentTime) / 1000);
            const timeoutMessage = `Too many failed login attempts. Please try again after ${remainingTime} seconds.`;
      
            return res.status(429).json({ message: timeoutMessage });
          } else {
            // Reset the failed attempts count if the timeout has expired
            failedAttempts[username].count = 0;
            failedAttempts[username].timestamp = currentTime;
          }
        }
      
        // Vérifier que les données d'entrée sont valides
        //     if (!username || typeof password !== 'string' ) {
        if ( !username || !password ) {
          return res.status(400).json({ message: ERROR_MESSAGES.USERNAME_PASSWORD_REQUIRED });
      }
        // Effectuer une recherche dans la base de données pour l'utilisateur avec le nom d'utilisateur donné
      const sql = `SELECT * FROM  ${type} WHERE username = ? AND password = ?`;
        db.get(sql, [username, password], (error, row) => {
          if (error) {
            // console.error(error);
            return res.status(500).send("Erreur lors de l'exécution de la requête.")
          }
          if (!row) {
            // Si l'utilisateur n'est pas trouvé dans la base de données, renvoyer une erreur
             // Increment the failed login attempts count for the user
            if (!failedAttempts[username]) {
              failedAttempts[username] = {
                count: 1,
                timestamp: Date.now()
              };
            } else {
              failedAttempts[username].count++;
            }      
            return res.status(401).json({ message: ERROR_MESSAGES.INVALID_CREDENTIALS });
          } else {
            // Reset the failed login attempts count for the user
            if (failedAttempts[username]) {
              failedAttempts[username].count = 0;
              failedAttempts[username].timestamp = Date.now();
            }

      //Si l'utilisateur est un étudiant, son ID est ajouté à la session sous la forme d'un objet 
      // avec une propriété id_etudiant. Cela permet à la route /seance de récupérer l'ID de l'étudiant à partir de req.session.user.id_etudiant.
                if (type === 'etudiant') {
                    req.session.user = { id_etudiant: row.id_etudiant };
                } else if (type === 'professeur') {
                    req.session.user = { id_prof: row.id_prof };
                } else if (type === 'administrateur'){
                    req.session.user = { id_admin: row.id_admin };
                }
                // Si l'utilisateur est un administrateur, son ID est ajouté à la session sous la forme d'un objet
                //-----------------------------------------------------------------
            // res.status(200).send('Connexion réussie !');
            const response = {
              success: true,
              message: 'Connexion réussie !',
              user: req.session.user,
            };
            res.status(200).json(response);
            }
              // Si le mot de passe ne correspond pas, renvoyer une erreur
            //return res.status(401).json({ message: ERROR_MESSAGES.INVALID_CREDENTIALS });
        });
      });
  //---------------------------------------------------------------------------
  //---------------------------------------------------------------------------
  /*app.get('/session', (req, res) => {
    if (req.session.user) {
      return res.json(req.session.user);
    } else {
      return res.status(401).json({ message: 'Non connecté.' });
    }
  });*/
  app.get('/session', (req, res) => {
    const user = req.session.user;
    if (!user) {
      return res.status(401).json({ message: 'Vous n\'êtes pas connecté.' });
    }
    res.json({ user });
  });
  
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------  
//--------------------------------------------------------------------
/*                                                                  */
/*                       Route Rest Password                        */
/*                                                                  */
//--------------------------------------------------------------------
// Reset password route
app.post('/ResetPassword', (req, res) => {
    const { username, identifierCode, password ,type} = req.body;
    // Check if username and identifierCode match a record in the selected table
    let table = '';
    let usernameColumn = '';
    let idColumn = '';
     // Determine which table to use based on the request body
     if (req.body.type === 'etudiant') {
    table = 'etudiant';
    usernameColumn = 'username';
    idColumn = 'id_etudiant';
    } else if (req.body.type === 'professeur') {
    table = 'professeur';
    usernameColumn = 'username';
    idColumn = 'id_prof';
    } else if (req.body.type === 'administrateur') {
    table = 'administrateur';
    usernameColumn = 'username';
    idColumn = 'id_admin';
    } else {
    res.status(400).send('Invalid user type');
    return;
    }
    const query = `SELECT * FROM ${type} WHERE username = ? AND ${idColumn} = ?`;
    
    db.all(query, [username, identifierCode], (err, row) => {
      if (err) throw err;

      if (row.length === 0) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      
      // Update the password for the matching user
      const updateQuery = `UPDATE ${type} SET password = ?
      WHERE username = ? AND ${idColumn} = ?`;
      db.run(updateQuery, [password, username, identifierCode], function(err) {
        if (err) {
          return res.status(500).json({ success: false, message: 'Échec de la mise à jour du mot de passe.' });
        }
        return res.status(200).json({ success: true, message: "Réinitialisation du mot de passe réussie." });
      });
    });
  });
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------  
//--------------------------------------------------------------------
/*                                                                  */
/*                       Route Ajoute Module                        */
/*                                                                  */
//--------------------------------------------------------------------
// Ajouter un module dans une filiere
app.post('/AjoutModule', async (req, res) => {
  // Extract the module data from the request body
  const { idFiliere, module, professeur , semestre} = req.body;
  // Validate the inputs
  if ( !module || !professeur || !semestre) {
    return res.status(400).json({ success: false, message: 'Veuillez fournir toutes les informations requises.' });
  }

  // Verify that the authenticated user is authorized to add modules for the specified filiere
  const { username } = req.body; // Assuming you have middleware that authenticates the user and sets the req.user object

  try {
     const admin = db.all('SELECT * FROM administrateur WHERE id_filiere =? AND username = ?', [idFiliere, username]);
     
     if (!admin) {
       return res.status(403).json({ success: false, message: 'Vous n\'êtes pas autorisé(e) à ajouter des modules pour cette filière.' });
     }
   } catch (error) {
     console.error(error);
     return res.status(500).json({ success: false, message: 'Une erreur s\'est produite. Veuillez réessayer ultérieurement.' });
   }

  // Get the id_prof of the given professor: 
  //---------------if : les modules sont enseigner par les prof de meme filiere
        // db.get('SELECT id_prof FROM professeur WHERE username = ? AND id_filiere = ?', [professeur,idFiliere], (err, row) => {
  //---------------else : 
  db.get('SELECT id_prof FROM professeur WHERE username = ?', [professeur], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ message: 'An error occurred. Please try again later. from prof' });
      return;
    }
    if (!row) {
      res.status(400).json({ message: 'The given professor was not found.' });
      return;
    }

    const idProf = row.id_prof;

    // Get the id_semestre of the given semester:
    db.get('SELECT id_semestre FROM semestre WHERE nom = ?', [semestre], (err, row) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ message: 'An error occurred. Please try again later. from semestre' });
        return;
      }
      if (!row) {
        res.status(400).json({ message: 'The given semester was not found.' });
        return;
      }

      const idSemestre = row.id_semestre;

      // // Get the id_filiere of the given filiere:
      // -----db.get('SELECT id_filiere FROM filiere WHERE nom = ?', [filiere], (err, row) => {
      //   if (err) {
      //     console.error(err.message);
      //     res.status(500).json({ message: 'An error occurred. Please try again later.' });
      //     return;
      //   }
      //   if (!row) {
      //     res.status(400).json({ message: 'The given filiere was not found.' });
      //     return;
      //   }

      //   const idFiliere = row.id_filiere;
        // Combiner les ids pour obtenir l'id_module :
    const id_module = parseInt(`${idProf}${idSemestre}${idFiliere}`);

    // Insérer le nouveau module dans la base de données :
    const insertModuleQuery = 'INSERT INTO module (id_module, nom, id_prof, id_semestre, id_filiere) VALUES (?, ?, ?, ?, ?)';
    db.run(insertModuleQuery, [id_module, module, idProf, idSemestre, idFiliere], function(err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: 'Failed to create module' });
      }
      console.log(`A new module has been added with id ${this.lastID}.`);

      return res.status(200).json({ success: true, message: 'Module added successfully.' });
    }); 
  });
});
});
//--------------------------------------------------------------------
/*                                                                  */
/*                    Route Ajoute Professeur                       */
/*                                                                  */
//--------------------------------------------------------------------
// Ajouter un professeur dans une filiere
app.post('/AjoutProf', async (req, res) => {
  const { idFiliere, name, password, nom } = req.body;
  // Validate the inputs
  if ( !name || !password || !nom) {
    return res.status(400).json({ success: false, message: 'Veuillez fournir toutes les informations requises.' });
  }
  // Verify that the authenticated user is authorized to add professeurs for the specified filiere
  const { username } = req.body;

  try {
     const admin = db.all('SELECT * FROM administrateur WHERE id_filiere =? AND username = ?', [idFiliere, username]);
     
     if (!admin) {
       return res.status(403).json({ success: false, message: 'Vous n\'êtes pas autorisé(e) à ajouter des enseignants pour cette filière.' });
     }
   } catch (error) {
     console.error(error);
     return res.status(500).json({ success: false, message: 'Une erreur s\'est produite. Veuillez réessayer ultérieurement.' });
   }
    // Insérer le nouveau professeur dans la base de données :
    const insertProfQuery = 'INSERT INTO professeur ( username, password, id_filiere, nom) VALUES (?, ?, ?, ?)';
    db.run(insertProfQuery, [name, password, idFiliere, nom], function(err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: 'Failed to add professeur' });
      }
      console.log(`A new enseignant has been added with id ${this.lastID}.`);

      return res.status(200).json({ success: true, message: 'Enseignant ajouté avec succès.' });
    }); 
  });
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------  
//--------------------------------------------------------------------
/*                                                                  */
/*                       Route Ajoute Etudiant                      */
/*                                                                  */
//--------------------------------------------------------------------
// Ajouter un etudiant dans une filiere
app.post('/AjoutEtud', async (req, res) => {
  // Extract the etudiant data from the request body
  const { idFiliere, apoge, cne , nom, prenom, semestre} = req.body;
  // Validate the inputs
  if ( !nom || !prenom || !semestre || !cne || !apoge) {
    return res.status(400).json({ success: false, message: 'Veuillez fournir toutes les informations requises.' });
  }

  // Verify that the authenticated user is authorized to add modules for the specified filiere
  const { username } = req.body;
  try {
     const admin = db.all('SELECT * FROM administrateur WHERE id_filiere =? AND username = ?', [idFiliere, username]);
     if (!admin) {
       return res.status(403).json({ success: false, message: 'You are not authorized to add etudiants for this filiere' });
     }
   } catch (error) {
     console.error(error);
     return res.status(500).json({ success: false, message: 'Une erreur s\'est produite. Veuillez réessayer ultérieurement.' });
   }
    // Get the id_semestre of the given semester:
    db.get('SELECT id_semestre FROM semestre WHERE nom = ?', [semestre], (err, row) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer ultérieurement.' });
        return;
      }
      if (!row) {
        res.status(400).json({ message: 'Le semestre donné n\'a pas été trouvé.' });
        return;
      }

      const idSemestre = row.id_semestre;

    // Insérer le nouveau etudiant dans la base de données :
    const insertEtudQuery = 'INSERT INTO etudiant (username, password, nom, prenom, id_semestre, id_filiere) VALUES (?, ?, ?, ?, ?, ?)';
    db.run(insertEtudQuery, [apoge, cne, nom, prenom, idSemestre, idFiliere], function(err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: 'Échec de l\'ajout de l\'étudiant.' });
      }
      console.log(`A new module has been added with id ${this.lastID}.`);

      return res.status(200).json({ success: true, message: 'Étudiant ajouté avec succès.' });
    }); 
  });
});
//--------------------------------------------------------------------
/*                                                                  */
/*                       Route Ajoute Filiere                       */
/*                                                                  */
//--------------------------------------------------------------------
// Ajouter une filiere pour l'administrateur global
app.post('/AjoutFiliere', async (req, res) => {
  // Extract the 'filiere' data from the request body
  const {nomFiliere} = req.body;
  if ( !nomFiliere ) {
    return res.status(400).json({ success: false, message: 'Veuillez fournir toutes les informations requises.' });
  }
    // Verify that the authenticated user is authorized to add filieres
    const { username } = req.body;
    const checkAuthorizationQuery = 'SELECT * FROM administrateur WHERE username = ? AND id_filiere = 0';
    db.get(checkAuthorizationQuery, [username], function(err,row) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Une erreur s\'est produite lors de la vérification de l\'autorisation.' });
      }
      if (!row) {
        return res.status(400).json({ success: false, message: 'Vous étes pas autorisé à faire cette operation.' });
      }

    // Get the current maximum value of id_filiere
    const getMaxIdQuery = `SELECT MAX(id_filiere) AS maxId FROM filiere WHERE NOT EXISTS (SELECT 1 FROM filiere WHERE nom = ? );`;
    db.get(getMaxIdQuery,[nomFiliere], function(err, row) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: 'Échec de l\'ajout de la filière.' });
      }
    // Generate a new unique value for id_filiere
    const idFiliere = row.maxId ? row.maxId + 1 : 1;
    // Insérer le nouveau filiere dans la base de données :
    const insertEtudQuery = 'INSERT INTO filiere (id_filiere,nom) VALUES (?,?)';
    db.run(insertEtudQuery, [idFiliere,nomFiliere], function(err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: 'Échec de l\'ajout de la filière.' });
      }
      console.log(`A new filiere has been added with id ${this.lastID}.`);

      return res.status(200).json({ success: true, message: 'Filière ajoutée avec succès.' });
    }); 
  });
});
});
//--------------------------------------------------------------------
/*                                                                  */
/*                       Route Ajoute Vacances                      */
/*                                                                  */
//--------------------------------------------------------------------
app.post('/AjoutVacances', async (req, res) => {
  const {debut_vacance,fin_vacance,nombre_jours,title} = req.body;
  if ( !debut_vacance || !fin_vacance || !nombre_jours || !title ) {
    return res.status(400).json({ success: false, message: 'Missing required fields' }); //'Veuillez fournir toutes les informations requises.'
  }
  /*-----------------------------------------------------------------------------------------
          dateRegex validates the date format in YYYY-MM-DD pattern.
          numberRegex validates that nombre_jours is a positive integer.
          titleRegex allows only alphabetic characters and whitespace in the title variable.
  -------------------------------------------------------------------------------------------*/
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const numberRegex = /^\d+$/;
  const titleRegex = /^[a-zA-Z\s]+$/;

  if (!dateRegex.test(debut_vacance) || !dateRegex.test(fin_vacance)) {
    return res.status(400).json({ success: false, message: 'Format de date invalide.' });
  }

  if (!numberRegex.test(nombre_jours)) {
    return res.status(400).json({ success: false, message: 'Format de nombre invalide.' });
  }

  if (!titleRegex.test(title)) {
    return res.status(400).json({ success: false, message: 'Format invalide pour le titre.' });
  }
    // // Verify that the authenticated user is authorized to add filieres
    // const { username } = req.body;
    // try {
    //   const admin = db.all('SELECT * FROM administrateur WHERE id_filiere = 0 AND username = ?', [username]);
    //   if (!admin) {
    //     return res.status(403).json({ success: false, message: 'You are not authorized to add vacances' });
    //   }
    // } catch (error) {
    //   // console.error(error);
    //   return res.status(500).json({ success: false, message: 'An error occurred. Please try again later.' });
    // }
    // Get the current maximum value of id_vacances
    const getMaxIdQuery = 'SELECT MAX(id_vacances) AS maxId FROM vacances';
    db.get(getMaxIdQuery, function(err, row) {
      if (err) {
        // console.error(err.message);
        return res.status(500).json({ success: false, message: 'Échec de l\'ajout de la période de vacances.' });
      }
    // Generate a new unique value for id_vacance
    const idVacance = row.maxId ? row.maxId + 1 : 1;
    // Insérer la nouvelle vacance dans la base de données :
    const insertEtudQuery = 'INSERT INTO vacances (id_vacances,debut_vacances,fin_vacances,nombre_jours,title) VALUES (?,?,?,?,?)';
    db.run(insertEtudQuery, [idVacance,debut_vacance,fin_vacance,nombre_jours,title], function(err) {
      if (err) {
        // console.error(err.message);
        return res.status(500).json({ success: false, message: 'Échec de l\'ajout de la période de vacances.' });
      }
      console.log(`A new vacance has been added with id ${this.lastID}.`);

      return res.status(200).json({ success: true, message: 'Période de vacances ajoutée avec succès.' });
    }); 
  });
});
//--------------------------------------------------------------------
/*                                                                  */
/*                       Route Ajoute Admins                        */
/*                                                                  */
//--------------------------------------------------------------------
app.post('/AjoutAdmins', async (req, res) => {
  const {name,user,password,filiere} = req.body;
  if ( !name || !user || !password || !filiere ) {
    return res.status(400).json({ success: false, message: 'Veuillez fournir toutes les informations requises.' });
  }
    const { username } = req.body;
    try {
      const admin = db.all('SELECT * FROM administrateur WHERE id_filiere = 0 AND username = ?', [username]);
      if (!admin) {
        return res.status(403).json({ success: false, message: 'Vous n\'êtes pas autorisé(e) à ajouter des administrateurs.' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Une erreur s\'est produite. Veuillez réessayer ultérieurement.' });
    }

    // Get id_filiere from filiere name
      const getIdQuery = 'SELECT id_filiere FROM filiere WHERE nom = ?';
      db.get(getIdQuery,[filiere],(err, row) => {
        if (err) {
          // console.error(err.message);
          return res.status(500).json({ success: false, message: 'Échec de l\'ajout des administrateurs.' });
        }
        if (!row) {
          res.status(400).json({ message: 'La filière donnée n\'a pas été trouvée.' });
          return;
        }
      const idFiliere = row.id_filiere;
    //------------------------------------------------------
    // Get the current maximum value of id_admin
      const getMaxIdQuery = 'SELECT MAX(id_admin) AS maxId FROM administrateur';
      db.get(getMaxIdQuery, function(err, row) {
        if (err) {
          // console.error(err.message);
          return res.status(500).json({ success: false, message: 'Échec de l\'ajout des administrateurs.' });
        }
    // Generate a new unique value for id_filiere
      const idAdmin = row.maxId ? row.maxId + 1 : 1;
      // const idFiliere = idAdmin;
    //------------------------------------------------------
    // Insérer le nouveau filiere dans la base de données :
      const insertEtudQuery = 'INSERT INTO administrateur (id_admin,username,password,nom,id_filiere) VALUES (?,?,?,?,?)';
      db.run(insertEtudQuery, [idAdmin,user,password,name,idFiliere], function(err) {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ success: false, message: 'Échec de l\'ajout des administrateurs.' });
        }
        console.log(`A new admin has been added with id ${this.lastID}.`);

        return res.status(200).json({ success: true, message: 'Administrateur ajouté avec succès.' });
      }); 
    });
  });
});
//---------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------
/*                                                                  */
/*                     Route Modifier Module                        */
/*                                                                  */
//--------------------------------------------------------------------
// Changer l'enseignant de module specifie
app.post('/ModiModule', async (req, res) => {
  try {
    //idFiliere : c'est l'id d'admin qui doit faire cette operation
  const { module, enseignant } = req.body;
  // const { idFiliere } = req.body;

  // Validate the inputs
  if ( !module || !enseignant ) {
    return res.status(400).json({ message: 'Veuillez fournir toutes les informations requises.' }); //'Missing required fields'
  }

// // Verify that the authenticated user is authorized to update modules for the specified filiere
// const admin = db.all('SELECT * FROM module WHERE id_filiere = ? AND nom = ?', [idFiliere, module]);
//     if (!admin) {
//       return res.status(403).json({ message: 'Vous n\'êtes pas autorisé(e) à changer les enseignants pour cette filière.' });
//     }


// Verifie c'est le module existe
  db.get('SELECT id_module FROM module WHERE nom = ?', [module], (err, row) => {
    if (err) {
      // console.error(err.message);
      return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
      
    }
    if (!row) {
      return res.status(400).json({ message: 'Le module indiqué n\'a pas été trouvé.' });
    }
  const idModule = row.id_module;


  // Get the id_prof of the given professor: 
  db.get('SELECT id_prof FROM professeur WHERE username = ?', [enseignant], (err, row) => {
    if (err) {
      // console.error(err.message);
      return res.status(500).json({  message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
      
    }
    if (!row) {
      return res.status(400).json({ message: 'Le professeur indiqué n\'a pas été trouvé.' });
    }

    const idProf = row.id_prof;

    // Insérer les nouveaux donnees dans la base de données :
    const insertProfQuery = 'UPDATE module SET id_prof = ? WHERE id_module = ?';
    //;UPDATE professeur SET id_module = ? WHERE id_prof = ?;
    db.run(insertProfQuery, [idProf,idModule], function(err) {
      if (err) {
        // console.error(err.message);
        return res.status(500).json({ success: false, message: `Échec de la modification de l'enseignant pour le module ${module}`});
      }
      // console.log(`L'enseignant a été change avec succes avec l'ID ${this.lastID}.`);

      return res.status(200).json({ success: true, message: `L\'Enseignant change avec succès pour le module ${module}.` });
    }); 
  });
 });
} catch (error) {
  //  console.error(error);
   return res.status(500).json({ success: false, message: 'Une erreur s\'est produite. Veuillez réessayer ultérieurement.' });
 }
});
//--------------------------------------------------------------------
/*                                                                  */
/*                     Route Modifier Etudiant                      */
/*                           (semestre)                             */
//--------------------------------------------------------------------
// Changer l'enseignant de module specifie
app.post('/ModiEtudSem', async (req, res) => {
  try {
    //idFiliere : c'est l'id d'admin qui doit faire cette operation
  const { semestre, apoge} = req.body;
  // const { idFiliere } = req.body;

  // Validate the inputs
  if ( !semestre ) {
    return res.status(400).json({ message: 'Veuillez fournir toutes les informations requises.' }); //'Missing required fields'
  }

// // Verify that the authenticated user is authorized to update modules for the specified filiere
// const admin = db.all('SELECT * FROM module WHERE id_filiere = ? AND nom = ?', [idFiliere, module]);
//     if (!admin) {
//       return res.status(403).json({ message: 'Vous n\'êtes pas autorisé(e) à changer les enseignants pour cette filière.' });
//     }


// Verifie c'est le filiere / semestre existe
  db.get('SELECT id_semestre FROM semestre WHERE nom = ?', [semestre], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
    }
    if (!row) {
      return res.status(400).json({ message: 'Le semestre indiqué n\'a pas été trouvé.' });
    }
  const idSemestre = row.id_semestre;
  db.get('SELECT nom FROM etudiant WHERE username = ?', [apoge], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
    }
    if (!row) {
      return res.status(400).json({ message: 'L\'etudiant indiqué n\'a pas été trouvé.' });
    }
  const nom = row.nom;
    // Insérer les nouveaux donnes dans la base de données :
    const insertEtudQuery = 'UPDATE etudiant SET id_semestre = ? WHERE username = ?';
    db.run(insertEtudQuery, [idSemestre,apoge], function(err) {
      if (err) {
        // console.error(err.message);
        return res.status(500).json({ success: false, message: `Échec de la modification de l'etudiant`});
      }
      // console.log(`L'enseignant a été change avec succes avec l'ID ${this.lastID}.`);

      return res.status(200).json({ success: true, message: `Les donnees du l\'étudiant ${nom} change avec succès.` });
    }); 
  });
  });
} catch (error) {
  //  console.error(error);
   return res.status(500).json({ success: false, message: 'Une erreur s\'est produite. Veuillez réessayer ultérieurement.' });
 }
});
//--------------------------------------------------------------------
/*                                                                  */
/*                     Route Modifier Etudiant                      */
/*                            (filiere)                             */
//--------------------------------------------------------------------
// Changer l'enseignant de module specifie
app.post('/ModiEtudFiliere', async (req, res) => {
  try {
    //idFiliere : c'est l'id d'admin qui doit faire cette operation
  const { filiere, apoge} = req.body;
  // const { idFiliere } = req.body;

  // Validate the inputs
  if ( !filiere ) {
    return res.status(400).json({ message: 'Veuillez fournir toutes les informations requises.' }); //'Missing required fields'
  }

// // Verify that the authenticated user is authorized to update modules for the specified filiere
// const admin = db.all('SELECT * FROM module WHERE id_filiere = ? AND nom = ?', [idFiliere, module]);
//     if (!admin) {
//       return res.status(403).json({ message: 'Vous n\'êtes pas autorisé(e) à changer les enseignants pour cette filière.' });
//     }


// Verifie c'est le filiere / semestre existe
  db.get('SELECT id_filiere FROM filiere WHERE nom = ?', [filiere], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
      
    }
    if (!row) {
      return res.status(400).json({ message: 'La filiere indiqué n\'a pas été trouvé.' });
    }
  const idfiliere = row.id_filiere;
  db.get('SELECT nom FROM etudiant WHERE username = ?', [apoge], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
    }
    if (!row) {
      return res.status(400).json({ message: 'L\'etudiant indiqué n\'a pas été trouvé.' });
    }
  const nom = row.nom;
    // Insérer les nouveaux donnes dans la base de données :
    const insertEtudQuery = 'UPDATE etudiant SET id_filiere = ? WHERE username = ?';
    db.run(insertEtudQuery, [idfiliere,apoge], function(err) {
      if (err) {
        // console.error(err.message);
        return res.status(500).json({ success: false, message: `Échec de la modification de l'etudiant`});
      }
      // console.log(`L'enseignant a été change avec succes avec l'ID ${this.lastID}.`);

      return res.status(200).json({ success: true, message: `Les donnees du l\'étudiant ${nom} change avec succès.` });
    }); 
  });
 });
} catch (error) {
  //  console.error(error);
   return res.status(500).json({ success: false, message: 'Une erreur s\'est produite. Veuillez réessayer ultérieurement.' });
 }
});
//---------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------
/*                                                                  */
/*                       Route Supprimer Module                     */
/*                                                                  */
//--------------------------------------------------------------------
  app.post('/SuprModule', async (req, res) => {
    try {
      // Extract the module data from the request body
      const { idFiliere, module } = req.body;
      // Validate the inputs
      if (!module || !idFiliere) {
        return res.status(400).json({ success: false, message: 'Veuillez fournir toutes les informations requises.' });
      }
  // Check if the user is authorized to perform the delete operation
  const checkAuthorizationQuery = 'SELECT * FROM module WHERE id_filiere = ? AND nom = ?';
  db.get(checkAuthorizationQuery, [idFiliere,module], function(err, row) {
    if (err) {
      // console.error(err.message);
      return res.status(500).json({ success: false, message: 'Une erreur s\'est produite lors de la vérification de l\'autorisation.' });
    } 
    if (!row) {
      return res.status(403).json({ success: false, message: 'Échec de la suppression de ce module. Vous n\'êtes pas autorisé(e) à effectuer cette opération pour cette filière.' });
    }
        // Delete the module from the database
        const deleteModuleQuery = 'DELETE FROM module WHERE nom = ? AND id_filiere = ?';
        db.run(deleteModuleQuery, [module, idFiliere], (err) => {
          if (err) throw err;
          // console.log(`Module ${module} has been deleted.`);
          return res.status(200).json({ success: true, message: `Le module ${module} supprimé avec succès.` });
        });
      });
    } catch (err) {
      // console.error(err.message);
      return res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la suppression de ce module.' });
    }
  });
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------  
//--------------------------------------------------------------------
/*                                                                  */
/*                       Route Supprimer Professeur                 */
/*                                                                  */
//--------------------------------------------------------------------
app.post('/SuprProf', async (req, res) => {
  try {
    // Extract the module data from the request body
    const { idFiliere, professeur } = req.body;
    // Validate the inputs
    if (!professeur || !idFiliere) {
      return res.status(400).json({ success: false, message: 'Veuillez fournir toutes les informations requises.' });
    }
// Check if the user is authorized to perform the delete operation
const checkAuthorizationQuery = 'SELECT * FROM professeur WHERE id_filiere = ? AND username = ?';
db.get(checkAuthorizationQuery, [idFiliere,professeur], function(err, row) {
  if (err) {
    // console.error(err.message);
    return res.status(500).json({ success: false, message: 'Une erreur s\'est produite lors de la vérification d\'autorisation.' });
  } 
  if (!row) {
    return res.status(403).json({ success: false, message: 'Échec de la suppression de cet enseignant. Vous n\'êtes pas autorisé à effectuer cette opération pour cette filière.' });
  }
      // Delete the module from the database
      const deleteModuleQuery = 'DELETE FROM professeur WHERE username = ? AND id_filiere = ?';
      db.run(deleteModuleQuery, [professeur, idFiliere], (err) => {
        if (err) throw err;
        // console.log(`Teacher has been deleted.`);
        return res.status(200).json({ success: true, message: `L\'Enseignant  ${professeur} supprimé avec succès.` });
      });
    });
  } catch (err) {
    // console.error(err.message);
    return res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la suppression de ce professeur.' });
  }
});
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------  
//--------------------------------------------------------------------
/*                                                                  */
/*                       Route Supprimer Etudiant                   */
/*                                                                  */
//--------------------------------------------------------------------
  app.post('/SuprEtud', async (req, res) => {
    try {
      // Extract the module data from the request body
      const { idFiliere, nom, prenom ,apoge} = req.body;
      // Validate the inputs
      if (!apoge || !nom || !prenom || !idFiliere) {
        return res.status(400).json({ success: false, message: 'Veuillez fournir toutes les informations requises.' });
      }
  // Check if the user is authorized to perform the delete operation
  const checkAuthorizationQuery = 'SELECT * FROM etudiant WHERE id_filiere = ? AND nom = ? AND prenom = ? AND username = ?';
  db.get(checkAuthorizationQuery, [idFiliere,nom,prenom,apoge], function(err, row) {
    if (err) {
      // console.error(err.message);
      return res.status(500).json({ success: false, message: 'Une erreur s\'est produite lors de la vérification d\'autorisation.' });
    } 
    if (!row) {
      return res.status(403).json({ success: false, message: 'Échec de la suppression de cet étudiant. Vous n\'êtes pas autorisé à effectuer cette opération pour cette filière.' });
    }
        // Delete the module from the database
        const deleteModuleQuery = 'DELETE FROM etudiant WHERE username = ? AND id_filiere = ? AND nom = ? AND prenom = ?';
        db.run(deleteModuleQuery, [apoge, idFiliere, nom, prenom], (err) => {
          if (err) throw err;
          // console.log(`Student ${nom} ${prenom} has been deleted.`);
          return res.status(200).json({ success: true, message: `L\'étudiant ${nom} ${prenom} supprimé avec succès.` });
        });
      });
    } catch (err) {
      // console.error(err.message);
      return res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la suppression de cet étudiant.' });
    }
  });
//--------------------------------------------------------------------
/*                                                                  */
/*                       Route Supprimer Admin                      */
/*                                                                  */
//--------------------------------------------------------------------
//Ajouter un message innforme le client dans front-end
app.post('/SuprAdmin', async (req, res) => {
  try {
    //Pour faire cette operationl'admin general doit saiser son password 
    const { passw,username,name } = req.body;
    // Validate the inputs
    if (!passw || !name) {
      return res.status(400).json({ success: false, message: 'Veuillez fournir toutes les informations requises.' });
    }
// Check if the user is authorized to perform the delete operation
const checkAuthorizationQuery = 'SELECT * FROM administrateur WHERE username = ? AND password = ? AND id_filiere = 0';
db.get(checkAuthorizationQuery, [username,passw], function(err, row) {
  if (err) {
    return res.status(500).json({ success: false, message: 'Une erreur s\'est produite lors de la vérification de l\'autorisation.' });
  } 
  if (!row) {
    return res.status(403).json({ success: false, message: 'Votre mot de passe est incorrect.' });
  }
      const deleteVacancesQuery = 'DELETE FROM administrateur WHERE nom = ?';
      db.run(deleteVacancesQuery,[name], (err) => {
        if (err) throw err;
        return res.status(200).json({ success: true, message: `L'admin ${name} supprimé avec succès.` });
      });
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la suppression.' });
  }
});
//--------------------------------------------------------------------
/*                                                                  */
/*                       Route Réinitialiser                        */
/*                           (Vacances)                             */
//--------------------------------------------------------------------
//Ajouter un message innforme le client dans front-end
app.post('/ReinitialiserVacances', async (req, res) => {
  try {
    //Pour faire cette operationl'admin general doit saiser son password 
    const { pswrd,username } = req.body;
    // Validate the inputs
    if (!pswrd) {
      return res.status(400).json({ success: false, message: 'Veuillez fournir votre pasword.' });
    }
// Check if the user is authorized to perform the delete operation
const checkAuthorizationQuery = 'SELECT * FROM administrateur WHERE username = ? AND password = ? AND id_filiere = 0';
db.get(checkAuthorizationQuery, [username,pswrd], function(err, row) {
  if (err) {
    return res.status(500).json({ success: false, message: 'Une erreur s\'est produite lors de la vérification de l\'autorisation.' });
  } 
  if (!row) {
    return res.status(403).json({ success: false, message: 'Échec de la réinitialiser. Votre mot de passe est incorrect.' });
  }
      const deleteVacancesQuery = 'DELETE FROM vacances';
      db.run(deleteVacancesQuery, (err) => {
        if (err) throw err;
        return res.status(200).json({ success: true, message: `Toutes les vacances enregistrées ont été supprimées avec succès.` });
      });
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la réinitialisation.' });
  }
});
//--------------------------------------------------------------------
/*                                                                  */
/*                       Route Supprimer Filiere                    */
/*                                                                  */
//--------------------------------------------------------------------
//Ajouter un message innforme le client dans front-end
app.post('/SuprFiliere', async (req, res) => {
  try {
    const {username,nomFiliere } = req.body;
    // Validate the inputs
    if (!nomFiliere) {
      return res.status(400).json({ success: false, message: 'Veuillez fournir toutes les informations requises.' });
    }
// Check if the user is authorized to perform the delete operation
const checkAuthorizationQuery = 'SELECT * FROM administrateur WHERE username = ? AND id_filiere = 0';
db.get(checkAuthorizationQuery, [username], function(err,row) {
  if (err) {
    return res.status(500).json({ success: false, message: 'Une erreur s\'est produite lors de la vérification de l\'autorisation.' });
  }
  if (!row) {
    return res.status(400).json({ success: false, message: 'Vous étes pas autorisé à faire cette operation.' });
  }
      const deleteVacancesQuery = 'DELETE FROM filiere WHERE nom = ?';
      db.run(deleteVacancesQuery,[nomFiliere], (err) => {
        if (err) throw err;
        return res.status(200).json({ success: true, message: `La filiere ${nomFiliere} supprimé avec succès.` });
      });
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la suppression.' });
  }
});
//---------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------
/*                                                                  */
/*                       Route liste Etudiants                      */
/*                                                                  */
//--------------------------------------------------------------------
//------------Enseignants
//Voir la liste des etudiant pour le module d'un enseignant
app.get('/listetudiants/:username', (req, res) => {
  const username = req.params.username;
  const donnees= `SELECT p.username as enseignant ,et.id_etudiant,et.username as n_apoge,et.password,
                  et.nom,et.prenom,s.nom as semestre,f.nom as filiere 
                  FROM etudiant et
                  JOIN professeur p ON m.id_prof = p.id_prof
                  JOIN module m ON m.id_module = e.id_module
                  JOIN enrollment e ON et.id_etudiant = e.id_etudiant
                  JOIN semestre s ON m.id_semestre = s.id_semestre
                  JOIN filiere f ON m.id_filiere = f.id_filiere
                  WHERE p.username = ? `;
  db.all(donnees, [username], (err, rows) => {
    if (err) {
      // console.error(err.message);
      res.status(500).send('Erreur du serveur.');
    }
    res.json(rows);
  });
});
//------------Responsables
//Voir la liste des étudiants pour la filiere d'un admin 
app.get('/listetudiantsfiliere/:username', (req, res) => {
  const username = req.params.username;
  const donnees= `SELECT a.nom as administrateur ,et.id_etudiant,et.username as n_apoge,et.password,
                  et.nom,et.prenom,s.nom as semestre,f.nom as filiere 
                  FROM etudiant et
                  JOIN administrateur a ON a.id_filiere = f.id_filiere
                  JOIN filiere f ON f.id_filiere = et.id_filiere
                  JOIN semestre s ON et.id_semestre = s.id_semestre
                  WHERE a.username = ? `;
  db.all(donnees, [username], (err, rows) => {
    if (err) {
      // console.error(err.message);
      res.status(500).send('Erreur du serveur.');
    }
    res.json(rows);
  });
});
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------  
//--------------------------------------------------------------------
/*                                                                  */
/*                        Route liste Modules                       */
/*                                                                  */
//--------------------------------------------------------------------
//------------Responsables
//Voir la liste des modules pour une filiere d'un administrateur
app.get('/listmodules/:username', (req, res) => {
  const username = req.params.username;
  const donnees= `SELECT m.nom as module, p.username as enseignant, s.nom as semestre, f.nom as filiere, a.nom as responsable
                  FROM module m,professeur p,semestre s,filiere f,administrateur a
                  WHERE m.id_prof=p.id_prof
                  AND a.id_filiere = m.id_filiere
                  AND a.id_filiere = p.id_filiere
                  AND s.id_semestre=m.id_semestre
                  AND f.id_filiere=a.id_filiere
                  AND a.username = ?
                  ORDER BY s.nom`;
  db.all(donnees, [username], (err, rows) => {
    if (err) {
      // console.error(err.message);
      res.status(500).send('Erreur du serveur.');
    }
    res.json(rows);
  });
});
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------  
//--------------------------------------------------------------------
/*                                                                  */
/*                      Route liste Professeurs                     */
/*                                                                  */
//--------------------------------------------------------------------
//------------Responsables
//Voir la liste des professeurs pour une filiere d'un administrateur
app.get('/listprofesseurs/:username', (req, res) => {
  const username = req.params.username;
  const donnees= `SELECT p.id_prof,p.username,p.nom as enseignant,f.nom as filiere,a.nom as responsable
                        FROM professeur p,filiere f,administrateur a
                        WHERE a.username = ?
                        AND p.id_filiere = a.id_filiere
                        AND f.id_filiere = a.id_filiere
                        ORDER BY p.id_prof`;
  db.all(donnees, [username], (err, rows) => {
    if (err) {
      res.status(500).send('Erreur du serveur.');
    }
    res.json(rows);
  });
});
//--------------------------------------------------------------------
/*                                                                  */
/*                        Route liste Filieres                      */
/*                                                                  */
//--------------------------------------------------------------------
//------------Admin Générale
app.get('/listfilieres', (req, res) => {
  const donnees= 'SELECT f.id_filiere,a.nom as administrateur,f.nom as filiere FROM administrateur a,filiere f WHERE f.id_filiere = a.id_filiere';
  db.all(donnees, [], (err, rows) => {
    if (err) {
      // console.error(err.message);
      res.status(500).send('Erreur du serveur.');
    }
    res.json(rows);
  });
});
//--------------------------------------------------------------------
/*                                                                  */
/*                        Route liste Admins                        */
/*                                                                  */
//--------------------------------------------------------------------
app.get('/listadmins', (req, res) => {
  const donnees= 'SELECT a.id_filiere,a.id_admin as id,a.nom as administrateur,f.nom as filiere FROM administrateur a,filiere f WHERE f.id_filiere = a.id_filiere';
  db.all(donnees, [], (err, rows) => {
    if (err) {
      // console.error(err.message);
      res.status(500).send('Erreur du serveur.');
    }
    res.json(rows);
  });
});
//--------------------------------------------------------------------
/*                                                                  */
/*                        Route liste Vacances                      */
/*                                                                  */
//--------------------------------------------------------------------
app.get('/listvacances', (req, res) => {
  const donnees= 'SELECT id_vacances,debut_vacances,fin_vacances,nombre_jours,title FROM vacances';
  db.all(donnees, [], (err, rows) => {
    if (err) {
      // console.error(err.message);
      res.status(500).send('Erreur du serveur.');
    }
    res.json(rows);
  });
});
//--------------------------------------------------------------------
/*                                                                  */
/*                        Route liste presence                      */
/*                                                                  */
//--------------------------------------------------------------------
//==================================================================//

// app.get('/listpresence/:apoge/:username', (req, res) => {
//   const apoge = req.params.apoge;
//   const username = req.params.username;
//   db.get('SELECT id_etudiant FROM etudiant WHERE username = ?', [apoge], (err, row) => {
//     if (err) {
//       return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
//     }
//     if (!row) {
//       return res.status(400).json({ message: 'L\'étudiant indiqué n\'a pas été trouvé.' });
//     }
//   const idEtudiant = row.id_etudiant;
//   db.get('SELECT id_prof FROM professeur WHERE username = ?', [username], (err) => {
//     if (err) {
//       return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
//     }
//   const idProf = row.id_prof;
//   db.get('SELECT id_module FROM module WHERE id_prof = ?', [idProf], (err) => {
//     if (err) {
//       return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
//     }
//   const idModule = row.id_module;
//   db.get('SELECT id_enrollment FROM enrollment WHERE id_etudiant = ? AND id_module = ?', [idEtudiant,idModule], (err, row) => {
//     if (err) {
//       return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
//     }
//     if (!row) {
//       return res.status(400).json({ message: 'L\'étudiant indiqué n\'a aucune inscription.' });
//     }
//   const idEnrollment = row.id_enrollment;
  
//   const donnees= 'SELECT a.id_attendance,s.type,a.date_attendance,a.present FROM attendance a, seance s WHERE a.id_enrollment = ? AND a.id_code = s.id_code';
//   db.all(donnees, [idEnrollment], (err, rows) => {
//     if (err) {
//       // console.error(err.message);
//       res.status(500).send('Erreur du serveur.');
//     }
//     res.json(rows);
//   });
//   });
// });
// });
// });
// });
//****************************************************************************************** */
/*-----------------------------------------------------------------------/*
/*      liste des seances d'un enseignat  PROFESSEUR
/*-----------------------------------------------------------------------*/
app.get('/listseanses/:username', (req, res) => {
  //username de professeur
  const username = req.params.username;
  const query = `
  SELECT m.nom as module,s.id_seance ,s.date_seance,s.heure_debut ,s.heure_fin , s.type,s.salle , s.numero_semaine
  FROM seance s
  JOIN module m ON m.id_module = s.id_module
  JOIN professeur p ON m.id_prof = p.id_prof
  WHERE p.username = "prof1"
  ORDER BY s.numero_semaine
  `;

  db.all(query, [username], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
    }
    if (!rows) {
      return res.status(400).json({ message: 'Aucune seance trouvée pour le professeur indiqué.' });
    }
    res.json(rows);
  });
});
/*-----------------------------------------------------------------------/*
/*             liste des presence des etudiants d'un seance
/*-----------------------------------------------------------------------*/
//dans la liste des seances pour un enseignant , choisi une date /key de table des resultat pour voir la liste suivant
app.get('/listpresenceseanse/:id_seance/:username', (req, res) => {
  const idSeance = req.params.id_seance;
  //username de professeur
  const username = req.params.username;
  const query = `
    SELECT a.id_attendance, s.type, a.date_attendance, et.username, a.present
    FROM attendance a
    JOIN seance s ON a.id_code = s.id_code
    JOIN etudiant et ON et.id_etudiant = e.id_etudiant
    JOIN module m ON m.id_module = e.id_module
    JOIN enrollment e ON a.id_enrollment = e.id_enrollment
    JOIN professeur p ON m.id_prof = p.id_prof
    WHERE s.id_seance = ? AND p.username = ?
  `;

  db.all(query, [idSeance, username], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
    }
    if (!rows) {
      return res.status(400).json({ message: 'Aucune présence trouvée pour la seance indiqué.' });
    }
    res.json(rows);
  });
});
/*
 **Professeur :
  *liste des presences d'un etudiant choisi (un seul module pour chaque enseignat)*/
app.get('/listpresence/:apoge/:username', (req, res) => {
  const apoge = req.params.apoge;
  const username = req.params.username;//De prof
  const query = `
  SELECT et.nom as etudiant,m.nom as module, a.id_attendance, s.type, a.date_attendance, a.present
  FROM attendance a
  JOIN seance s ON a.id_code = s.id_code
  JOIN module m ON m.id_module = e.id_module
  JOIN enrollment e ON a.id_enrollment = e.id_enrollment
  JOIN etudiant et ON e.id_etudiant = et.id_etudiant
  JOIN professeur p ON m.id_prof = p.id_prof
    WHERE et.username = ? AND p.username = ?
  `;

  db.all(query, [apoge, username], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
    }
    if (!rows) {
      return res.status(400).json({ message: 'Aucune présence trouvée pour l\'étudiant indiqué.' });
    }
    res.json(rows);
  });
});
/*
 **Etudiant :
  *liste des presence d'un etudiant pour un module choisi*/
 app.get('/listpresencetud/:selectedKeyword/:username', (req, res) => {
  const nomModule = req.params.selectedKeyword;
  const username = req.params.username;
  const query = `
    SELECT a.id_attendance,m.nom as module, s.type, p.nom as enseignant, a.date_attendance, a.time_attendance, a.present
    FROM attendance a
    JOIN seance s ON a.id_code = s.id_code
    JOIN professeur p ON p.id_prof = m.id_prof
    JOIN module m ON m.id_module = e.id_module
    JOIN enrollment e ON a.id_enrollment = e.id_enrollment
    JOIN etudiant et ON e.id_etudiant = et.id_etudiant
    WHERE et.username = ? AND m.nom = ?
  `;

  db.all(query, [username,nomModule], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
    }
    if (!rows) {
      return res.status(400).json({ message: 'Aucune présence trouvée pour le module indiqué.' });
    }
    res.json(rows);
  });
});
/*
 **Admin Général :
  *liste des seances a ont un count de presence null*/
 app.get('/listcountpresenceseanse', (req, res) => {
  //username de professeur
  const query = `SELECT a.id_code AS idSeance,s.type,s.date_seance,s.heure_debut,s.heure_fin,m.nom AS module,p.nom AS enseignent
    FROM attendance a,seance s,module m,professeur p
    WHERE a.id_code=s.id_code AND s.id_module = m.id_module AND p.id_prof = m.id_prof AND a.id_code NOT IN (
      SELECT id_code
      FROM attendance
      WHERE present = 'présent'
    )
    GROUP BY a.id_code
  `;

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
    }
    if (!rows) {
      return res.status(400).json({ message: 'Aucune seance trouvée pour un COUNT de présence null.' });
    }
    res.json(rows);
  });
});
app.post('/SuprSeance', async (req, res) => {
  try {
    const {idSeance} = req.body;
      const deleteSeanceQuery = 'DELETE FROM seance WHERE id_seance = ?';
      db.run(deleteSeanceQuery,[idSeance], (err) => {
        if (err) throw err;
      const deleteQrcodeQuery = 'DELETE FROM qrcodes WHERE id_seance = ?';
      db.run(deleteQrcodeQuery,[idSeance], (err) => {
        if (err) throw err;
        const deletePresenceQuery = 'DELETE FROM attendance WHERE id_code = ?';
        db.run(deletePresenceQuery,[idSeance], (err) => {
          if (err) throw err;
          return res.status(200).json({ success: true, message: `La seance et leur Qr Code supprimé avec succès supprimé et vider les absences.` });
        });
      });
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la suppression.' });
  }
});
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------  
//--------------------------------------------------------------------
/*                                                                  */
/*                       Route Ajoute Enrollment                    */
/*                                                                  */
//--------------------------------------------------------------------
app.post('/AjoutEnrollment', async (req, res) => {
  const {apoge,module} = req.body;
  if ( !apoge || !module ) {
    return res.status(400).json({ success: false, message: 'Veuillez fournir toutes les informations requises.' });
  }
    const { idFiliere } = req.body;
    // try {
    //   const admin = db.all('SELECT * FROM administrateur a,etudiant e,module m WHERE e.username = ? AND m.nom = ? AND m.id_filiere = e.id_filiere AND a.id_filiere = e.id_filiere AND m.id_filiere = a.id_filiere AND a.id_filiere = ?', [apoge,module,idFiliere]);
    //   if (!admin) {
    //     return res.status(403).json({ success: false, message: 'You are not authorized to add enrollment for the etudiant or the module indique' });
    //   }
    // } catch (error) {
    //   console.error(error);
    //   return res.status(500).json({ success: false, message: 'An error occurred. Please try again later.' });
    // }
    // Verifie c'est le module / etudiant existe
  db.get('SELECT id_module FROM module WHERE nom = ? AND id_filiere = ?', [module,idFiliere], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
      
    }
    if (!row) {
      return res.status(400).json({ message: 'Le module indiqué n\'a pas été trouvé ou vous étes pas autorisé à faire cette operation pour ce module.' });
    }
  const idModule = row.id_module;

  db.get('SELECT id_etudiant,nom FROM etudiant WHERE username = ? AND id_filiere = ?', [apoge,idFiliere], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
    }
    if (!row) {
      return res.status(400).json({ message: 'L\'etudiant indiqué n\'a pas été trouvé ou vous étes pas autorisé à faire cette operation pour ce l\'etudiant.' });
    }
  const nom = row.nom;
  const idEtudiant = row.id_etudiant;
  const idEnrollment = parseInt(`${idModule}${idEtudiant}`);

    // Insérer la nouvelle inscription de l'etudiant dans la base de données :
    const insertEtudQuery = 'INSERT INTO enrollment (id_enrollment,id_etudiant,id_module) VALUES (?,?,?)';
    db.run(insertEtudQuery, [idEnrollment,idEtudiant,idModule], function(err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ success: false, message: 'Failed' });
      }
      console.log(`A new inscription in this module ${module} for the student ${nom}.`);
      return res.status(200).json({ success: true, message: `Une nouvelle inscription dans le module "${module}" pour l'étudiant "${nom}".` });
    }); 
  });
  });
});
//--------------------------------------------------------------------
/*                                                                  */
/*                       Route Supprimer Enrollment                 */
/*                                                                  */
//--------------------------------------------------------------------
app.post('/SuprEnrollment', async (req, res) => {
  try {
    const {apoge,module} = req.body;
    if ( !apoge || !module ) {
      return res.status(400).json({ success: false, message: 'Veuillez fournir toutes les informations requises.' });
    }
    const { idFiliere } = req.body;
    db.get('SELECT id_module FROM module WHERE nom = ? AND id_filiere = ?', [module,idFiliere], (err, row) => {
      if (err) {
        return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
        
      }
      if (!row) {
        return res.status(400).json({ message: 'Le module indiqué n\'a pas été trouvé ou vous étes pas autorisé à faire cette operation pour ce module.' });
      }
    const idModule = row.id_module;

    db.get('SELECT id_etudiant,nom FROM etudiant WHERE username = ? AND id_filiere = ?', [apoge,idFiliere], (err, row) => {
      if (err) {
        return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
      }
      if (!row) {
        return res.status(400).json({ message: 'L\'etudiant indiqué n\'a pas été trouvé ou vous étes pas autorisé à faire cette operation pour l\'etudiant indiqué.' });
      }
    const nom = row.nom;
    const idEtudiant = row.id_etudiant;
    //=>
    const  idEnrollment = parseInt(`${idModule}${idEtudiant}`);

      // Delete
      const deleteQuery = 'DELETE FROM enrollment WHERE id_enrollment = ? ';
      db.run(deleteQuery, [idEnrollment], (err) => {
        if (err) throw err;
        // console.log(`Module ${module} has been deleted.`);
        return res.status(200).json({ success: true, message: `L\'enrollment de l\'etudiant ${nom} pour le module ${module} a été supprimé avec succès.` });
      });
    });
  });
  } catch (err) {
    // console.error(err.message);
    return res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la suppression.' });
  }
});
/* Reset enrollment d'un etudiant */
app.post('/ResetEnrollment', async (req, res) => {
  try {
    const {apoge} = req.body;
    if ( !apoge ) {
      return res.status(400).json({ success: false, message: 'Veuillez fournir toutes les informations requises.' });
    }
    const { idFiliere } = req.body;

    db.get('SELECT id_etudiant,nom FROM etudiant WHERE username = ? AND id_filiere = ?', [apoge,idFiliere], (err, row) => {
      if (err) {
        return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
      }
      if (!row) {
        return res.status(400).json({ message: 'L\'etudiant indiqué n\'a pas été trouvé ou vous étes pas autorisé à faire cette operation pour l\'etudiant indiqué.' });
      }
    const nom = row.nom;
    const idEtudiant = row.id_etudiant;

      // Delete
      const deleteQuery = 'DELETE FROM enrollment WHERE id_etudiant = ? ';
      db.run(deleteQuery, [idEtudiant], (err) => {
        if (err) throw err;
        // console.log(`Module ${module} has been deleted.`);
        return res.status(200).json({ success: true, message: `L\'enrollments de l\'etudiant ${nom} ont été supprimé avec succès.` });
      });
    });
  } catch (err) {
    // console.error(err.message);
    return res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la suppression.' });
  }
});
//--------------------------------------------------------------------
/*                                                                  */
/*                       Route Enregistrer Presence                 */
/*                       Route Rechercher Modules                   */
//--------------------------------------------------------------------
/* Recupere id_seance actuelle et Verifier le code scanner si equivalent 
   au codeqr de cette seance a partir de la table qrcodes et enregistrer 
   la presence dans la table attendance  */
  
/*----------------------------------------------------------------------

ENREGISTRER La presence d'un etudiant au seance  :
TABLE attendance etudiant module qrcodes seance  
        -----------------------------------------------------
etudiant 1: avec username = ? (2001663) => id_etudiant = ? (1) 
AND id_seance = ? (30161) AND module = ?=> id_code = ? (30161) 
AND id_module = ? (161) AND id_etudiant = ? (1)
Resultat :

     id_enrollment               id_code
(etudiant 1 inscrit au php) ||  (seance 3 du cours de module php)
      1(+)161                     30161
-> Validé le scan => present = "present" AND date AND time
-> Non Validé le scan (apres la seance)=> present = "Absent"

----------------------------------------------------------------------*/
app.post('/operationsEtudiant', async (req, res) => {
  try {
    // Username de l'étudiant
    const { username } = req.body;
    // Résultat du scan sous forme de chaîne
    const { data } = req.body;

    // Vérifier que les données d'entrée sont valides
    if (!data) {
      return res.status(400).json({ message: 'Mauvaise scan, veuillez réessayer à nouveau.' });
    }
    if (typeof data !== 'string') {
      return res.status(400).json({ message: 'Les données fournies sont invalides.' });
    }

    // Récupérer l'id de la séance actuelle
    const query = `
      SELECT s.id_seance, s.id_module, s.date_seance
      FROM seance s, module m, professeur p, enrollment e, etudiant et
      WHERE e.id_etudiant = et.id_etudiant
      AND e.id_module = m.id_module
      AND s.id_module = m.id_module
      AND p.id_prof = m.id_prof
      AND et.username = ?
      AND s.date_seance = date('now')
      AND s.heure_debut <= time('now')
      AND s.heure_fin >= time('now')
    `;

    db.get(query, [username], (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
      }

      if (!row) {
        return res.status(400).json({ message: 'Aucune séance trouvée à cette période.' });
      }

      const date_seance = row.date_seance;
      const idModule = row.id_module;
      const idSeance = row.id_seance;
      const idCode = idSeance;
      const date_attendance = date_seance;

      // Récupérer l'id de l'étudiant à partir du nom d'utilisateur
      db.get('SELECT id_etudiant FROM etudiant WHERE username = ?', [username], (err, row) => {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
        }

        const idEtudiant = row.id_etudiant;

        // Récupérer l'id d'enregistrement (id_enrollment)
        const sql = `
          SELECT id_enrollment
          FROM enrollment
          WHERE id_etudiant = ? AND id_module = ?
        `;

        db.get(sql, [idEtudiant, idModule], (err, row) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
          }

          const idEnrollment = row.id_enrollment;

          const Query = `
          SELECT *
          FROM qrcodes
          WHERE id_code = ? AND qr_code = ?
        `;
          db.get(Query, [idCode,data], (err, row) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
          }
          let present ;
          if (row) {
            present = 'présent';
          }
          // %une fois il scan un code qr incorrect passe absent% => let present = 'absent'; // Par défaut, l'étudiant est considéré comme absent
          if (!row) {
            return res.status(400).json({ message: 'Code incorrect.' });
          }

          // Heure actuelle
          const now = new Date();
          const hours = now.getHours();
          const minutes = now.getMinutes();
          const seconds = now.getSeconds();
          const time_attendance = `${hours}:${minutes}:${seconds}`;
                //====================================
                  // Condition de vérification si deja scanner 
                  const checkAttendanceQuery = `
                  SELECT COUNT(*) AS count
                  FROM attendance
                  WHERE id_enrollment = ? AND id_code = ?
                  `;

                  db.get(checkAttendanceQuery,[idEnrollment,idCode], (err, row) => {
                  if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
                  }

                  if (row.count > 0) {
                    return res.status(400).json({ message: 'Vous êtes déjà enregistrer la presence pour cette seance.' });
                  }
                //====================================

            // Récupérer la valeur maximale actuelle de id_attendance
            const getMaxIdQuery = 'SELECT MAX(id_attendance) AS maxId FROM attendance';
            db.get(getMaxIdQuery, (err, row) => {
              if (err) {
                console.error(err.message);
                return res.status(500).json({ success: false, message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
              }

              // Générer une nouvelle valeur unique pour id_attendance
              const idAttendance = row.maxId ? row.maxId + 1 : 1;


              // Enregistrer la présence de l'étudiant
              const VALUES = [idAttendance, idEnrollment, idCode, date_attendance, time_attendance, present];
              const Query = `INSERT INTO attendance (id_attendance, id_enrollment, id_code, date_attendance, time_attendance, present) VALUES (?, ?, ?, ?, ?, ?)`;

              db.run(Query, VALUES, function (err) {
                if (err) {
                  console.error(err.message);
                  return res.status(500).json({ success: false, message: 'Erreur lors de l\'enregistrement de la présence.' });
                }

                // Ajouter les informations du code QR à la réponse
                const response = {
                  success: true,
                  message: 'La présence en séance a été enregistrée avec succès !',
                };
                return res.status(200).json(response);
              });
            });
          });
        });
      });
    });
  });
} catch (error) {
  console.error(error);
  return res.status(500).json({ success: false, message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
}
});

// select m.nom from module m,etudiant et,enrollment e where et.id_etudiant = e.id_etudiant and m.id_module = e.id_
// module and et.username = ? ;
app.get('/getKeywords/:username', (req, res) => {
  const username = req.params.username;
  db.all('SELECT m.nom FROM module m,etudiant et,enrollment e WHERE et.id_etudiant = e.id_etudiant AND m.id_module = e.id_module AND et.username = ?', [username], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Erreur du serveur.');
    }
    const keywords = rows.map(row => row.nom);
    res.json({ keywords });
  });
});
//----------------------
// SELECT f.nom FROM filiere f,etudiant et WHERE et.id_filiere = f.id_filiere AND et.username = ?
app.get('/getKeywordsFilieres', (req, res) => {
  db.all('SELECT f.nom FROM filiere f', [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Erreur du serveur.');
    }
    const keywords = rows.map(row => row.nom);
    res.json({ keywords });
  });
});
//======================================================
//------------------------------------------------------
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//======================================================

// le prof fermer la seance et enregistrer les absences
app.post('/fermerSeance', async (req, res) => {
  try {
    const { username } = req.body;

      // Récupérer les informations de la séance en cours du professeur
      const seanceQuery = `
        SELECT s.id_seance, s.id_module, s.date_seance, s.heure_fin
        FROM seance s, module m, professeur p
        WHERE s.id_module = m.id_module
        AND p.id_prof = m.id_prof
        AND p.username = ?
        AND s.date_seance = date('now')
        AND s.heure_debut <= time('now')
      `;

      db.get(seanceQuery, [username], (err, row) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
        }

        if (!row) {
          return res.status(400).json({ message: 'Aucune séance trouvée pour le professeur en cours.' });
        }

        const { id_seance, id_module, date_seance, heure_fin } = row;
        const idCode = id_seance;

        // Heure actuelle
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const heure_actuelle = `${hours}:${minutes}:${seconds}`;
        if (heure_fin > heure_actuelle) {
          return res.status(400).json({ message: 'L\'heure de la séance n\'est pas encore terminée.' });
        }
        // Récupérer tous les étudiants inscrits au module du professeur
        const studentsQuery = `
          SELECT e.id_etudiant, e.id_enrollment
          FROM enrollment e
          WHERE e.id_module = ?
        `;

        db.all(studentsQuery, [id_module], (err, rows) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
          }
          // Vérifier la présence de chaque étudiant
          rows.forEach((row) => {
          //   const idEtudiant = row.id_etudiant;
            const idEnrollment = row.id_enrollment;
                       
            // Récupérer la valeur maximale actuelle de id_attendance
            const getMaxIdQuery = 'SELECT MAX(id_attendance) AS maxId FROM attendance';
            db.get(getMaxIdQuery, (err, row) => {
            if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false, message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
            }
            // Générer une nouvelle valeur unique pour id_attendance
            const idAttendance = row.maxId ? row.maxId + 1 : 1;
                  
            // Vérifier si l'étudiant(id_enrollment) est déjà enregistré comme présent dans la seance(id_code)
            const presentQuery = `
              SELECT 1
              FROM attendance
              WHERE id_enrollment = ? AND id_code = ?
            `;

            db.get(presentQuery, [idEnrollment,idCode], (err, row) => {
              if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
              }

              if (!row) {
                // L'étudiant est absent, enregistrer l'absence dans la table
                const absentQuery = `
                  INSERT INTO attendance (id_attendance, id_enrollment, id_code, date_attendance, time_attendance, present)
                  VALUES (?, ?, ?, ?, ?, 'absent')
                `;

                db.run(absentQuery, [idAttendance, idEnrollment, idCode, date_seance, heure_actuelle], (err) => {
                  if (err) {
                    console.error(err);
                    return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
                  }
                });
              }
            });
          });
        });
          return res.status(200).json({ message: 'Les absences ont été enregistrées avec succès.' });
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.' });
  }
});

//--------------------------------------------------------------------
/*                                                                  */
/*                          Route Attendances                       */
/*                                                                  */
//--------------------------------------------------------------------
/* Reset attendance des etudiants (à l'afin d'année) , cette option pour l'admin général*/
app.post('/ResetAttandance', async (res) => {
  try {
      // Delete
      const deleteQuery = 'DELETE FROM enrollment';
      db.run(deleteQuery, [], (err) => {
        if (err) throw err;
        return res.status(200).json({ success: true, message: `Les attendances ont été supprimé avec succès.` });
      });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la suppression.' });
  }
});
//--------------------------------------------------------------------
/*                                                                  */
/*                  Route ADD Sance & Generate QRcode               */
/*                                                                  */
//--------------------------------------------------------------------
/* Ajouter une seance dans la table seance et enregistrer le code QR dans la table qrcodes */

app.post('/operationsProfesseur',  async (req, res) => {
  try {
    const { username } = req.body;
    const { type, heure_debut } = req.body;
    let { salle } = req.body;

    // Vérifier que les données d'entrée sont valides
    if ( !type || !heure_debut ) {
      return res.status(400).json({ message: 'Veuillez fournir toutes les informations requises.' });
    }
    if ( !salle ){
      salle = 'Aucune';
    }
    if ( typeof type !== 'string' ) {
      return res.status(400).json({ message: 'Les données fournies sont invalides.' });
    }
    if ( !/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/.test(heure_debut) ) {
      return res.status(400).json({ message: 'L\'heure est au format de temps invalide.' });
    }


  /* Condition de date de seance differente avec la date des vacances */
      const formattedDate = new Date();
      console.log(`Date: ${formattedDate}`);
      // Date: Sat Jul 15 2023 13:21:33 GMT+0100 (UTC+01:00)
      const date_seance = `${formattedDate.getFullYear()}-${(formattedDate.getMonth() + 1).toString().padStart(2, '0')}-${formattedDate.getDate().toString().padStart(2, '0')}`;
      console.log(`Date: ${date_seance}`);
      // Date: 2023-07-15
      const query = `
        SELECT COUNT(*) AS count
        FROM vacances
        WHERE ? BETWEEN debut_vacances AND fin_vacances
        `;
      db.get(query, [date_seance], (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.1' });
      }
      if (row.count > 0) {
        return res.status(400).json({ message: 'La date de la séance se trouve pendant une période de vacances.' });
      }

    /* condition de autorisation de professeur          */ 
     // Get the id_prof of the given username:
      db.get('SELECT id_prof FROM professeur WHERE username = ?', [username], (err, row) => {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.2' });
        }
        if (!row) {
          return res.status(400).json({ message: 'Le professeur indiqué n\'a pas été trouvé.' });
        }
      const idProf = row.id_prof;
    // Get the id_module of the given module:
      db.get('SELECT id_module,m.nom FROM module m,professeur p WHERE p.id_prof = ? AND p.id_prof = m.id_prof', [idProf], (err, row) => {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.3' });
        }
        if (!row) {
          return res.status(400).json({ message: 'Vous n\'êtes pas autorisé(e) à ajouter des séances pour ce module.' });
        }
      const idModule = row.id_module;
      const module = row.nom;
      
      // Récupérer la valeur maximale actuelle de numero_semaine
      const getMaxNBQuery = 'SELECT MAX(numero_semaine) AS maxNB FROM seance WHERE id_module = ? AND type = ?';
      db.get(getMaxNBQuery,[idModule,type] , (err, row) => {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ success: false, message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.4' });
        }

        // Générer une nouvelle valeur unique pour id_attendance
        const numero_semaine = row.maxNB ? row.maxNB + 1 : 1;
     //====================================
  // Get the id of the given type:
  let idSeance;
  let id;
        if (type == "cours") {
          id = 0;
          idSeance = parseInt(`${numero_semaine}${id}${idModule}`);
        }
        else if (type == "TD") {
          id = 1;
          idSeance = parseInt(`${numero_semaine}${id}${idModule}`);
        }
        else if (type == "TP") {
          id = 2;
          idSeance = parseInt(`${numero_semaine}${id}${idModule}`);
        }
        
        // Combiner les ids pour obtenir l'id_seance :
        // const idSeance = `${numero_semaine}_${id}_${idModule}`;
        const idCode = idSeance;
        
        
        // Convertir heure_debut en objet Date
const heureDebutObj = new Date();
const [heure, minute] = heure_debut.split(':');
heureDebutObj.setHours(parseInt(heure, 10));
heureDebutObj.setMinutes(parseInt(minute, 10));

// Ajouter 1 heure et 30 minutes à heureDebutObj
const heureFinObj = new Date(heureDebutObj.getTime() + 1 * 60 * 60 * 1000 + 30 * 60 * 1000);

// Extraire l'heure et les minutes de heureFinObj
const heureFin = heureFinObj.getHours();
const minuteFin = heureFinObj.getMinutes();

// Créer la variable heure_fin
const heure_fin = `${heureFin.toString().padStart(2, '0')}:${minuteFin.toString().padStart(2, '0')}`;

// Utiliser heure_fin comme nécessaire
console.log(`heure_fin: ${heure_fin}`);

  // Effectuer la requête SQL pour ajouter une nouvelle ligne dans la table "seace"
  const VALUES = [idSeance,type,date_seance,heure_debut,heure_fin,idModule,idCode,numero_semaine,salle];
  const Query = `INSERT INTO seance (id_seance, type, date_seance, heure_debut, heure_fin, id_module, id_code, numero_semaine, salle) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.run(Query, VALUES, function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({success: false, message: 'Erreur lors de l\'ajout du seance à la base de données.'});
    }
    //=====================================================================
      //---- Generer Code Qr pour cette seance => qrcode = "text"
            // Définir les valeurs pour la nouvelle ligne dans la table "qrcodes"
      const qrCode = `seance_${idSeance}_code_${idCode}_${type}_${module}`;
      const values = [idCode, idSeance, qrCode];
    // Vérifier que les données d'entrée sont valides
    if ( typeof qrCode !== 'string' || typeof idSeance !== 'number') {
      return res.status(400).json({ message: 'Les données fournies sont invalides 2' });
    }
    // Effectuer la requête SQL pour ajouter une nouvelle ligne dans la table "qrcodes"
    const sql = `INSERT INTO qrcodes (id_code, id_seance, qr_code) VALUES (?, ?, ?)`;
    db.run(sql, values, function(err) {
    if (err) {
      // console.error(err.message);
      return res.status(500).json({ success: false, message: 'Erreur lors de la génération du code QR.'});
    }
    // Add the QR code information to the response
    const response = {
    success: true,
    message: 'La séance a été ajoutée avec succès à la base de données et son code QR a été généré !',
    // qrCodeImagePath: qrCodeImagePath, // Include the path or URL to the QR code image
    qrCode: qrCode, // Include the qrCode value in the response
  };
  console.log("La séance a été ajouté avec succès à la base de données ,Le code QR a été ajouté avec succès à la base de données !");
    return res.status(200).json(response);
    });
    });
  });
  });
});
});
  } catch (error) {
       console.error(error);
      return res.status(500).json({ success: false, message: 'Une erreur s\'est produite. Veuillez réessayer plus tard.5' });
   }
});
//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------  
//--------------------------------------------------------------------
/*                                                                  */
/*                             Informations                         */
/*                                                                  */
//--------------------------------------------------------------------
app.get('/donneesetud/:username', (req, res) => {
  const username = req.params.username;
  db.all('SELECT e.id_etudiant,e.username as numero_apoge,e.nom,e.prenom,s.nom as semestre,f.nom as filiere FROM etudiant e,semestre s,filiere f WHERE username = ? AND s.id_semestre = e.id_semestre AND f.id_filiere = e.id_filiere', [username], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erreur du serveur.');
    }
    res.json(rows);
  });
});
//------------------------------------------------------------------
app.get('/donneesadmin/:username', (req, res) => {
const username = req.params.username;
db.all('SELECT a.id_admin,a.nom,a.username,a.password,f.nom as filiere,f.id_filiere FROM administrateur a,filiere f WHERE username = ? AND a.id_filiere=f.id_filiere', [username], (err, rows) => {
  if (err) {
    // console.error(err.message);
    res.status(500).send('Erreur du serveur.');
  }
  res.json(rows);
});
});
app.get('/filiereadmin', (req, res) => {
const username = req.params.username;
db.all('SELECT f.nom AS nomFiliere FROM filiere f,administrateur a WHERE a.username = ? AND a.id_filiere = f.id_filiere', [username], (err, rows) => {
  if (err) {
    console.error(err.message);
    res.status(500).send('Erreur du serveur.');
  }
  res.json(rows);
});
});
//-----------------------------------------------------------------
app.get('/donneesprof/:username', (req, res) => {
const username = req.params.username;
db.all('SELECT p.id_prof,p.username,p.password,f.nom as filiere FROM professeur p,filiere f WHERE username = ? AND p.id_filiere=f.id_filiere', [username], (err, rows) => {
  if (err) {
    // console.error(err.message);
    res.status(500).send('Erreur du serveur.');
  }
  res.json(rows);
});
});
//=====================================================================================
//=====================================================================================
/*
app.get('/id', (req, res) => {
  const { username } = req.body;
  db.get('SELECT id_etudiant FROM etudiant WHERE username =?', [username], 
  (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erreur du serveur.');
    }
    res.json(rows);
  });
});
app.get('/idetudiant', (req, res) => {
  db.all('SELECT * FROM etudiant', [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erreur du serveur.');
    }
    res.json(rows);
  });
});
*/
//--------------------------------------------------------------------
/*                                                                  */
/*                           Route seance                           */
/*                                                                  */
//--------------------------------------------------------------------
app.get('/seance/:username', (req, res) => {
  const username = req.params.username;
  if (isNaN(username) || username === '') {  /* Cette condition vérifie si l'ID de l'étudiant est valide. Si l'ID n'est pas un nombre ou est vide, une réponse 
       d'erreur est renvoyée avec le code HTTP 400 (mauvaise requête).*/
    return res.status(400).json({ error: 'L\'ID de l\'étudiant est invalide' });
  }
// Cette ligne exécute une requête SELECT sur la base de données SQLite pour récupérer les détails de la séance en cours pour l'étudiant connecté. La requête utilise des 
// jointures pour récupérer les informations sur l'étudiant, le module, le professeur et l'inscription, ainsi que des conditions pour filtrer les séances qui ont lieu 
// aujourd'hui et qui sont en cours. Les résultats sont renvoyés sous forme de tableau d'objets dans la variable rows.
  db.all(`SELECT et.nom as nom, s.date_seance, s.heure_debut, s.heure_fin, m.nom as module, s.type as type_seance, p.nom as enseignant, s.salle as salle, s.id_seance
     FROM seance s, module m, professeur p, enrollment e, etudiant et
     WHERE e.id_etudiant=et.id_etudiant
     AND e.id_module=m.id_module
     AND s.id_module=m.id_module
     AND p.id_prof=m.id_prof
     AND et.username = ?
     AND s.date_seance = date('now')
     AND s.heure_debut <= time('now')
     AND s.heure_fin >= time('now')`,
    [username],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
      res.json( rows );
    });
});
//-----------------------------------------------------------------------
/*                                                                     */
/*                             Statistiques                            */
/*                                                                     */
//-----------------------------------------------------------------------
//---------------------------ADMINS
//nombre d' admins
app.get('/nbradmins', (req, res) => {
  db.all('SELECT COUNT(*) AS nombre_admins FROM administrateur', [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erreur du serveur.');
    }
    res.json(rows);
  });
});
//nombre d'etudians
app.get('/nbretud', (req, res) => {
  db.all('SELECT COUNT(*) AS nombre_etudiants FROM etudiant', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erreur du serveur.');
    }
    res.json(rows);
  });
});
//nombre des professeurs
app.get('/nbrprofs', (req, res) => {
  db.all('SELECT COUNT(*) AS nombre_enseignants FROM professeur', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erreur du serveur.');
    }
    res.json(rows);
  });
});
//nombre des professeurs dans une filiere
app.get('/nbrprofs/:username', (req, res) => {
  const username = req.params.username;
  db.all('SELECT COUNT(p.id_prof) AS nombre_enseignants_au_filiere FROM professeur p,administrateur a WHERE a.id_filiere = p.id_filiere AND a.username = ?', [username], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erreur du serveur.');
    }
    res.json(rows);
  });
});
//nombre d' etudiants dans une filiere
app.get('/nbretudfiliere/:username', (req, res) => {
  const username = req.params.username;
  db.all('SELECT COUNT(et.id_etudiant) AS nombre_etudiants_au_filiere FROM etudiant et, administrateur a WHERE a.username = ? AND a.id_filiere = et.id_filiere', [username], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erreur du serveur.');
    }
    res.json(rows);
  });
});
//nombre d' etudiants dans un semestre
app.get('/nbretudsemestre/:username', (req, res) => {
  const username = req.params.username;
  db.all('SELECT s.nom,COUNT(et.id_etudiant) AS nombre_etudiants_au_semestre FROM etudiant et, semestre s, administrateur a WHERE a.username = ? AND et.id_semestre = s.id_semestre AND a.id_filiere = et.id_filiere GROUP BY s.nom', [username], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erreur du serveur.');
    }
    res.json(rows);
  });
});
//---------------------------ETUDIANTS

//---------------------------ENSEIGNANTS
//nombre d' etudiants dans un module (enrollment)
app.get('/nbretudmodule/:username', (req, res) => {
  const username = req.params.username;
  db.all('SELECT COUNT(e.id_enrollment) AS nombre_etudiants_au_module FROM professeur p,enrollment e,module m WHERE p.id_prof = m.id_prof AND m.id_module = e.id_module AND p.username = ?', [username], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erreur du serveur.');
    }
    res.json(rows);
  });
});
//nombre des presences dans une seance 
app.get('/nbrpresseance/:username/:date_seance', (req, res) => {
  const username = req.params.username;
  const date_seance = req.params.date_seance;
  db.all('SELECT COUNT(a.id_attendance) AS nombre_presences_au_seance FROM attendance a,professeur p,enrollment e,module m,seance s WHERE p.id_prof = m.id_prof AND m.id_module = e.id_module AND e.id_enrollment = a.id_enrollment AND s.id_module = m.id_module AND a.id_code = s.id_seance AND p.username = ? AND s.date_seance = ? AND a.present = "présent"', [username,date_seance], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erreur du serveur.');
    }
    res.json(rows);
  });
});
//nombre d'absences dans une seance
app.get('/nbrabsseance/:username/:date_seance', (req, res) => {
  const username = req.params.username;
  const date_seance = req.params.date_seance;
  db.all('SELECT COUNT(a.id_attendance) AS nombre_presences_au_seance FROM attendance a,professeur p,enrollment e,module m,seance s WHERE p.id_prof = m.id_prof AND m.id_module = e.id_module AND e.id_enrollment = a.id_enrollment AND s.id_module = m.id_module AND a.id_code = s.id_seance AND p.username = ? AND s.date_seance = ? AND a.present = "absent"', [username,date_seance], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erreur du serveur.');
    }
    res.json(rows);
  });
});
// Moyenne des présences pour une séance d'un module
app.get('/moyennepreseancemodule/:username/:date_seance', (req, res) => {
  const username = req.params.username;
  const date_seance = req.params.date_seance;
  // Requête pour obtenir le nombre d'étudiants dans le module
  db.get('SELECT COUNT(DISTINCT e.id_enrollment) AS nombre_etudiants FROM professeur p,enrollment e,module m WHERE p.id_prof = m.id_prof AND m.id_module = e.id_module AND p.username = ?', [username], (err, result) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erreur du serveur.');
      return;
    }

    const nombreEtudiants = result.nombre_etudiants;
    // Requête pour obtenir le nombre de présences lors de la séance
    db.get('SELECT COUNT(*) AS nombre_presences FROM attendance a,professeur p,enrollment e,module m,seance s WHERE p.id_prof = m.id_prof AND m.id_module = e.id_module AND e.id_enrollment = a.id_enrollment AND s.id_module = m.id_module AND a.id_code = s.id_seance AND p.username = ? AND s.date_seance = ? AND a.present = "présent"', [username,date_seance], (err, result) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Erreur du serveur.');
        return;
      }

      const nombrePresences = result.nombre_presences;

      // Calcul de la moyenne des étudiants présents
      const moyennePresences = nombrePresences / nombreEtudiants;

      res.json({ moyenne_presences: moyennePresences });
    });
  });
});
// Moyenne des absences pour une séance d'un module
app.get('/moyenneabseancemodule/:username/:date_seance', (req, res) => {
  const username = req.params.username;
  const date_seance = req.params.date_seance;
  // Requête pour obtenir le nombre d'étudiants dans le module
  db.get('SELECT COUNT(DISTINCT e.id_enrollment) AS nombre_etudiants FROM professeur p,enrollment e,module m WHERE p.id_prof = m.id_prof AND m.id_module = e.id_module AND p.username = ?', [username], (err, result) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erreur du serveur.');
      return;
    }

    const nombreEtudiants = result.nombre_etudiants;
    // Requête pour obtenir le nombre de absences lors de la séance
    db.get('SELECT COUNT(*) AS nombre_absences FROM attendance a,professeur p,enrollment e,module m,seance s WHERE p.id_prof = m.id_prof AND m.id_module = e.id_module AND e.id_enrollment = a.id_enrollment AND s.id_module = m.id_module AND a.id_code = s.id_seance AND p.username = ? AND s.date_seance = ? AND a.present = "absent"', [username,date_seance], (err, result) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Erreur du serveur.');
        return;
      }

      const nombreAbsences = result.nombre_absences;

      // Calcul de la moyenne des étudiants présents
      const moyenneAbsences = nombreAbsences / nombreEtudiants;

      res.json({ moyenne_presences: moyenneAbsences });
    });
  });
});
            // // Moyenne des presences pour un module 
            // app.get('/moyennepreseancemodule/:username', (req, res) => {
            //   const username = req.params.username;
            //   // Requête pour obtenir le nombre d'étudiants dans le module
            //   db.get('SELECT COUNT(DISTINCT e.id_enrollment) AS nombre_etudiants FROM professeur p,enrollment e,module m WHERE p.id_prof = m.id_prof AND m.id_module = e.id_module AND p.username = ?', [username], (err, result) => {
            //     if (err) {
            //       console.error(err.message);
            //       res.status(500).send('Erreur du serveur.');
            //       return;
            //     }

            //     const nombreEtudiants = result.nombre_etudiants;
            //     // Requête pour obtenir le nombre de présences lors du module
            //     db.get('SELECT COUNT(*) AS nombre_presences FROM attendance a,professeur p,enrollment e,module m,seance s WHERE p.id_prof = m.id_prof AND m.id_module = e.id_module AND e.id_enrollment = a.id_enrollment AND s.id_module = m.id_module AND a.id_code = s.id_seance AND p.username = ? AND a.present = "présent"', [username], (err, result) => {
            //       if (err) {
            //         console.error(err.message);
            //         res.status(500).send('Erreur du serveur.');
            //         return;
            //       }
            //       const nombrePresences = result.nombre_presences;


            //       //-------------------------moyenne avec nombre des seances !!!!

            //         // Requête pour obtenir le nombre des seances lors du module
            //         db.get('SELECT COUNT(*) AS nombre_seances FROM attendance a,professeur p,enrollment e,module m,seance s WHERE p.id_prof = m.id_prof AND m.id_module = e.id_module AND e.id_enrollment = a.id_enrollment AND s.id_module = m.id_module AND a.id_code = s.id_seance AND p.username = ? AND a.present = "présent"', [username], (err, result) => {
            //           if (err) {
            //             console.error(err.message);
            //             res.status(500).send('Erreur du serveur.');
            //             return;
            //           }

            //           const nombrePresences = result.nombre_presences;

            //         // Calcul de la moyenne des étudiants présents
            //         const moyennePresences = nombrePresences / nombreEtudiants;

            //         res.json({ moyenne_presences: moyennePresences });
            //       });
            //     });
            //   });
            // });
            // // Moyenne des absences pour un module 
            // app.get('/moyenneabseancemodule/:username', (req, res) => {
            //   const username = req.params.username;
            //   // Requête pour obtenir le nombre d'étudiants dans le module
            //   db.get('SELECT COUNT(DISTINCT e.id_enrollment) AS nombre_etudiants FROM professeur p,enrollment e,module m WHERE p.id_prof = m.id_prof AND m.id_module = e.id_module AND p.username = ?', [username], (err, result) => {
            //     if (err) {
            //       console.error(err.message);
            //       res.status(500).send('Erreur du serveur.');
            //       return;
            //     }

            //     const nombreEtudiants = result.nombre_etudiants;
            //     // Requête pour obtenir le nombre de présences lors du module
            //     db.get('SELECT COUNT(*) AS nombre_absences FROM attendance a,professeur p,enrollment e,module m,seance s WHERE p.id_prof = m.id_prof AND m.id_module = e.id_module AND e.id_enrollment = a.id_enrollment AND s.id_module = m.id_module AND a.id_code = s.id_seance AND p.username = ? AND a.present = "absent"', [username], (err, result) => {
            //       if (err) {
            //         console.error(err.message);
            //         res.status(500).send('Erreur du serveur.');
            //         return;
            //       }

            //       const nombreAbsences = result.nombre_absences;

            //       // Calcul de la moyenne des étudiants présents
            //       const moyenneAbsences = nombreAbsences / nombreEtudiants;

            //       res.json({ moyenne_absences: moyenneAbsences });
            //     });
            //   });
            // });

//-----------------------------------------------------------------------
/*                                                                     */
/*                              ROUTES END                             */
/*                                                                     */
//-----------------------------------------------------------------------

app.listen(PORT, IP_ADDRESS, () => {
   console.log(`Serveur backend écoutant sur le port http://${IP_ADDRESS}:${PORT}.`);
});
//--------------------------------------------------------------------
/*                                                                  */
/*                              END :)                              */
/*                                                                  */
//--------------------------------------------------------------------