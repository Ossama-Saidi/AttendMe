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
  ImageBackground,
  Picker
 } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// import { FontAwesome } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');
import Modal from 'react-native-modal';
import { ScrollView } from 'react-native-gesture-handler';
import * as Font from 'expo-font';
import API_URL from '../../../config';
// import { useDrawerStatus } from '@react-navigation/drawer';

export default function AdminGlobale() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [nom, setNom] = useState('');
  const [idAdmin, setIdAdmin] = useState('');
  const [passwordadmin, setPasswordAdmin] = useState('');
  const [filiereadmin, setFiliereAdmin] = useState('');
  const route = useRoute();
  const type = route.params.type;
  const username = route.params.username;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [error2, setError2] = useState('');
  const [error22, setError22] = useState('');
  const [error3, setError3] = useState('');
  const [error33, setError33] = useState('');
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation();
  // console.log({navigation})
  const [predefinedKeywords, setPredefinedKeywords] = useState([]);
  
//===========================Etudiant===========================
  //--------------------Retirer une Seance-------------------
  const Retire = async (idSeance) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}SuprSeance`, { 
        idSeance
      });
      const data = response.data;
      if (data.success) {
        Alert.alert('La séance supprimer avec succes', '', [
            {
              text: 'OK',
              onPress: () => {
              },
          },
          ]);
      }
    } catch (error) {
        setError('An error occurred. Please try again later.');
    }
    setIsLoading(false);
  };
//-----------------------------------------------
  const [tabData, setTabData] = useState([]);
  axios.get(`${API_URL}listcountpresenceseanse`)
  .then(response => response.data)
  .then(data => setTabData(data))
  .catch(error => console.error(error));
  const [showForm, setShowForm] = useState(false);
  const handleAddClick = () => {
    setShowForm(true);
  };
  const handleMoveClick = () => {
    setShowForm(false);
  };
//----------------------------------------------------------
  axios.get(`${API_URL}donneesadmin/${username}`, {
    params: {
      username: username
    }
  })
    .then(response => {
      setNom(response.data[0].nom);
      setIdAdmin(response.data[0].id_admin);
      setPasswordAdmin(response.data[0].password);
      setFiliereAdmin(response.data[0].filiere);
    })
    .catch(error => {
      console.error(error);
    });
//-------------------------------------------------------------------
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
              Faculté: {filiereadmin}
            </Text>
          </View>
        );
      } else {
        return null;
      }
    };
//----------------------------------------------------------------------------
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
  /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
  //-----------------------------------------------
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const handleMenuClose = () => {
    toggleModal();
  };
  //-----------------------------------------------
  const ResetPassword = () => {
    toggleModal();
    navigation.navigate('ResetPassword', { type: type ,username :username});
    }
  const Logout = () => {
    toggleModal();
    // Perform any necessary actions, such as clearing session data
    //import { AsyncStorage } from 'react-native';
    //or : AsyncStorage.clear();
    // Clear session data from AsyncStorage
    //AsyncStorage.removeItem('authToken');
    // Navigate to the login screen
    navigation.navigate('Welcome');
  }
  const listes = () => {
    toggleModal();
    navigation.navigate('Listes', {username: username });
  }
  //-----------------------------------------------------------------------
  const [showForm1, setShowForm1] = useState(false);
  const [nomFiliere, setNomFiliere] = useState('');

  const handleAddClick1 = () => {
    setShowForm1(!showForm1);
  };

  const handleFormSubmit1Ajout = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}AjoutFiliere`, { 
        nomFiliere,
        username
      });
      const data = response.data;
      if (data.success) {
        Alert.alert('Ajouter avec succes', 'Filiere '+ nomFiliere +' added successfully.', [
          {
            text: 'OK',
            onPress: () => {
            },
         },
        ]);
        // setError(data.message);
        // Réinitialiser le formulaire
        setNomFiliere('');
        setShowForm1(false);
        setError('');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
    setIsLoading(false);
  };
  //-----------------------------------------------------------------------
  const handleFormSubmit1Sup = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}SuprFiliere`, { 
        nomFiliere,
        username
      });
      const data = response.data;
      if (data.success) {
        Alert.alert('Supprimer avec succes', 'Filiere :'+ nomFiliere +' .', [
          {
            text: 'OK',
            onPress: () => {
            },
         },
        ]);
        // setError(data.message);
        // Réinitialiser le formulaire
        setNomFiliere('');
        setShowForm1(false);
        setError('');
      }
    } catch (error) {
      // console.error(error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
    setIsLoading(false);
    // console.log('Valeur saisie :', nomFiliere);
  };
  //-----------------------------------------------------------------------
  const [showForm2, setShowForm2] = useState(false);
  const [title, setTitle] = useState('');
  const [pswrd, setPswrd] = useState('');
  const [debut_vacance, setDebutVacance] = useState('');
  const [fin_vacance, setFinVacance] = useState('');
  const [nombre_jours, setNombreJours] = useState('');

  const handleAddClick2 = () => {
    setShowForm2(!showForm2);
  };

  const handleFormSubmit2A = async () => {
    // Faire quelque chose avec la valeur saisie dans le formulaire
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}AjoutVacances`, { 
        title,
        debut_vacance,
        fin_vacance,
        nombre_jours,
        username
      });
      const data = response.data;
      if (data.success) {
        Alert.alert('Ajouter avec succes', 'Vacance '+ title +' added successfully.', [
          {
            text: 'OK',
            onPress: () => {
            },
         },
        ]);
        // Réinitialiser le formulaire
        setTitle('');
        setDebutVacance('');
        setFinVacance('');
        setNombreJours('');
        setShowForm2(false);
        setError2('');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError2(error.response.data.message);
      } else {
        setError2('An error occurred. Please try again later.');
      }
    }
    setIsLoading(false);
  };

  const handleFormSubmit2R = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}ReinitialiserVacances`, { 
        pswrd,
        username
      });
      const data = response.data;
      if (data.success) {
        Alert.alert('Reinitialiser avec succes', '', [
          {
            text: 'OK',
            onPress: () => {
            },
         },
        ]);
        // Réinitialiser le formulaire
        setPswrd('');
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

  //-----------------------------------------------------------------------
  const [showForm3, setShowForm3] = useState(false);
  const [name, setName] = useState('');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [filiere, setFiliere] = useState('');

  const handleAddClick3 = () => {
    setShowForm3(!showForm3);
  };

  const handleFormSubmit3A = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}AjoutAdmins`, { 
        name,
        user,
        password,
        filiere,
        username
      });
      const data = response.data;
      if (data.success) {
        Alert.alert('Ajouter avec succes', 'Admin '+ name +' added successfully.', [
          {
            text: 'OK',
            onPress: () => {
            },
         },
        ]);
        // Réinitialiser le formulaire
        setName('');
        setUser('');
        setPassword('');
        setFiliere('');
        setShowForm3(false);
        setError3('');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError3(error.response.data.message);
      } else {
        setError3('An error occurred. Please try again later.');
      }
    }
    setIsLoading(false);
  };
  const [passw, setPassw] = useState('');

  const handleFormSubmit3S = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}SuprAdmin`, { 
        name,
        passw,
        username
      });
      const data = response.data;
      if (data.success) {
        Alert.alert('Supprimer avec succes', 'Pour l\'admin '+ name +'.', [
          {
            text: 'OK',
            onPress: () => {
            },
         },
        ]);
        // Réinitialiser le formulaire
        setName('');
        setPassw('');
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
    axios.get(`${API_URL}getKeywordsFilieres`)
    .then(response => {
      setPredefinedKeywords(response.data.keywords);
    })
    .catch(error => {
      console.error('Error fetching keywords:', error);
    });
  }, []);
  if (!fontLoaded) {
    return null; // or a loading screen
  }


  // useEffect(() => {
  //   axios.get(`${API_URL}getKeywordsFilieres`)
  //     .then(response => {
  //       setPredefinedKeywords(response.data.keywords);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching keywords:', error);
  //     });
  // }, []);
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
          <Text style={{ fontFamily: 'TRTBold', color: 'white' }}>Admin Général</Text>
        </TouchableOpacity>
      </View>
      <View style={{pading: 50}}>      
        {renderProfile()}
      </View>
      { /*-----------------------Contenu-------------------------------*/}
      {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}
      <ScrollView>
        <View style={styles.content}>
          {/* Section Bienvenu */}
          <View style={{/*flex: 0.3,backgroundColor: '#262626'*/ justifyContent: 'center' }}>
            <Text style={[styles.heading, { fontSize: 44, paddingVertical: 55 , color :'white' }]}>
              Bienvenu {'\n'}Mr(s).{nom}
            </Text>
          </View>

          <View style={{flexDirection: "row", backgroundColor: "#E3F1E1", borderRadius: 55, justifyContent: "center", padding: 20, marginVertical: 10, marginHorizontal: 10}}>
            {/* Section Filières */}
            <View style={{flex: 1}}>
              <Text style={[styles.heading, {color: '#262626', fontSize: 22, fontFamily: 'DMSans-Medium'}]}>
                Filières
              </Text>
              {/* Ajouter filières */}
                  <View style={styles.column}>
                    <Text style={[styles.label/*,{ color:'#262626'}*/]}>Ajouter | Supprimer</Text>
                    <TouchableOpacity style={styles.treeButton} onPress={handleAddClick1}>
                        <Ionicons name="md-arrow-down-circle" size={30} color="#262626" />
                    </TouchableOpacity>
                  </View>
              {showForm1 && (
                <View style={styles.formContainer}>
                  <TextInput
                      style={styles.input1}
                      value={nomFiliere}
                      onChangeText={setNomFiliere}
                      placeholder="Entrez le nom du filière"
                    />
                    {error? <Text style={styles.msgerror}>{error}</Text> : null}
                  <View style={{flexDirection: "row", justifyContent: "space-between", /*backgroundColor: "white",*/ borderRadius: 66,/* padding: 20,*/ marginVertical: 10, marginHorizontal: 5}}>
                      <TouchableOpacity style={styles.addButton1} onPress={handleFormSubmit1Ajout}>
                        <Text style={styles.addButtonText}>Ajouter</Text>
                      </TouchableOpacity>
                      <Text style={{fontFamily: "DMSans-Medium"}}>|</Text>
                      <TouchableOpacity style={styles.addButton1} onPress={handleFormSubmit1Sup}>
                        <Text style={styles.addButtonText}>Supprimer</Text>
                      </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>

          <View style={{flexDirection: "row", backgroundColor: "#D9D9D9", borderRadius: 55, justifyContent: "center", padding: 20, marginVertical: 10, marginHorizontal: 10}}>
            {/* Section vacances */}
            <View style={{flex: 1}}>
              <Text style={[styles.heading, { color: '#262626', fontSize: 28, fontFamily: 'DMSans-Medium' }]}>
                Vacances 
              </Text>
                <View style={styles.column}>
                  <Text style={styles.label}>Ajouter ou Reinitialiser{"\n"}vacance</Text>
                    <TouchableOpacity style={styles.treeButton} onPress={handleAddClick2}>
                      <Ionicons name="md-arrow-down-circle" size={30} color="#262626" />
                      {/* <Text style={styles.treeButtonText}>Ajouter</Text> */}
                  </TouchableOpacity>
                </View>
              {showForm2 && (
              <View style={styles.formContainer}>
                <ScrollView style={{flex: 1}}>
                {/* <ScrollView showHorizontalScrollIndicateur={false} horizontal={true}> */}
                  {/* <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "white", borderRadius: 66, padding: 20, marginVertical: 10, marginHorizontal: 20}}> */}
                    {/* <View style={{flexDirection: "row", alignItems: "center"}}> */}
                    <View  style={{flex: 0.6, marginVertical: 40,marginHorizontal: 20}}>
                      <Text style={{
                        fontSize: 17,
                        fontWeight: 'bold',
                        color: 'black',
                        marginBottom: 10}}
                      >Pour ajouter</Text>
                      <TextInput
                      style={styles.input2}
                      value={title}
                      onChangeText={setTitle}
                      placeholder="Entrez le nom du vacance"
                      />
                      <TextInput
                      style={styles.input2}
                      value={debut_vacance}
                      onChangeText={setDebutVacance}
                      placeholder="Début : AAAA-MM-JJ"
                      />
                      <TextInput
                      style={styles.input2}
                      value={fin_vacance}
                      onChangeText={setFinVacance}
                      placeholder="Fin : AAAA-MM-JJ"
                      />
                      <TextInput
                      style={styles.input2}
                      value={nombre_jours}
                      onChangeText={setNombreJours}
                      placeholder="Nombre du jours : '2'"
                      />
                      {error2 ? <Text style={styles.msgerror}>{error2}</Text> : null}
                      {/* <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "white", borderRadius: 66, padding: 20, marginVertical: 10, marginHorizontal: 20}}> */}
                      <TouchableOpacity style={styles.addButton2} onPress={handleFormSubmit2A}>
                        <Text style={styles.addButtonText}>Ajouter</Text>
                      </TouchableOpacity>
                    </View>
                    <View  style={{flex: 0.4, marginVertical: 40,marginHorizontal: 20}}>
                      <Text style={{
                        fontSize: 17,
                        fontWeight: 'bold',
                        color: 'black',
                        marginBottom: 10}}
                      >Pour reinitialiser les dates de{"\n"} vacances</Text>
                      <TextInput
                      style={styles.input2}
                      value={pswrd}
                      onChangeText={setPswrd}
                      placeholder="Tapez votre password"
                      secureTextEntry={true}
                      />
                      {error22 ? <Text style={styles.msgerror}>{error22}</Text> : null}
                      <TouchableOpacity style={styles.addButton2} onPress={handleFormSubmit2R}>
                        <Text style={styles.addButtonText}>Réinitialiser</Text>
                      </TouchableOpacity>
                    </View>
                  {/* </View> */}
                </ScrollView>
              </View>
              )}
            </View>
          </View>

          <View style={{flexDirection: "row", backgroundColor: "#A6A6A6", borderRadius: 55, justifyContent: "center", padding: 20, marginVertical: 10, marginHorizontal: 10}}>
            {/* Section Admins */}
            <View style={{flex: 1}}>
              <Text style={[styles.heading, { color: '#262626', fontSize: 28, fontFamily: 'DMSans-Medium' }]}>
                Admins 
              </Text>
              {/* Ajouter Etudiants */}
                <View style={styles.column}>
                  <Text style={[styles.label,{ color:'#262626'}]}>Ajouter | Supprimer</Text>
                    <TouchableOpacity style={styles.treeButton} onPress={handleAddClick3}>
                      <Ionicons name="md-arrow-down-circle" size={30} color="#262626" />
                  </TouchableOpacity>
                </View>
              {showForm3 && (
              <View style={styles.formContainer}>
                <ScrollView style={{flex: 1}}>
                  <View  style={{flex: 0.6, marginVertical: 40,marginHorizontal: 20}}>
                    <Text style={{
                      fontSize: 17,
                      fontWeight: 'bold',
                      color: 'black',
                      marginBottom: 10}}
                    >Pour ajouter</Text>
                    <TextInput
                    style={styles.input3}
                    value={name}
                    onChangeText={setName}
                    placeholder="Entrez le nom du l'admin"
                    />
                    <TextInput
                    style={styles.input3}
                    value={user}
                    onChangeText={setUser}
                    placeholder="username"
                    />
                    <TextInput
                    style={styles.input3}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    />
                    {/* <TextInput
                    style={styles.input3}
                    value={filiere}
                    onChangeText={setFiliere}
                    placeholder="Filiere"
                    /> */}
                    <Picker
                      style={styles.input3}
                      selectedValue={filiere}
                      onValueChange={(value) => setFiliere(value)}
                    >
                      <Picker.Item label="Select a keyword" value="" />
                      {predefinedKeywords.map((keyword, index) => (
                      <Picker.Item key={index} label={keyword} value={keyword} />
                      ))}
                    </Picker>
                    {error3 ? <Text style={styles.msgerror}>{error3}</Text> : null}
                    <TouchableOpacity style={styles.addButton3} onPress={handleFormSubmit3A}>
                      <Text style={styles.addButtonText}>Ajouter</Text>
                    </TouchableOpacity>
                    {/* <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "white", borderRadius: 66, padding: 20, marginVertical: 10, marginHorizontal: 20}}> */}
                    {/* <View style={{flexDirection: "row", alignItems: "center"}}> */}
                  </View>
                  <View  style={{flex: 0.4, marginVertical: 40,marginHorizontal: 20}}>
                    <Text style={{
                      fontSize: 17,
                      fontWeight: 'bold',
                      color: 'black',
                      marginBottom: 10}}
                    >Pour supprimer</Text>
                    <TextInput
                    style={styles.input2}
                    value={name}
                    onChangeText={setName}
                    placeholder="Entrez le nom du l'admin"
                    />
                    <TextInput
                      style={styles.input2}
                      value={passw}
                      onChangeText={setPassw}
                      placeholder="Tapez votre password"
                      secureTextEntry={true}
                      />
                    {error33 ? <Text style={styles.msgerror}>{error33}</Text> : null}
                    <TouchableOpacity style={styles.addButton2} onPress={handleFormSubmit3S}>
                      <Text style={styles.addButtonText}>Supprimer</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
              )}
            </View>
          </View>

          <View style={{/*flexDirection: "row",*/ backgroundColor: "#CEF2E1"/*rgba(138, 191, 84, 0.8)*/, borderRadius: 55,/* justifyContent: "center",*/ padding: 20,paddingTop: 40, marginVertical: 10, marginHorizontal: 20}}>
            <View style={{flex: 1}}>
              <Text style={[styles.text2,{textAlign:'center'}]}>
              Séances sans Présence
              </Text>
              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={[styles.label,{ color:'#262626'}]}>Afficher</Text>
                  <TouchableOpacity style={styles.treeButton} onPress={handleAddClick}>
                    <Ionicons name="md-arrow-down-circle" size={26} color="#262626" />
                  </TouchableOpacity>
                </View>
              </View>
            {showForm && (
              <View style={styles.formContainer}>
                <ScrollView showHorizontalScrollIndicateur={false} horizontal={true}>
                  <View style={styles.row}>
                    
                    <View  style={{marginVertical: 40,marginHorizontal: 20}}>
                      <Text style={styles.text1}>Module</Text>
                      {tabData.map(item => (
                        <Text style={styles.text1} key={item.idSeance}>{item.module}</Text>
                      ))}
                    </View>
                    <View  style={{marginVertical: 40,marginHorizontal: 20}}>
                      <Text style={styles.text1}>Type</Text>
                      {tabData.map(item => (
                        <Text style={styles.text1} key={item.idSeance}>{item.type}</Text>
                      ))}
                    </View>
                    <View  style={{marginVertical: 40,marginHorizontal: 20}}>
                      <Text style={styles.text1}>Enseignant</Text>
                      {tabData.map(item => (
                        <Text style={styles.text1} key={item.idSeance}>{item.enseignent}</Text>
                      ))}
                    </View>
                    <View  style={{marginVertical: 40,marginHorizontal: 20}}>
                      <Text style={styles.text1}>Date</Text>
                      {tabData.map(item => (
                        <Text style={styles.text1} key={item.idSeance}>{item.date_seance}</Text>
                      ))}
                    </View>
                    <View style={{marginVertical: 40,marginHorizontal: 20}}>
                      <Text style={styles.text1}>Heure de début</Text>
                      {tabData.map(item => (
                        <Text style={styles.text1} key={item.idSeance}>{item.heure_debut}</Text>
                      ))}
                    </View>
                    <View style={{marginVertical: 40,marginHorizontal: 20}}>
                      <Text style={styles.text1}>Heure de fin</Text>
                      {tabData.map(item => (
                        <Text style={styles.text1} key={item.idSeance}>{item.heure_fin}</Text>
                      ))}
                    </View>
                    <View style={{marginVertical: 40,marginHorizontal: 20}}>
                      <Text style={styles.text1}>Retirer</Text>
                      {tabData.map(item => (
                        <TouchableOpacity
                          key={item.idSeance}
                          onPress={() => Retire(item.idSeance)}
                        >
                          <Ionicons name="trash" size={26} color="#262626" />
                        </TouchableOpacity>                        
                      ))}
                    </View>
                  </View>
                </ScrollView>
                <TouchableOpacity style={styles.treeButton} onPress={handleMoveClick}>
                  <Ionicons name="md-arrow-up-circle" size={26} color="#262626" />
                </TouchableOpacity>
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
    // backgroundColor: '#262626',
    // padding: 5
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
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
    // height: height,
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
    justifyContent: 'space-between',
    // backgroundColor: '#262626',
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
//   separator: {
//     marginVertical: 30,
//     height: 1,
//     width: '80%',
//   },
formContainer: {
    // alignItems: 'center',
    marginTop: 20,
    // padding:20,
    marginVertical: 10, 
    marginHorizontal: 20
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
    // marginHorizontal: 20
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
    fontSize: 12,
  },
  text1: {
    fontFamily: 'DMSans-Medium',
    fontSize: 17,
    color: 'black',
    // marginBottom: 'auto',
    marginBottom: 50,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  text2: {
    fontFamily: 'DMSans-Medium',
    fontSize: 22,
    color: 'black',
    marginBottom: 50,
    textAlign: 'left',
    alignSelf: 'flex-end',
  }
});