import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet,
  Text, 
  StatusBar, 
  View, 
  TouchableOpacity, 
  Dimensions, 
  Alert, 
  PanResponder,
  SafeAreaView,
  TextInput,
  ImageBackground
 } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// import { FontAwesome } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');
import { ScrollView } from 'react-native-gesture-handler';
import * as Font from 'expo-font';
import API_URL from '../../../config';


export default function HomeAdmin() {

  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fontLoaded, setFontLoaded] = useState(false);
  
  //--------Variables Route
  const route = useRoute();
  const type = route.params.type;
  const username = route.params.username;

  //--------Variables Admin
  const [nom, setNom] = useState('');
  const [idAdmin, setIdAdmin] = useState('');
  const [idFiliere, setIdFiliere] = useState('');
  const [NomFiliere, setNomFiliere] = useState('');

  //--------Variables Etudiant
  const [showForm1, setShowForm1] = useState(false);
  const handleAddClick1 = () => {
    setShowForm1(!showForm1);
  };
  const [apoge1, setApoge1] = useState('');
  const [apoge2, setApoge2] = useState('');
  const [apoge3, setApoge3] = useState('');
  const [apoge4, setApoge4] = useState('');
  const [cne, setCne] = useState('');
  const [nom1, setNom1] = useState('');
  const [nom2, setNom2] = useState('');
  const [prenom1, setPrenom1] = useState('');
  const [prenom2, setPrenom2] = useState('');
  const [semestre1, setSemestre1] = useState('');
  const [semestre2, setSemestre2] = useState('');
  const [filiere1, setFiliere1] = useState('');
  const [error11, setError11] = useState('');
  const [error12, setError12] = useState('');
  const [error13, setError13] = useState('');
  const [error14, setError14] = useState('');

  //--------Variables Module
  const [showForm2, setShowForm2] = useState(false);
  const handleAddClick2 = () => {
    setShowForm2(!showForm2);
  };
  const [module1, setModule1] = useState('');
  const [module2, setModule2] = useState('');
  const [module3, setModule3] = useState('');
  const [semestre3, setSemestre3] = useState('');
  const [usernameProf1, setUsernameProf1] = useState('');
  const [usernameProf2, setUsernameProf2] = useState('');
  const [error21, setError21] = useState('');
  const [error22, setError22] = useState('');
  const [error23, setError23] = useState('');

  //--------Variables Enrollment
  const [showForm3, setShowForm3] = useState(false);
  const handleAddClick3 = () => {
    setShowForm3(!showForm3);
  };
  const [apoge5, setApoge5] = useState('');
  const [apoge6, setApoge6] = useState('');
  const [apoge7, setApoge7] = useState('');
  const [module4, setModule4] = useState('');
  const [module5, setModule5] = useState('');
  const [error31, setError31] = useState('');
  const [error32, setError32] = useState('');
  const [error33, setError33] = useState('');

  //--------Variables Enseignant
  const [showForm4, setShowForm4] = useState(false);
  const handleAddClick4 = () => {
    setShowForm4(!showForm4);
  };
  const [nom3, setNom3] = useState('');
  const [usernameProf3, setUsernameProf3] = useState('');
  const [usernameProf4, setUsernameProf4] = useState('');
  const [password, setPassword] = useState('');
  const [error41, setError41] = useState('');
  const [error42, setError42] = useState('');
  
//===========================Etudiant===========================
  //--------------------Ajouter un Etudiant-------------------
    const AjoutEtudiant = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(`${API_URL}AjoutEtud`, { 
          idFiliere,
          apoge: apoge1,
          cne,
          nom: nom1,
          prenom: prenom1,
          semestre: semestre1,
          username
        });
        const data = response.data;
        if (data.success) {
          Alert.alert('Ajouter avec succes', 'L\'etudiant '+ nom1 +' '+ prenom1 +' est ajouter', [
            {
              text: 'OK',
              onPress: () => {
              },
           },
          ]);
        // Réinitialiser le formulaire
          setApoge1('');
          setCne('');
          setNom1('');
          setPrenom1('');
          setSemestre1('');
          setShowForm1(false);
          setError11('');
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setError11(error.response.data.message);
        } else {
          setError11('An error occurred. Please try again later.');
        }
      }
      setIsLoading(false);
    };
  //--------------------Modifier un Etudiant(semestre)--------
    const ModiEtudiantSemestre = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(`${API_URL}ModiEtudSem`, { 
          apoge: apoge2,
          semestre: semestre2
        });
        const data = response.data;
        if (data.success) {
          Alert.alert('L\'etudiant modifier avec succes', '', [
            {
              text: 'OK',
              onPress: () => {
              },
           },
          ]);
        // Réinitialiser le formulaire
          setApoge2('');
          setSemestre2('');
          setShowForm1(false);
          setError12('');
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setError12(error.response.data.message);
        } else {
          setError12('An error occurred. Please try again later.');
        }
      }
      setIsLoading(false);
    };
  //--------------------Modifier un Etudiant(filiere)---------
    const ModiEtudiantFiliere = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(`${API_URL}ModiEtudFiliere`, { 
          filiere: filiere1,
          apoge: apoge3
        });
        const data = response.data;
        if (data.success) {
          Alert.alert('L\'etudiant modifier avec succes', '', [
            {
              text: 'OK',
              onPress: () => {
              },
          },
          ]);
        // Réinitialiser le formulaire
        setApoge3('');
        setFiliere1('');
        setShowForm1(false);
        setError13('');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError13(error.response.data.message);
      } else {
        setError13('An error occurred. Please try again later.');
      }
    }
    setIsLoading(false);
    };
  //--------------------Supprimer un Etudiant-----------------
    const SuprEtudiant = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(`${API_URL}SuprEtud`, { 
          idFiliere,
          nom: nom2,
          prenom: prenom2,
          apoge: apoge4
        });
        const data = response.data;
        if (data.success) {
          Alert.alert('Supprimer avec succes', 'L\'etudiant '+ nom2 +' '+ prenom2 +' a été supprimé.', [
            {
              text: 'OK',
              onPress: () => {
              },
          },
          ]);
          // Réinitialiser le formulaire
          setApoge4('');
          setNom2('');
          setPrenom2('');
          setShowForm1(false);
          setError14('');
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setError14(error.response.data.message);
        } else {
          setError14('An error occurred. Please try again later.');
        }
      }
      setIsLoading(false);
    };
//===========================Modules============================
  //--------------------Ajouter un Module---------------------
    const AjoutModule = async () => {
        setIsLoading(true);
        try {
          const response = await axios.post(`${API_URL}AjoutModule`, { 
            idFiliere,
            module: module1,
            semestre: semestre3,
            professeur: usernameProf1,
            username
          });
          const data = response.data;
          if (data.success) {
            Alert.alert('Ajouter avec succes', 'Le module '+ module1 +' est ajouter', [
              {
                text: 'OK',
                onPress: () => {
                },
            },
            ]);
          // Réinitialiser le formulaire
            setModule1('');
            setSemestre3('');
            setUsernameProf1('');
            setShowForm2(false);
            setError21('');
          }
        } catch (error) {
          if (error.response && error.response.data && error.response.data.message) {
            setError21(error.response.data.message);
          } else {
            setError21('An error occurred. Please try again later.');
          }
        }
        setIsLoading(false);
    };
  //--------------------Modifier un Module--------------------
    const ModiModule = async () => {
        setIsLoading(true);
        try {
          const response = await axios.post(`${API_URL}ModiModule`, { 
            module: module2,
            enseignant: usernameProf2
          });
          const data = response.data;
          if (data.success) {
            Alert.alert('Le module modifier avec succes', '', [
              {
                text: 'OK',
                onPress: () => {
                },
            },
            ]);
          // Réinitialiser le formulaire
            setModule2('');
            setUsernameProf2('');
            setShowForm2(false);
            setError22('');
          }
        } catch (error) {
          if (error.response && error.response.data && error.response.data.message) {
            setError22(error.response.data.message);
          } else {
            setError22('An error occurred. Please try again later.');
          }
        }
        setIsLoading(false);
    };
  //--------------------Supprimer un Module-------------------
    const SuprModule = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(`${API_URL}SuprModule`, { 
          idFiliere,
          module: module3
        });
        const data = response.data;
        if (data.success) {
          Alert.alert('Supprimer avec succes', 'Le module '+ module3 +' a été supprimé.', [
            {
              text: 'OK',
              onPress: () => {
              },
          },
          ]);
          // Réinitialiser le formulaire
          setModule3('');
          setShowForm2(false);
          setError23('');
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setError23(error.response.data.message);
        } else {
          setError23('An error occurred. Please try again later.');
        }
      }
      setIsLoading(false);
    };
//===========================Enrollment=========================
  //--------------------Ajouter un Enrollment-----------------
    const AjoutEnrollment = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(`${API_URL}AjoutEnrollment`, { 
          idFiliere,
          apoge: apoge5,
          module: module4
        });
        const data = response.data;
        if (data.success) {
          Alert.alert('Ajouter avec succes', 'L\'enrollment de l\'etudiant '+ apoge5 +' au '+ module4 +' est ajouter', [
            {
              text: 'OK',
              onPress: () => {
              },
          },
          ]);
        // Réinitialiser le formulaire
          setApoge5('');
          setModule4('');
          setShowForm3(false);
          setError31('');
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setError31(error.response.data.message);
        } else {
          setError31('An error occurred. Please try again later.');
        }
      }
      setIsLoading(false);
    };
  //--------------------Reset enrollments d'un etudiant-------
    /* Si l'etudiant est laissé l'universiter */
    const ResetEnrollment = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(`${API_URL}ResetEnrollment`, { 
          idFiliere,
          apoge: apoge6,
        });
        const data = response.data;
        if (data.success) {
          Alert.alert('', 'Les enrollment de l\'etudiant'+ apoge6 +'sont supprimer avec succes', [
            {
              text: 'OK',
              onPress: () => {
              },
          },
          ]);
        // Réinitialiser le formulaire
          setApoge6('');
          setShowForm3(false);
          setError32('');
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setError32(error.response.data.message);
        } else {
          setError32('An error occurred. Please try again later.');
        }
      }
      setIsLoading(false);
    };
  //-------Supprimer un enrollment d'un etudiant à un module--
    const SuprEnrollment = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(`${API_URL}SuprEnrollment`, { 
          idFiliere,
          module: module5,
          apoge: apoge7
        });
        const data = response.data;
        if (data.success) {
          Alert.alert('Supprimer avec succes', 'L\'enrollment de l\'etudiant'+ apoge7 +'au module'+ module5 +' a été supprimé.', [
            {
              text: 'OK',
              onPress: () => {
              },
          },
          ]);
          // Réinitialiser le formulaire
          setModule5('');
          setApoge7('');
          setShowForm3(false);
          setError33('');
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setError33(error.response.data.message);
        } else {
          setError33('An error occurred. Please try again later.');
        }
      }
      setIsLoading(false);
    };
//===========================Enseignant=========================
  //--------------------Ajouter un Enrollment-----------------
    const AjoutProf = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(`${API_URL}AjoutProf`, { 
          idFiliere,
          username,
          nom: nom3,
          name: usernameProf3,
          password
        });
        const data = response.data;
        if (data.success) {
          Alert.alert('Ajouter avec succes', 'L\'enseignant '+ nom3 +' est ajouter', [
            {
              text: 'OK',
              onPress: () => {
              },
          },
          ]);
        // Réinitialiser le formulaire
          setNom3('');
          setUsernameProf3('');
          setPassword('');
          setShowForm4(false);
          setError41('');
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setError41(error.response.data.message);
        } else {
          setError41('An error occurred. Please try again later.');
        }
      }
      setIsLoading(false);
    };
  //-------Supprimer un enrollment d'un etudiant à un module--
    const SuprProf = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(`${API_URL}SuprProf`, { 
          idFiliere,
          professeur: usernameProf4,
        });
        const data = response.data;
        if (data.success) {
          Alert.alert('Supprimer avec succes', 'L\'enseignant '+ usernameProf4 +' a été supprimé.', [
            {
              text: 'OK',
              onPress: () => {
              },
          },
          ]);
          // Réinitialiser le formulaire
          setUsernameProf4('');
          setShowForm4(false);
          setError42('');
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setError42(error.response.data.message);
        } else {
          setError42('An error occurred. Please try again later.');
        }
      }
      setIsLoading(false);
    };
//===============================================================
  //--------------------------------Data Admin-----------------
    axios.get(`${API_URL}donneesadmin/${username}`, {
      params: {
        username: username
      }
    })
    .then(response => {
      setNom(response.data[0].nom);
      setIdAdmin(response.data[0].id_admin);
      setNomFiliere(response.data[0].filiere);
      setIdFiliere(response.data[0].id_filiere);
    })
    .catch(error => {
      console.error(error);
    });
//===============================================================
  const [isProfileVisible, setIsProfileVisible] = useState(false);
    const toggleProfile = () => {
      setIsProfileVisible(!isProfileVisible);
    };

    const renderProfile = () => {
      if (isProfileVisible) {
        return (
          <View style={styles.profileContainer}>
            <Text style={styles.profileText}>
              ID: {idAdmin} ,{'\n'}Votre ID pour récuperer le mdp{'\n\n'}
              Username: {username}{'\n'}
              Nom: {nom}{'\n'}
              Filière: {NomFiliere}
            </Text>
          </View>
        );
      } else {
        return null;
      }
    };
//===============================================================
    const panResponder = useRef(
        PanResponder.create({
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
          const { dx, dy } = gestureState;
          // Check if the user has dragged from left to right
          return dx > 50 && Math.abs(dy) < 50;
        },
        onPanResponderRelease: (evt, gestureState) => {
          const { dx, dy } = gestureState;
          // If the user has dragged from left to right, open the modal
          if (dx > 50 && Math.abs(dy) < 50) {
            setModalVisible(true);
          }
        },
      })
    ).current;
  //---------------------------------------------------
    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };
    const handleMenuClose = () => {
      toggleModal();
    };
  //--------------------------Menu---------------------
    const ResetPassword = () => {
      toggleModal();
      navigation.navigate('ResetPassword', { type: type ,username :username});
    }
    const Logout = () => {
      toggleModal();
      navigation.navigate('Welcome');
    }
    const listes = () => {
      toggleModal();
      navigation.navigate('ListesA', {username: username ,NomFiliere: NomFiliere});
    }
  /*-----------------------------------------------------------------------------*/
  //------------------------Font Lobstar-Regular or Abel-------------------------//
  /*-----------------------------------------------------------------------------*/
    useEffect(() => {
      async function loadFonts() {
        try {
          await Font.loadAsync({
            'Lobster-Regular': require('../../../assets/fonts/Lobster-Regular.ttf'),
            'Abel-Regular': require('../../../assets/fonts/Abel-Regular.ttf'),
            'DMSans-Bold': require('../../../assets/fonts/DMSans-Bold.ttf'),
            'DMSans-Medium': require('../../../assets/fonts/DMSans-Medium.ttf'),
            'DMSans-Regular': require('../../../assets/fonts/DMSans-Regular.ttf'),
            'TRTBold': require('../../../assets/fonts/TRTBold.ttf'),
            'TRTBoldItalic': require('../../../assets/fonts/TRTBoldItalic.ttf'),
            'TRTLight': require('../../../assets/fonts/TRTLight.ttf'),
            'TRTLightItalic': require('../../../assets/fonts/TRTLightItalic.ttf'),
            'TRTMedium': require('../../../assets/fonts/TRTMedium.ttf'),
            'TRTMediumItalic': require('../../../assets/fonts/TRTMediumItalic.ttf'),
            'TRTRegular': require('../../../assets/fonts/TRTRegular.ttf'),
            'TRTRegularItalic': require('../../../assets/fonts/TRTRegularItalic.ttf'),
          });
          setFontLoaded(true);
        } catch (error) {
          // console.error(error);
          setError('An error occurred. Please try again later.');
        }
      }
      loadFonts();
    }, []);
    if (!fontLoaded) {
      return null; // or a loading screen
    }
  /*----------------------------------------------------------------------------------*/
  //--------------------------------------Front-end-----------------------------------//
  /*----------------------------------------------------------------------------------*/
  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <ImageBackground
        source={require('../../../assets/images/backAdmin.png')}
        style={styles.imageBackground}
      >
      <StatusBar backgroundColor="#262626" barStyle="light-content" />
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleModal}>
          <Ionicons name="ios-menu" size={35} color="#F2F2F2" />
        </TouchableOpacity>

        <Modal isVisible={isModalVisible} style={styles.modal} onBackdropPress={toggleModal} >
          <View style={styles.menuContainer}>
            <TouchableOpacity style={{ alignItems: 'flex-end', backgroundColor: '#F2F2F2', paddingVertical: 1 }} onPress={handleMenuClose}>
              <View style={styles.row}>
                <Ionicons name="close-circle" size={24} color="#191D3A" />
              </View>
            </TouchableOpacity>
            <View style={styles.scontainer}>
              <Text style={styles.title}>Bienvenu</Text>
              <View style={styles.accountInfo}>
                <Text style={styles.email}>Monsieur l'{type}</Text>
              </View>
              {/* <View style={{ height: 20 }} /> */}
            </View>
            <View style={{ height: 30 }} />
            {/* <TouchableOpacity style={styles.modalButton} onPress={listeEtud}>
              <View style={styles.row}>
                <Text style={styles.modalButtonText}>Liste des étudiants</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={listProf}>
              <View style={styles.row}>
                <Text style={styles.modalButtonText}>Listes des professeurs</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={listModule}>
              <View style={styles.row}>
                <Text style={styles.modalButtonText}>Listes des modules</Text>
              </View>
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.modalButton} onPress={listes}>
              <View style={styles.row}>
                <Ionicons name="list" size={24} color="#191D3A" />
                <Text style={styles.modalButtonText}>Listes</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={ResetPassword}>
              <View style={styles.row}>
                <Ionicons name="lock-closed" size={24} color="#191D3A" />
                <Text style={styles.modalButtonText}>Modifier le mot de passe</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={Logout}>
            <View style={styles.row}>
                <Ionicons name="log-out-outline" size={24} color="#191D3A" />
                <Text style={styles.modalButtonText}>Déconnecter</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
        <TouchableOpacity onPress={toggleProfile}>
          <Text style={{ fontFamily: 'TRTBold', color: 'white' }}>Admin {NomFiliere}</Text>
        </TouchableOpacity>
      </View>
      <View style={{pading: 50}}>      
        {renderProfile()}     
      </View>       
      { /*-----------------------Contenu-------------------------------*/}
      <ScrollView>
        <View style={styles.content}>
          {/* Section Bienvenu */}
          <View style={{/*flex: 0.3,backgroundColor: '#262626',*/ justifyContent: 'center' }}>
            <Text style={[styles.heading, { fontSize: 44, paddingVertical: 55 , color :'white' }]}>
              Bienvenu Mr(s).{nom}
            </Text>
          </View>

          {/*#E3F1E1  #D9D9D9  #A6A6A6  rgba(138, 191, 84, 0.8) secureTextEntry={true}*/}

          <View style={{flexDirection: "row", backgroundColor: "#E3F1E1", borderRadius: 55, justifyContent: "center", padding: 20, marginVertical: 10, marginHorizontal: 10}}>
            {/* Section Etudiants */}
            <View style={{flex: 1}}>
              <Text style={[styles.heading, { color: '#262626', fontSize: 22, fontFamily: 'DMSans-Medium'/*, padding: 10 */}]}>
                Etudiants
              </Text>
                <View style={styles.column}>
                  <Text style={[styles.label/*,{ color:'#262626'}*/]}>Ajouter | Modifier | Supprimer</Text>
                <TouchableOpacity style={styles.treeButton} onPress={handleAddClick1}>
                        <Ionicons name="md-arrow-down-circle" size={30} color="#262626" />
                </TouchableOpacity>
                </View>
              {showForm1 && (
                <View style={styles.formContainer}>
                  <ScrollView style={{flex: 1}}>
                    <View  style={{/*flex: 0.6,*/ marginVertical: 40,marginHorizontal: 20}}>
                      <Text style={{
                        fontSize: 17,
                        fontWeight: 'bold',
                        color: 'black',
                        marginBottom: 10}}
                      >Pour ajouter</Text>
                      <TextInput
                        style={styles.input2}
                        value={apoge1}
                        onChangeText={setApoge1}
                        placeholder="Entrez le numéro apoge de l'étudiant"
                      />
                      <TextInput
                        style={styles.input2}
                        value={cne}
                        onChangeText={setCne}
                        placeholder="Entrez le CNE de l'étudiant"
                      />
                      <TextInput
                        style={styles.input2}
                        value={nom1}
                        onChangeText={setNom1}
                        placeholder="Entrez le nom de l'étudiant"
                      />
                      <TextInput
                        style={styles.input2}
                        value={prenom1}
                        onChangeText={setPrenom1}
                        placeholder="Entrez le prénom de l'etudiant"
                      />
                      <TextInput
                        style={styles.input2}
                        value={semestre1}
                        onChangeText={setSemestre1}
                        placeholder="Entrez le semestre 'S5'"
                      />
                      {error11? <Text style={styles.msgerror}>{error11}</Text> : null}
                      <TouchableOpacity style={styles.addButton2} onPress={AjoutEtudiant}>
                          <Text style={styles.addButtonText}>Ajouter</Text>
                      </TouchableOpacity>
                    </View>
                    <View  style={{/*flex: 0.4,*/ marginVertical: 40,marginHorizontal: 20}}>
                      <Text style={{
                        fontSize: 17,
                        fontWeight: 'bold',
                        color: 'black',
                        marginBottom: 10}}
                      >Pour modifier le semestre</Text>
                      <TextInput
                        style={styles.input2}
                        value={apoge2}
                        onChangeText={setApoge2}
                        placeholder="Entrez le numéro apogée de l'étudiant"
                      />
                      <TextInput
                        style={styles.input2}
                        value={semestre2}
                        onChangeText={setSemestre2}
                        placeholder="Entrez le nouveau semestre 'S6'"
                      />
                      {error12? <Text style={styles.msgerror}>{error12}</Text> : null}
                      <TouchableOpacity style={styles.addButton2} onPress={ModiEtudiantSemestre}>
                          <Text style={styles.addButtonText}>Modifier</Text>
                      </TouchableOpacity>
                    </View>
                    <View  style={{/*flex: 0.4,*/ marginVertical: 40,marginHorizontal: 20}}>
                      <Text style={{
                        fontSize: 17,
                        fontWeight: 'bold',
                        color: 'black',
                        marginBottom: 10}}
                      >Pour modifier la filière</Text>
                      <TextInput
                        style={styles.input2}
                        value={apoge3}
                        onChangeText={setApoge3}
                        placeholder="Entrez le numéro apogée"
                      />
                      <TextInput
                        style={styles.input2}
                        value={filiere1}
                        onChangeText={setFiliere1}
                        placeholder="Entrez la nouvelle filiere 'SMA'"
                      />
                      {error13? <Text style={styles.msgerror}>{error13}</Text> : null}
                      <TouchableOpacity style={styles.addButton2} onPress={ModiEtudiantFiliere}>
                          <Text style={styles.addButtonText}>Modifier</Text>
                      </TouchableOpacity>
                    </View>
                    <View  style={{/*flex: 0.4,*/ marginVertical: 40,marginHorizontal: 20}}>
                      <Text style={{
                        fontSize: 17,
                        fontWeight: 'bold',
                        color: 'black',
                        marginBottom: 10}}
                      >Pour supprimer un étudiant</Text>
                      <TextInput
                        style={styles.input2}
                        value={nom2}
                        onChangeText={setNom2}
                        placeholder="Entrez le nom de l'étudiant"
                      />
                      <TextInput
                        style={styles.input2}
                        value={prenom2}
                        onChangeText={setPrenom2}
                        placeholder="Entrez le prénom de l'étudiant"
                      />
                      <TextInput
                        style={styles.input2}
                        value={apoge4}
                        onChangeText={setApoge4}
                        placeholder="Entrez le numéro apogée de l'étudiant"
                        />
                        {error14? <Text style={styles.msgerror}>{error14}</Text> : null}
                      <TouchableOpacity style={styles.addButton2} onPress={SuprEtudiant}>
                          <Text style={styles.addButtonText}>Supprimer</Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
          
          <View style={{flexDirection: "row", backgroundColor: "#D9D9D9", borderRadius: 55, justifyContent: "center", padding: 20, marginVertical: 10, marginHorizontal: 10}}>
            {/* Section Modules */}
            <View style={{flex: 1}}>
              <Text style={[styles.heading, { color: '#262626', fontSize: 22, fontFamily: 'DMSans-Medium'/*, padding: 10 */}]}>
                Modules
              </Text>
                <View style={styles.column}>
                  <Text style={[styles.label/*,{ color:'#262626'}*/]}>Ajouter | Modifier | Supprimer</Text>
                  <TouchableOpacity style={styles.treeButton} onPress={handleAddClick2}>
                        <Ionicons name="md-arrow-down-circle" size={30} color="#262626" />
                  </TouchableOpacity>
                </View>
              {showForm2 && (
                <View style={styles.formContainer}>
                  <ScrollView style={{flex: 1}}>
                    <View  style={{/*flex: 0.6,*/ marginVertical: 40,marginHorizontal: 20}}>
                      <Text style={{
                        fontSize: 17,
                        fontWeight: 'bold',
                        color: 'black',
                        marginBottom: 10}}
                      >Pour ajouter</Text>
                      <TextInput
                        style={styles.input2}
                        value={module1}
                        onChangeText={setModule1}
                        placeholder="Entrez le nom du module"
                      />
                      <TextInput
                        style={styles.input2}
                        value={usernameProf1}
                        onChangeText={setUsernameProf1}
                        placeholder="Entrez le nom de l'enseignant"
                      />
                      <TextInput
                        style={styles.input2}
                        value={semestre3}
                        onChangeText={setSemestre3}
                        placeholder="Entrez le nom du semestre 'S1'"
                      />
                      {error21? <Text style={styles.msgerror}>{error21}</Text> : null}
                      <TouchableOpacity style={styles.addButton2} onPress={AjoutModule}>
                          <Text style={styles.addButtonText}>Ajouter</Text>
                      </TouchableOpacity>
                    </View>
                    <View  style={{/*flex: 0.4,*/ marginVertical: 40,marginHorizontal: 20}}>
                      <Text style={{
                        fontSize: 17,
                        fontWeight: 'bold',
                        color: 'black',
                        marginBottom: 10}}
                      >Pour modifier l'enseignant</Text>
                      <TextInput
                        style={styles.input2}
                        value={module2}
                        onChangeText={setModule2}
                        placeholder="Entrez le nom du module"
                      />
                      <TextInput
                        style={styles.input2}
                        value={usernameProf2}
                        onChangeText={setUsernameProf2}
                        placeholder="Entrez le nom du nouveau enseignant"
                      />
                      {error22? <Text style={styles.msgerror}>{error22}</Text> : null}
                      <TouchableOpacity style={styles.addButton2} onPress={ModiModule}>
                          <Text style={styles.addButtonText}>Modifier</Text>
                      </TouchableOpacity>
                    </View>
                    <View  style={{/*flex: 0.4,*/ marginVertical: 40,marginHorizontal: 20}}>
                      <Text style={{
                        fontSize: 17,
                        fontWeight: 'bold',
                        color: 'black',
                        marginBottom: 10}}
                      >Pour supprimer un module</Text>
                      <TextInput
                        style={styles.input2}
                        value={module3}
                        onChangeText={setModule3}
                        placeholder="Entrez le nom du module"
                      />
                      {error23? <Text style={styles.msgerror}>{error23}</Text> : null}
                      <TouchableOpacity style={styles.addButton2} onPress={SuprModule}>
                          <Text style={styles.addButtonText}>Supprimer</Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </View>
              )}
            </View>
          </View>

          <View style={{flexDirection: "row", backgroundColor: "#A6A6A6", borderRadius: 55, justifyContent: "center", padding: 20, marginVertical: 10, marginHorizontal: 10}}>
            {/* Section Enrollments */}
            <View style={{flex: 1}}>
              <Text style={[styles.heading, { color: '#262626', fontSize: 22, fontFamily: 'DMSans-Medium'/*, padding: 10 */}]}>
                Enrollments
              </Text>
                <View style={styles.column}>
                  <Text style={[styles.label/*,{ color:'#262626'}*/]}>Ajouter | Supprimer | Réinitialiser</Text>
                  <TouchableOpacity style={styles.treeButton} onPress={handleAddClick3}>
                        <Ionicons name="md-arrow-down-circle" size={30} color="#262626" />
                  </TouchableOpacity>
                </View>
              {showForm3 && (
                <View style={styles.formContainer}>
                  <ScrollView style={{flex: 1}}>
                    <View  style={{/*flex: 0.5,*/ marginVertical: 40,marginHorizontal: 20}}>
                      <Text style={{
                        fontSize: 17,
                        fontWeight: 'bold',
                        color: 'black',
                        marginBottom: 10}}
                      >Pour ajouter les inscriptions</Text>
                      <TextInput
                        style={styles.input2}
                        value={apoge5}
                        onChangeText={setApoge5}
                        placeholder="Entrez le numéro apogée de l'étudiant"
                      />
                      <TextInput
                        style={styles.input2}
                        value={module4}
                        onChangeText={setModule4}
                        placeholder="Entrez le nom du module"
                      />
                      {error31? <Text style={styles.msgerror}>{error31}</Text> : null}
                      <TouchableOpacity style={styles.addButton2} onPress={AjoutEnrollment}>
                          <Text style={styles.addButtonText}>Ajouter</Text>
                      </TouchableOpacity>
                    </View>
                    <View  style={{/*flex: 0.5,*/ marginVertical: 40,marginHorizontal: 20}}>
                      <Text style={{
                        fontSize: 17,
                        fontWeight: 'bold',
                        color: 'black',
                        marginBottom: 10}}
                      >Pour supprimer</Text>
                      <TextInput
                        style={styles.input2}
                        value={apoge7}
                        onChangeText={setApoge7}
                        placeholder="Entrez le numéro apogée de l'étudiant"
                      />
                      <TextInput
                        style={styles.input2}
                        value={module5}
                        onChangeText={setModule5}
                        placeholder="Entrez le nom du module"
                      />
                      {error33? <Text style={styles.msgerror}>{error33}</Text> : null}
                      <TouchableOpacity style={styles.addButton2} onPress={SuprEnrollment}>
                          <Text style={styles.addButtonText}>Supprimer</Text>
                      </TouchableOpacity>
                    </View>
                    <View  style={{/*flex: 0.4,*/ marginVertical: 40,marginHorizontal: 20}}>
                      <Text style={{
                        fontSize: 17,
                        fontWeight: 'bold',
                        color: 'black',
                        marginBottom: 10}}
                      >Pour réinitialiser les {"\n"} inscriptions d'un étudiant</Text>
                      <TextInput
                        style={styles.input2}
                        value={apoge6}
                        onChangeText={setApoge6}
                        placeholder="Entrez le numéro apogée de l'étudiant"
                      />
                      {error32? <Text style={styles.msgerror}>{error32}</Text> : null}
                      <TouchableOpacity style={styles.addButton2} onPress={ResetEnrollment}>
                          <Text style={styles.addButtonText}>Réinitialiser</Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </View>
              )}
            </View>
          </View>

          <View style={{flexDirection: "row", backgroundColor: "#CEF2E1" /*rgba(138, 191, 84, 0.8)*/, borderRadius: 55, justifyContent: "center", padding: 20, marginVertical: 10, marginHorizontal: 10}}>
            {/* Section Enseignants */}
            <View style={{flex: 1}}>
              <Text style={[styles.heading, { color: '#262626', fontSize: 22, fontFamily: 'DMSans-Medium'/*, padding: 10 */}]}>
                Enseignants
              </Text>
                <View style={styles.column}>
                  <Text style={[styles.label/*,{ color:'#262626'}*/]}>Ajouter | Supprimer</Text>
                  <TouchableOpacity style={styles.treeButton} onPress={handleAddClick4}>
                        <Ionicons name="md-arrow-down-circle" size={30} color="#262626" />
                  </TouchableOpacity>
                </View>
              {showForm4 && (
                <View style={styles.formContainer}>
                  <ScrollView style={{flex: 1}}>
                    <View  style={{/*flex: 0.6,*/ marginVertical: 40,marginHorizontal: 20}}>
                      <Text style={{
                        fontSize: 17,
                        fontWeight: 'bold',
                        color: 'black',
                        marginBottom: 10}}
                      >Pour ajouter</Text>
                      <TextInput
                        style={styles.input2}
                        value={nom3}
                        onChangeText={setNom3}
                        placeholder="Entrez le nom de l'enseignant"
                      />
                      <TextInput
                        style={styles.input2}
                        value={usernameProf3}
                        onChangeText={setUsernameProf3}
                        placeholder="Entrez le nom d'utilisation"
                      />
                      <TextInput
                        style={styles.input2}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Entrez le mot de passe"
                        secureTextEntry={true}
                      />
                      {error41? <Text style={styles.msgerror}>{error41}</Text> : null}
                      <TouchableOpacity style={styles.addButton2} onPress={AjoutProf}>
                        <Text style={styles.addButtonText}>Ajouter</Text>
                      </TouchableOpacity>
                    </View>
                    <View  style={{/*flex: 0.4,*/ marginVertical: 40,marginHorizontal: 20}}>
                      <Text style={{
                        fontSize: 17,
                        fontWeight: 'bold',
                        color: 'black',
                        marginBottom: 10}}
                      >Pour supprimer un enseignant</Text>
                      <TextInput
                        style={styles.input2}
                        value={usernameProf4}
                        onChangeText={setUsernameProf4}
                        placeholder="Entrez le 'username' de l'enseignant"
                      />
                      {error42? <Text style={styles.msgerror}>{error42}</Text> : null}
                      <TouchableOpacity style={styles.addButton2} onPress={SuprProf}>
                        <Text style={styles.addButtonText}>Supprimer</Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  </View>
  );
}
/*----------------------------------------------------------------------------------*/
//----------------------------------------Styles------------------------------------//
/*----------------------------------------------------------------------------------*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F2F2F2',
    // padding: 5
  },
  // drawer: {
  //   margin: 0,
  //   width: width / 1.2,
  //   height: height,
  //   position: 'absolute',
  //   top: 64,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   backgroundColor: '#F9F9F9',
  //   paddingHorizontal: 16,
  // },
  // drawerHeader: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   paddingTop: 24,
  //   paddingBottom: 16,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#E6E6E6',
  // },
  // drawerHeaderText: {
  //   marginLeft: 12,
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   color: '#14171A',
  // },
  // drawerMenuItem: {
  //   paddingVertical: 16,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#E6E6E6',
  // },
  // drawerMenuItemText: {
  //   fontSize: 16,
  //   color: '#14171A',
  // },
  profileContainer: {
    // backgroundColor: '#D9D9D9',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    margin: 10,
    borderRadius: 35,
  },
  profileText:{
    textAlign: 'center',
    fontFamily: 'TRTBold',
    fontSize: 16,
    color: '#191D3A',
    // marginRight: 'auto',
    marginBottom: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 64,
    // backgroundColor: '#262626',
    // borderBottomWidth: 1,
    // borderBottomColor: '#262626',
    paddingHorizontal: 16,
  },
  modal: {
    width: width / 1.4,
    height: height,
    margin: 0,
    position: 'absolute',
    left: 0,
  },
  menuContainer: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    padding: 34,
    //justifyContent: 'center',
  },
  scontainer: {
    width: width / 2.2,
    padding: 6,
    borderBottomWidth: 1.3,
    borderBottomColor: 'black',
    position: 'relative',
  },
  title: {
    fontSize: 18,
    fontFamily: 'DMSans-Medium',
    marginBottom: 10,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.11)',
  },
  username: {
    marginRight: 10,
    fontWeight: 'bold',
  },
  email: {
    marginRight: 10,
    fontFamily: 'TRTRegular',
    color: '#555',
    fontSize: 14,
  },
  modalButton: {
    padding: 1,
    backgroundColor: '#F2F2F2',
    paddingVertical: 30,
    borderRadius: 29,
    alignItems: 'flex-start',
  },
  modalButtonText: {
      marginRight: 20,
      marginLeft: 15,
      color: '#344035',
      fontSize: 16,
      fontFamily: 'DMSans-Medium',
  },
  //--------------------------------
   row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  column: {
    // flex: 1,
    // marginVertical: 10,
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 4
  },
  label:{
    textAlign: 'center',
    fontFamily: 'TRTMedium',
    fontSize: 18,
    color: 'black',
    // marginRight: 'auto',
    // marginBottom: 1,
  },
  msgerror:{
    fontSize: 14,
    color: 'red',
    padding: 12,
    fontFamily: 'Abel-Regular',
  },
  // logo: {
  //   fontSize: 24,
  //   fontWeight: 'bold',
  //   color: 'white',
  //   marginBottom: 1,
  // },
  content: {
    // flex: 1,
    // backgroundColor: '#262626',
    justifyContent: 'space-between',
    padding:10
  },
  treeButton: {
    height: 60,
    width: 110,
    padding: 10,
    paddingHorizontal: 16,
    // backgroundColor: '#A3D4CC',
    // backgroundColor: '#F2E8C9',
    // paddingVertical: 20,
    // paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 150,
    marginRight: 20,
  },
  treeButtonText: {
    fontSize: 20,
    // fontWeight: 'bold',
    fontFamily: 'Lobster-Regular',
    color: '#262626',
  },
  heading: {
    textAlign: 'center',
    fontSize: 24,
    // fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'DMSans-Bold',
  },
  heading1: {
    textAlign: 'center',
    fontSize: 24,
    // fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'DMSans-Bold',
  },
  subheading: {
    fontSize: 16,
    color: '#666',
  },
  bottomBar: {
    height: 64,
    backgroundColor: '#F29F05',
    borderTopWidth: 1,
    borderTopColor: '#F29F05',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  buttonplus: {
    borderRadius: 24,
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: '#F0F0F0'
  },
  scannerCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    //display: showScanner ? 'flex' : 'none',
  },
  formContainer: {
      alignItems: 'center',
      marginTop: 20,
  },
  input1: {
    width: 220,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  input2: {
    width: 240,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  input3: {
      width: 240,
      height: 40,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
  },
  addButton1: {
      backgroundColor: '#262626',
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginHorizontal: 20
  },
  addButton2: {
      backgroundColor: '#262626',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      paddingHorizontal: 15,
      paddingVertical: 10,
  },
  addButton3: {
      backgroundColor: '#262626',
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingVertical: 10,
  },
  addButtonText: {
      color: 'white',
      fontFamily: 'TRTMedium',
      fontSize: 16,
  }
});