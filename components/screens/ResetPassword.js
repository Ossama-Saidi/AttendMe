import React,{ useState ,useEffect} from 'react';
import {
  Alert,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { ImageBackground } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';
import axios from 'axios';
import * as Font from 'expo-font';
import { Input } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import API_URL from '../../config';

export default function ResetPassword( ) {
  const route = useRoute();
  const type = route.params.type; // Récupérer la valeur transmise
  const name = route.params.username;

  // const toggleModal = route.params.toggleModal;
  const [username, setUsername] = useState('');
  const [identifierCode, setIdentifierCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack({ type: type, username: name });
  }
  const handleReset = async () => {
    // event.preventDefault();
    setIsLoading(true);

    // Check that the username and identifier code are not empty
    if (!username || !identifierCode || !confirmPassword || !password) {
      setError('Veuillez fournir toutes les informations requises .');
      setIsLoading(false);
      return;
    }
    if(password !== confirmPassword){
      setError('Password incorrect !');
      setIsLoading(false);
      return;
    }
  // Check that the password meets the requirements
  // if (!password || password.length < 10 || !password.match(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{10,}$/)) {
  //   setError('Please enter a password that is at least 10 characters long and contains at least one letter and one number.');
  //   setIsLoading(false);
  //   return;
  // }

    try {
      const response = await axios.post(`${API_URL}ResetPassword`, { 
        type,
        username,
        identifierCode,
        password,
      });
      const data = response.data;
      if (data.success) {
        Alert.alert('Modifier avec success', '', [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to Home screen
              // navigation.goBack();
            },
          },
        ]);
        navigation.goBack({ type: type, username: name });
        // navigation.navigate('HomeAdmin',{username: username});
      } else {
        setError(data.message);
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
        // console.error(error);
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
    <SafeAreaView style={styles.container}>
      {/* <ScrollView> */}
        <StatusBar backgroundColor="white" barStyle="light-content" />
        <View style={styles.topBar}>
          <View style={styles.circle1} />
          <TouchableOpacity onPress={handleGoBack}>
          <View style={styles.row}>
            <Ionicons name="arrow-back" size={30} color="#1A1E26" />
            {/* <Text style={styles.backButtonText}></Text> */}
          </View>
          </TouchableOpacity>
          <Text style={styles.text}>Modifier mot de passe</Text>
        </View>
        <View style={styles.background}>
          <Text style={styles.label}>
          Veuillez entrer votre username ou votre numéro apogée et votre ID pour trouver votre compte afin de réinitialiser votre mot de passe.
          </Text>
        </View>
        <View style={styles.ResetContainer}>
        <Input
          style={styles.input}
          placeholder="Username ou numéro apogée" 
          value={username}
          onChangeText={text => setUsername(text)}
          //onChange={(event) => setUsername(event.target.value)}
          autoCapitalize="none"
          rightIcon={{ type: 'font-awesome', name: 'user-o' }}
        />
        <Input
          style={styles.input}
          placeholder="ID code"
          //onChange={(event) => setIdentifierCode(event.target.value)}
          value={identifierCode}
          onChangeText={text => setIdentifierCode(text)}
          autoCapitalize="none"
          rightIcon={{ type: 'font-awesome', name: 'user-o' }}
        />
        <Input 
           style={styles.input} 
           placeholder="Mot de passe" 
           secureTextEntry={hidePassword}
           onChangeText={text => setPassword(text)}
           //onChange={(event) => setPassword(event.target.value)}
           value={password}
           rightIcon={{
            type: 'font-awesome',
            name: hidePassword ? 'eye-slash' : 'eye',
            onPress: () => setHidePassword(!hidePassword)
           }}
          />
          <Input 
           style={styles.input} 
           placeholder="Confirmez le mot de passe" 
           secureTextEntry={hidePassword}
           onChangeText={text => setConfirmPassword(text)}
           //onChange={(event) => setConfirmPassword(event.target.value)}
           value={confirmPassword}
           rightIcon={{
            type: 'font-awesome',
            name: hidePassword ? 'eye-slash' : 'eye',
            onPress: () => setHidePassword(!hidePassword)
           }}
          />
        {error ? <Text style={styles.msgerror}>{error}</Text> : null}
        {/* <View style={{ height: 50 }} /> */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleReset}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Envoyer</Text>
          )}
        </TouchableOpacity>
      </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        // padding: 10
      },
      // imageBackground: {
      //   flex: 1,
      //   resizeMode: 'cover',
      //   justifyContent: 'center',
      // },
      background: {
          // flex: 5,
          alignItems: 'flex-start',
          // backgroundColor: 'rgba(255, 255, 255, 0.01)',
          // flexDirection: 'row',
          padding: 24,
          justifyContent: 'flex-end',
          paddingVertical: 50
      },
      topBar: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 70,
        // backgroundColor: '#262626',
        // borderBottomWidth: 1,
        // borderBottomColor: '#262626',
        paddingHorizontal: 16,
      },
      circle1: {
        position: 'absolute',
        top: 740,
        left: -180,
        width: 350,
        height: 240,
        borderRadius: 180,
        backgroundColor: '#2256F2',
        opacity: 0.1,
        transform: [{ rotate: '-45deg' }],
      },
      circle2: {
        position: 'absolute',
        top: -50,
        left: 100,
        width: 350,
        height: 350,
        borderRadius: 90,
        backgroundColor: '#D9D7CC',
        opacity: 0.2,
        transform: [{ rotate: '45deg' }],
      },
      circle3: {
        position: 'absolute',
        top: 750,
        left: 450,
        width: 350,
        height: 350,
        borderRadius: 90,
        backgroundColor: '#D9D7CC',
        opacity: 0.1,
        transform: [{ rotate: '45deg' }],
      },
      msgerror:{
        fontSize: 14,
        color: 'red',
        padding: 12,
        fontFamily: 'Abel-Regular',
      },
      text: {
        textAlign: 'center',
        fontFamily: 'DMSans-Medium',
        fontSize: 17,
        color: '#1A1E26',
        marginBottom: 1,
      },
      label:{
        textAlign: 'center',
        fontFamily: 'DMSans-Bold',
        fontSize: 16,
        color: '#252625',
        marginBottom: 1,
      },
      ResetContainer: {
        // flex: 11,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
      },
      input: {
        width: '80%',
        height: 30,
        //borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
        fontFamily: 'Abel-Regular',
      },
      button: {
        width: '80%',
        height: 50,
        backgroundColor: '#2256F2',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 30,
        marginBottom: 20,
        borderRadius: 15,
        //padding: 8,  
      },
      buttonText: {
        fontSize: 17,
        fontFamily: 'DMSans-Medium',
        color: 'white',
        textAlign: 'center',
      },
      row: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      backButtonText: {
        marginRight: 130,
        fontSize: 17,
        fontFamily: 'DMSans-Medium',
        color: 'black',
        padding: 10,
        //textDecorationLine: 'underline',
      }
});