import React, { useState, useEffect ,useRef} from 'react';
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
  TextInput
} from 'react-native';
import { ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import {useRoute} from '@react-navigation/native';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import API_URL from '../../../config';
import Scanner from '../../constants/scanner';
import SearchBar from '../../constants/SearchBar';
import CloseButton from '../../constants/CloseButton';
import * as Font from 'expo-font';

const { width ,height} = Dimensions.get('window');

export default function HomeEtud() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [nom, setNom] = useState('');
  const [idEtudiant, setIdEtudiant] = useState('');
  const [semestre, setSemestre] = useState('');
  const [filiere, setFiliere] = useState('');
  const [prenom, setPrenom] = useState('');
  const [apoge, setApoge] = useState('');

  const [date, setDate] = useState('');
  const [timedebut, setTimeDebut] = useState('');
  const [timefin, setTimeFin] = useState('');
  const [module, setModule] = useState('');
  const [typeseance, setTypeSeance] = useState('');
  const [enseignant, setEnseignant] = useState('');
  const [salle, setSalle] = useState('');

  // const [nomModule, setNomModule] = useState('');
  const [error1, setError1] = useState('');

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [text, setText] = useState('Not yet scanned');
  
  const [fontLoaded, setFontLoaded] = useState(false);
  const [error, setError] = useState('');

  const navigation = useNavigation();

  // const route = useRoute();
  // const type = route.params.type;
  // const username = route.params.username;
  const type = "etudiant";
  const username = 2001663;

//---------Data Client
  axios.get(`${API_URL}donneesetud/${username}`,{
    params: {
      username: username
    }
  })
    .then(response => {
      setNom(response.data[0].nom);
      setIdEtudiant(response.data[0].id_etudiant)
      setApoge(response.data[0].numero_apoge)
      setFiliere(response.data[0].filiere)
      setPrenom(response.data[0].prenom)
      setSemestre(response.data[0].semestre)
    })
    .catch(error => {
      console.error(error);
    });
//---------Data Seance
  axios.get(`${API_URL}seance/${username}`,{
    params: {
      username: username
    }
  })
    .then(response => {
      setDate(response.data[0].date_seance)
      setTimeDebut(response.data[0].heure_debut)
      setTimeFin(response.data[0].heure_fin)
      setModule(response.data[0].module)
      setTypeSeance(response.data[0].type_seance)
      setEnseignant(response.data[0].enseignant)
      setSalle(response.data[0].salle)
    })
    .catch(error => {
      console.error(error);
    });
//----------Data Presence
const [showForm, setShowForm] = useState(false);
const [tab1Data, setTab1Data] = useState([]);

//---------
  const handleSearch = (selectedKeyword) => {
    console.log('Recherche:', selectedKeyword);
    // Logique de recherche :
    // setIsLoading(true);
    setShowForm(true);
    axios.get(`${API_URL}listpresencetud/${selectedKeyword}/${username}`,{
      params: {
        username: username,
        selectedKeyword: selectedKeyword
      }
    })
    .then(response => {
      setTab1Data(response.data);
      // setIsLoading(false);
    })
    .catch(error => {
      if (error.response && error.response.data && error.response.data.message) {
        setError1(error.response.data.message);
      } else {
        setError1('An error occurred. Please try again later.');
      }
      // setIsLoading(false);
    });
  };
  const handleClose = (setSelectedKeyword) => {
    setSelectedKeyword('');
    setShowForm(false);
    setError1('');
  };
//----------------------------------------
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
  const ResetPassword = () => {
    toggleModal();
    navigation.navigate('ResetPassword', {type: type ,username :username});
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
              ID: {idEtudiant} ,{'\n'}Votre ID pour récuperer le mdp{'\n\n'}
              Username: {apoge}{'\n'}
              Nom: {nom}{'\n'}
              Prénom: {prenom}{'\n'}
              Semestre: {semestre}{'\n'}
              Filière: {filiere}
            </Text>
          </View>
        );
      } else {
        return null;
      }
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
          'ChrustyRock': require('../../../assets/fonts/ChrustyRock-ORLA.ttf'),
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
    
    <SafeAreaView style={styles.container} {...panResponder.panHandlers}>
      <ImageBackground
          source={require('../../../assets/images/backE.jpg')}
          style={styles.imageBackground}
      >
      <StatusBar backgroundColor="white" barStyle="light-content" />
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleModal}>
          <Ionicons name="ios-menu" size={36} color="black" />
        </TouchableOpacity>
        <Modal isVisible={isModalVisible} style={styles.modal} onBackdropPress={toggleModal} >
        <View style={styles.menuContainer}>
        <TouchableOpacity style={{alignItems: 'flex-end',backgroundColor: '#F2F2F2',paddingVertical: 1}} onPress={handleMenuClose}>
          <View style={styles.row}>
            <Ionicons name="close-circle" size={24} color="#191D3A" />
            </View>
            </TouchableOpacity>
            <View style={styles.scontainer}>
              <Text style={styles.title}>Bienvenu</Text>
              <View style={styles.accountInfo}>
                <Text style={styles.email}>Mr(s).{nom} {prenom}</Text>
                {/* <Text style={styles.username}>With ID: "{idEtudiant}"</Text> */}
            </View>
            {/* <View style={{ height: 20 }} /> */}
          </View>
          <View style={{ height: 30 }} />
          <TouchableOpacity style={styles.modalButton} onPress={ResetPassword}>
          <View style={styles.row}>
            <Ionicons name="lock-closed" size={20} color="#191D3A" />
            <Text style={styles.modalButtonText}>Modifier le mot de passe</Text>
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.modalButton} onPress={ResetPassword}>
          <View style={styles.row}>
            <Ionicons name="stats-chart" size={20} color="#191D3A" />
            <Text style={styles.modalButtonText}>Statistiques</Text>
            </View>
          </TouchableOpacity> */}
            <TouchableOpacity style={styles.modalButton} onPress={Logout}>
              <View style={styles.row}>
                <Ionicons name="log-out-outline" size={24} color="#191D3A" />
                <Text style={styles.modalButtonText}>Déconnecter</Text>
              </View>
            </TouchableOpacity>
        </View>
        </Modal>
        <TouchableOpacity onPress={toggleProfile}>
          {/* <Ionicons name="information-circle" size={36} color="#191D3A" /> */}
          <Text style={{ fontFamily: 'TRTBold', color: 'black',fontSize: 26 }}>Profil</Text>
        </TouchableOpacity>
      </View>
      <View style={{pading: 50}}>      
        {renderProfile()}
      </View>
      <ScrollView>

      <View style={styles.content}>
        <View style={{padding:20}}>
        <View style={{/*backgroundColor: '#0D0D0D',*/ justifyContent: 'flex-end',backgroundColor: 'rgba(255, 255, 255, 0.4)',borderRadius: 180,padding: 1}}>
            <Text style={[styles.heading, { fontSize: 44, paddingVertical: 55 , color :'black' }]}>
              Bienvenu {'\n'}Mr(s).{nom}
            </Text>
        </View>
        </View>
        <View style={{backgroundColor: "#EEF280"/*"rgba(1, 166, 85, 0.92)"pour #01A655*/, borderRadius: 35, justifyContent: "center", padding: 25, marginVertical: 10, marginHorizontal: 10}}>
          <Text style={[styles.heading, {color: '#0D0D0D', fontSize: 36, /*fontFamily: 'ChrustyRock',backgroundColor: 'rgba(1, 166, 85, 0.92)', borderWidth: 1,borderRadius: 25, borderColor: '#01A655', padding: 0*/}]}>
             {module}
          </Text>
          <View style={styles.row}>
            <Text style={styles.subheading}>Type</Text>
            <Text style={styles.subheading}>{typeseance}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subheading}>Date</Text>
            <Text style={styles.subheading}>{date}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subheading}>Début</Text>
            <Text style={styles.subheading}>{timedebut}</Text>
          </View>
          <View style={styles.row}>      
            <Text style={styles.subheading}>Fin</Text>
            <Text style={styles.subheading}>{timefin}</Text>
          </View>
          <View style={styles.row}>      
            <Text style={styles.subheading}>L'enseignant</Text>
            <Text style={styles.subheading}>{enseignant}</Text>
          </View>
          <View style={styles.row}>      
            <Text style={styles.subheading}>Salle</Text>
            <Text style={styles.subheading}>{salle}</Text>
          </View>
          <View style={{justifyContent: 'center'}}>
            <Scanner username={username}/>
          </View>
        </View>
        <View style={{backgroundColor: "#CEF2E1"/*"rgba(241, 196, 44, 0.92)"*/, borderRadius: 25, /*justifyContent: "center",*/ padding: 29, marginVertical: 10, marginHorizontal: 10}}>
          <Text style={[styles.heading, {color: 'black', fontSize: 36, fontFamily: 'DMSans-Bold',textAlign: 'center',/*backgroundColor: 'rgba(241, 196, 44, 0.92)', borderWidth: 1,borderRadius: 25, borderColor: '#F1C42C',*/ padding: 0}]}>
          Statistiques de Présence
          </Text>
          <Text style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: 'black',
                        marginBottom: 10}}
          >
            Tapez le nom du module :
          </Text>
          <View style={{flex: 1}}>
            <View style={styles.formContainer}>
              <SearchBar username={username} onSearch={handleSearch} onClose={handleClose} />
                    {error1 ? <Text style={styles.msgerror}>{error1}</Text> : null}
                    {showForm && (
                      <View style={styles.presentInfo}>
                        <ScrollView showHorizontalScrollIndicateur={false} horizontal={true}>
                            <View style={[styles.row,{justifyContent: "flex-start", marginBottom: 8}]}>
                              <View style={{marginVertical: 40,marginHorizontal:20}}>
                                <Text style={{
                                flex: 1,
                                fontWeight: 'bold',
                                color: 'black',
                                fontSize: 18,
                                marginBottom: 10,
                                marginRight: 5,
                                marginLeft: 5}}>Type</Text>
                                {tab1Data.map(item => (                  
                                    <Text style={styles.text1} key={item.id_attendance}>{item.type}</Text>
                                ))}
                              </View>
                              <View style={{marginVertical: 40,marginHorizontal:20}}>
                                <Text style={{
                                flex: 1,
                                fontWeight: 'bold',
                                color: 'black',
                                fontSize: 18,
                                marginBottom: 10,
                                marginRight: 5,
                                marginLeft: 5}}>Enseignant</Text>
                                {tab1Data.map(item => (
                                    <Text style={styles.text1} key={item.id_attendance}>{item.enseignant}</Text>
                                ))}
                              </View>                      
                              <View style={{marginVertical: 40,marginHorizontal:20}}>
                                <Text style={{
                                flex: 1,
                                fontWeight: 'bold',
                                color: 'black',
                                fontSize: 18,
                                marginBottom: 10,
                                marginRight: 5,
                                marginLeft: 5}}>Date</Text>
                                {tab1Data.map(item => (
                                    <Text style={styles.text1} key={item.id_attendance}>{item.date_attendance}</Text>
                                ))}
                              </View>                    
                              <View style={{marginVertical: 40,marginHorizontal:20}}>
                                <Text style={{
                                flex: 1,
                                fontWeight: 'bold',
                                color: 'black',
                                fontSize: 18,
                                marginBottom: 10,
                                marginRight: 5,
                                marginLeft: 5}}>Heure</Text>
                                {tab1Data.map(item => (
                                    <Text style={styles.text1} key={item.id_attendance}>{item.time_attendance}</Text>
                                ))}
                              </View>
                              <View style={{marginVertical: 40,marginHorizontal:20}}>
                                <Text style={{
                                flex: 1,
                                fontWeight: 'bold',
                                color: 'black',
                                fontSize: 18,
                                marginBottom: 10,
                                marginRight: 5,
                                marginLeft: 5}}>Etat</Text>
                                {tab1Data.map(item => (
                                    <Text style={styles.text1} key={item.id_attendance}>{item.present}</Text>
                                ))}
                              </View>
                            </View>
                        </ScrollView>
                      </View>
                  )}
                </View>
            </View>          
        </View>
      </View>
    </ScrollView>
    </ImageBackground>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#0D0D0D',
    // padding: 5
  },
  presentInfo: {
    marginBottom: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    // backgroundColor: '#446FF2',
    backgroundColor: 'rgba(255, 255, 255, 0.88)', // Couleur de fond floue avec transparence
    // backdropFilter: 'blur(10px)',
    // backgroundColor: '#D9D9D9',
    borderRadius: 15,
    padding: 4,
  },
  profileContainer: {
    // backgroundColor: '#D9D9D9',
    backgroundColor: '#CEF2E1',
    // backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
    color: 'black',
    // marginRight: 'auto',
    marginBottom: 1,
  },
  text1: {
    fontFamily: 'TRTMedium',
    fontSize: 14,
    color: 'black',
    // marginBottom: 'auto',
    marginBottom: 10,
    textAlign: 'left',
    // alignSelf: 'flex-start',
    marginRight: 5,
    marginLeft: 5
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  modal: {
    width: width / 1.6,
    height: height,
    margin: 0,
    position: 'absolute',
    left: 0,
  },
  menuContainer: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    padding: 36,
    //justifyContent: 'center',
  },
  scontainer: {
    width: width / 2.8,
    padding: 6,
    borderBottomWidth: 1.3,
    borderBottomColor: 'black',
    position: 'relative',
  },
  title: {
    fontSize: 19,
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
    fontSize: 15,
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 1
  },
  label:{
    textAlign: 'left',
    fontFamily: 'TRTMedium',
    fontSize: 18,
    color: 'black',
    marginRight: 'auto',
    marginBottom: 1,
  },
  msgerror:{
    fontSize: 14,
    color: 'red',
    padding: 12,
    fontFamily: 'Abel-Regular',
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
  content: {
    // flex: 1,
    // justifyContent: 'space-between',
    // backgroundColor: '#262626',
    // padding:20
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
    fontSize: 19,
    color: '#0D0D0D',
    fontFamily: 'DMSans-Bold',
  },
  bottomBar: {
    height: 64,
    // backgroundColor: '#F29F05',
    // borderTopWidth: 1,
    // borderTopColor: '#F29F05',
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
  },
  
  // addButton1: {
  //   backgroundColor: '#262626',
  //   borderRadius: 20,
  //   paddingHorizontal: 20,
  //   paddingVertical: 10,
  //   marginHorizontal: 20
  // },
  addButton2: {
    // backgroundColor: '#262626',
    // backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  }
});  