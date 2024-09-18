//==============================================================================
//------------------------------------Bibliotheque------------------------------
//==============================================================================

import React,{ useState ,useEffect} from 'react';
import {
  Alert,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  // Image
} from 'react-native';
import { ImageBackground } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';
import axios from 'axios';
import * as Font from 'expo-font';
import { Input } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import API_URL from '../../config';

//==============================================================================
//------------------------------------PageLogin---------------------------------
//==============================================================================
export default function LoginPage({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const route = useRoute();
    const type = route.params.type; // Récupérer la valeur transmise
    const [hidePassword, setHidePassword] = useState(true);
    const [error, setError] = useState('');
    const [fontLoaded, setFontLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [isTimeout, setIsTimeout] = useState(false);


  //---------------------Logic Button Login-------------------------------------

  useEffect(() => {
    if (failedAttempts >= 7) {
      setIsTimeout(true);
      const timeout = setTimeout(() => {
        setIsTimeout(false);
        setFailedAttempts(0);
      }, 5 * 60 * 1000); // 5 minutes in milliseconds
  
      return () => clearTimeout(timeout);
    }
  }, [failedAttempts]);
const handleForgotPassword = async () => {
  
  // Alert.alert(
  //   'Réinitialiser mot de passe', 
  //   'Si vous avez oublié votre mot de passe, vous pouvez le réinitialiser en saisissant le code que vous avez reçu lorsque vous vous êtes connecté(e).', [
  //   [
  //     {
  //       text: 'OK',
  //       onPress: () => {

  //       },
  //     },
  //   ]
  // ]);
  navigation.navigate('ForgotPassword',{type: type})
}
const handleLogin = async () => {
  setIsLoading(true);
  if (isTimeout) {
    setError('Too many failed login attempts. Please try again later.');
    setIsLoading(false);
    return;
  }
  try {
    const response = await axios.post(`${API_URL}login`, { 
      type,
      username: username,
      password:  password
    });
    const data = response.data;
    if (data.success) {
      setFailedAttempts(0);
      const { user } = data;
      if (type === 'etudiant') {
              navigation.navigate('HomeEtud',{username: username ,type: type, userId: user.id_etudiant });
            } else if (type === 'professeur') {
              navigation.navigate('HomeProf',{username: username ,type: type, userId: user.id_prof });
            } else if (type === 'administrateur') {
              if (user.id_admin === 0){
                Alert.alert(`Remarquer que votre ID pour récupérer le mdp est ${user.id_admin}`);
                navigation.navigate('AdminGlobal',{username: username,type: type, userId: user.id_admin });
              } else {
                Alert.alert(`Remarquer que votre ID pour récupérer le mdp est ${user.id_admin}`);
              navigation.navigate('HomeAdmin',{username: username,type: type, userId: user.id_admin });
              }
            }
    } else {
      setFailedAttempts(failedAttempts + 1);
      setError(data.message);
    } 
  } catch (error) {
      // console.error(error);
      // Afficher un message d'erreur si la connexion a échoué
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again later.');
      }
       // Vérifier le nombre de tentatives de connexion échouées
      // if (error.response && error.response.data && error.response.data.message && error.response.data.failedAttempts >= 7) {
      //   setIsLoading(false); // Suspendre la fonction de connexion
      //   setTimeout(() => {
      //     setIsLoading(true); // Réactiver la fonction de connexion après 3 minutes
      //   }, 3 * 60 * 1000); // 3 minutes en millisecondes
      // }
    }  
  setIsLoading(false);
};


//------------------------Font Lobstar-Regular or Abel--------------------------

useEffect(() => {
  async function loadFonts() {
    try {
      await Font.loadAsync({
        'Lobster-Regular': require('../../assets/fonts/Lobster-Regular.ttf'),
        'Abel-Regular': require('../../assets/fonts/Abel-Regular.ttf'),
        'DMSans-Bold': require('../../assets/fonts/DMSans-Bold.ttf'),
        'DMSans-Medium': require('../../assets/fonts/DMSans-Medium.ttf'),
        'DMSans-Regular': require('../../assets/fonts/DMSans-Regular.ttf'),
        'TRTBold': require('../../assets/fonts/TRTBold.ttf'),
        'TRTBoldItalic': require('../../assets/fonts/TRTBoldItalic.ttf'),
        'TRTLight': require('../../assets/fonts/TRTLight.ttf'),
        'TRTLightItalic': require('../../assets/fonts/TRTLightItalic.ttf'),
        'TRTMedium': require('../../assets/fonts/TRTMedium.ttf'),
        'TRTMediumItalic': require('../../assets/fonts/TRTMediumItalic.ttf'),
        'TRTRegular': require('../../assets/fonts/TRTRegular.ttf'),
        'TRTRegularItalic': require('../../assets/fonts/TRTRegularItalic.ttf'),
      });
      setFontLoaded(true);
    } catch (error) {
      console.error(error);
      setError('An error occurred. Please try again later.');
    }
  }
  loadFonts();
}, []);
if (!fontLoaded) {
  return null; // or a loading screen
}

//--------------------------------Contenu-------------------------------------
  
return (
    <View style={styles.container}>
      {/* <ImageBackground
      source={require('../../assets/images/backWel.png')}
      style={styles.imageBackground}
      > */}
        <StatusBar backgroundColor="#1A1E26" barStyle="light-content" />
          {/* <View style={{flex: 1}}> */}
            <View style={styles.background}>
              <View style={styles.circle1} /> 
              <View>
                <TouchableOpacity style={styles.rightBtn} onPress={() => navigation.goBack()}>
                <View style={styles.row}>
                  <Ionicons name="arrow-back" size={30} color="#324359" />
                  {/* <Text style={styles.rightButtonText}>Précédent</Text> */}
                </View>
              </TouchableOpacity>
              </View>
              {/* <View style={styles.contentText}>
                <Text style={styles.text}>Connexion</Text>
              </View> */}
            </View>
            <View style={styles.loginContainer}>
              
              <View style={styles.contentText}>
                <Text style={styles.text}>Connexion</Text>
              </View>
              <Input 
                style={styles.input} 
                placeholder="Nom d'utilisateur" 
                //onChangeText={setUsername}
                //onChange={setUsername} faut
                onChangeText={text => setUsername(text)}
                value={username}
                autoCapitalize="none"
                rightIcon={{ type: 'font-awesome', name: 'user-o' }}
                />
              <Input 
                style={styles.input} 
                placeholder="Mot de passe" 
                secureTextEntry={hidePassword}
                onChangeText={text => setPassword(text)}
                //onChange={setPassword}
                value={password}
                rightIcon={{
                  type: 'font-awesome',
                  name: hidePassword ? 'eye-slash' : 'eye',
                  onPress: () => setHidePassword(!hidePassword)
                }}
                />
                <View style={styles.forgotPassword}>
                  <TouchableOpacity 
                    //style={styles.button}
                    onPress={handleForgotPassword}>
                    <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
                </TouchableOpacity>
                </View>
                {error ? <Text style={styles.msgerror}>{error}</Text> : null}
                
                <TouchableOpacity 
                style={styles.button} 
                onPress={handleLogin}
                //onPress={() => navigation.navigate('HomeEtud', {type: type })}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Se connecter</Text>
                )}
                </TouchableOpacity>
                <View style={styles.circle2} />
              {/* <View style={styles.circle3} /> */}
            </View>
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
              
              <TouchableOpacity onPress={() => navigation.navigate('ContactScreen', {type: type})}>
                <View style={styles.footer}>
                  <Text style={styles.footerText}>Contactez-nous</Text>
                  {/* <Ionicons name="alert-circle-outline" size={22} color="#262626" ></Ionicons> */}
                </View>
              </TouchableOpacity>
            </View>
          {/* </View> */}
    </View>
  );
}

//------------------------------Styles----------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 7,
    backgroundColor: 'white',
    // paddingHorizontal: '100%',
    justifyContent: 'center',
    // alignItems: 'center',
  },
  // imageBackground: {
  //   flex: 1,
  //   resizeMode: 'cover',
  //   justifyContent: 'center',
  // },
  background: {
    flex: 1,
    // justifyContent: 'center',
    // justifyContent: 'flex-end',
    // alignItems: 'center',
    // paddingBottom: 20,
    // backgroundColor: '#F2F2F2',
  },
  contentText: {
    // flex: 1,
    // justifyContent: 'flex-start',
    // alignItems: 'flex-end',
    // textAlign: 'left',
    // paddingBottom: 20,
    // backgroundColor: '#F2F2F2',
  },
  rightBtn: {
    alignSelf: 'flex-start',
    marginTop: 18,
    marginLeft: 18,
    // marginRight: 450,
    // backgroundColor: '#A3D4CC',
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 10,
      //borderWidth: 2,
      //borderColor: '#ccc',
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginVertical: 35 
  },
  // rightButtonText: {
  //   marginRight: 5,
  //   fontSize: 14,
  //   fontFamily: 'DMSans-Medium',
  //   color: '#262626',
  //   padding: 14,
  //   //textDecorationLine: 'underline',
  // },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginRight: 20,
    // marginLeft: 10,
  },
  circle1: {
    position: 'absolute',
    top: -250,
    left: -200,
    width: 350,
    height: 400,
    borderRadius: 180,
    backgroundColor: '#2256F2',
    opacity: 0.1,
    transform: [{ rotate: '-45deg' }],
  },
  /*logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },*/
  circle2: {
    position: 'absolute',
    top: 500,
    right: -200,
    width: 350,
    height: 240,
    borderRadius: 180,
    backgroundColor: '#2256F2',
    opacity: 0.1,
    transform: [{ rotate: '45deg' }],
  },
  circle3: {
    position: 'absolute',
    top: 400,
    left: 400,
    width: 350,
    height: 350,
    borderRadius: 90,
    backgroundColor: '#D9D7CC',
    opacity: 0.2,
    transform: [{ rotate: '45deg' }],
  },
  msgerror:{
    fontSize: 14,
    color: 'red',
    padding: 12,
    fontFamily: 'Abel-Regular',
  },
  text: {
    fontFamily: 'Lobster-Regular',
    // fontWeight: 'bold',
    fontSize: 35,
    color: '#324359',
    marginBottom: 40,
  },
  loginContainer: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: '90%',
    //height: 50,
    //borderWidth: 1,
    //borderColor: 'gray',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    //fontFamily: 'Abel-Regular',
  },
  button: {
    width: '90%',
    height: 50,
    backgroundColor: '#2256F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 15,
    //padding: 8,  
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'DMSans-Medium',
    color: 'white',
    textAlign: 'center',
  },
  forgotPassword: {
    marginBottom: 30,
    alignItems: 'flex-end',
    // justifyContent: 'flex-end',
  },
  forgotPasswordText: {
    color: '#324359',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
    // textDecorationLine: 'underline'
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    padding: 10
  },
  footerText: {
    fontSize: 17,
    color: '#324359',
    marginRight: 14,
    // fontFamily: 'Lobster-Regular',
    // color: 'blue',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
    // textDecorationLine: 'underline'
  },
});
//-------------------------------------FIN------------------------------------------
//==================================================================================