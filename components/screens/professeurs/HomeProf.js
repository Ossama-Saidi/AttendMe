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
  SafeAreaView
 } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');
// import QRCodeGenerator, { saveQRCode } from '../../methodes/QRCodeGenerator';
import { ScrollView } from 'react-native-gesture-handler';
import * as Font from 'expo-font';
import QRCode from 'react-native-qrcode-svg';
import API_URL from '../../../config';

export default function HomeProf() {

  const route = useRoute();
  // const type = "cours";
  // const date_seance = "2023-05-13";
  // const heure_debut = "00:00:00";
  // const heure_fin = "23:00:00";
  // const numero_semaine = "6";
  // const module = "php";

  const username = route.params.username;
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation();
  // const [qrCode, setQRCode] = useState('true');

  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeValue, setQRCodeValue] = useState('');
  const qrCode = `seance_80161_code_80161_cours_php`;
  

  const handleButtonPress = async () => {
    // Logic to handle button press
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}operationsProfesseur`, { 
          type : 'cours',
          date_seance : '2023-05-13',
          heure_debut : '00:00:00',
          heure_fin : '23:00:00',
          numero_semaine : '6',
          module : 'php',
          username
      })
      .then(function (response) {
        // Extract the qrCodeText value from the response
        // setQRCode(response.data.qrCode);
        setQRCodeValue(response.data.qrCode);
        setShowQRCode(true);
        // Use the qrCodeText value in your code
        // For example, if you're using React with the react-qr-code library
       Alert.alert('bien')
      })
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
}
//   const panResponder = useRef(
//     PanResponder.create({
//       onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
//         const { dx, dy } = gestureState;
//         // Check if the user has dragged from left to right
//         return dx > 50 && Math.abs(dy) < 50;
//       },
//       onPanResponderRelease: (evt, gestureState) => {
//         const { dx, dy } = gestureState;
//         // If the user has dragged from left to right, open the modal
//         if (dx > 50 && Math.abs(dy) < 50) {
//           setModalVisible(true);
//         }
//       },
//     })
//   ).current;
//   /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*/
//   //-----------------------------------------------
//   const toggleModal = () => {
//     setModalVisible(!isModalVisible);
//   };
//   const handleMenuClose = () => {
//     toggleModal();
//   };
//   //-----------------------------------------------
//   /*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=*//*, toggleModal: toggleModal */
//     const ResetPassword = () => {
//     navigation.navigate('ResetPassword', { type: type ,username :username});
//     }
//   const Logout = () => {
//     // const navigation = useNavigation();

//     // Perform any necessary actions, such as clearing session data
//     //import { AsyncStorage } from 'react-native';
//     //or : AsyncStorage.clear();
//     // Clear session data from AsyncStorage
//     //AsyncStorage.removeItem('authToken');
//     // Navigate to the login screen
//     navigation.navigate('Welcome');
//   }
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

    <View style={styles.container}>
      <StatusBar backgroundColor="#A7BF4E" barStyle="light-content" />
        <TouchableOpacity  onPress={handleButtonPress}>
          <Ionicons name="ios-add" size={32} color="#191D3A" />
        </TouchableOpacity>
        <View>
          <QRCode value={qrCode} />
        </View>
      
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    padding: 5
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
    fontSize: 12,
  },
  modalButton: {
    padding: 1,
    backgroundColor: '#F2F2F2',
    paddingVertical: 30,
    borderRadius: 29,
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalButtonText: {
    marginRight: 20,
    marginLeft: 15,
    color: '#344035',
    fontSize: 16,
    fontFamily: 'DMSans-Medium',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 64,
    backgroundColor: '#F2F2F2',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    paddingHorizontal: 16,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 1,
  },
  content: {
    // flex: 1,
    backgroundColor: '#F2F2F2'
  },
  treeButton: {
    height: 60,
    width: 110,
    padding: 10,
    paddingHorizontal: 16,
    backgroundColor: '#D3F263',
    paddingVertical: 20,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 150,
    marginRight: 20,
  },
  treeButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0D0D0D',
  },
  heading: {
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




  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subheading: {
    fontSize: 16,
    color: '#666',
  },
  bottomBar: {
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
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
});