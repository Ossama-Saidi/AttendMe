import * as React from "react";
import { useState ,useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import { 
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    // Image,
    StatusBar,
    SafeAreaView
    } from 'react-native';
// import { ImageBackground } from 'react-native';

import * as Font from 'expo-font';
// import { icons } from "../../constants";
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

export default function Welcome() {
    const [fontLoaded, setFontLoaded] = useState(false);
    const navigation = useNavigation();
    const [type, setType] = useState('etudiant');
    const [error, setError] = useState('');

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

  return (
  
      <View style={styles.container}>
        <StatusBar backgroundColor="#F4FFFC" barStyle="light-content" />
        <View style={styles.background}>
          <ImageBackground
            source={require('../../assets/images/20770268_Sandy_Bus-43_Single-12.jpg')}
            style={styles.imageBackground}
            >
            {/* <View style={styles.circle1} />  */}
            {/* <View style={{ height: 60 }} /> */}
              {/* <Text style={styles.text1}>Welcome to</Text> */}
            <Text style={styles.text2}>AttendMe</Text>
            <Text style={styles.subheading}>Avec AttendMe, enregistrez les données de présence en temps réel.</Text>
          </ImageBackground>
        </View>
        <View style={styles.welcomeContainer}>
          <View style={styles.cadre}>
            {/* <View> */}
              <View style={styles.circle2} />
              <Text style={styles.subtext} >Veuillez sélectionner votre rôle</Text>
              <Picker 
                enabled={true} 
                mode={'dropdown'}
                selectedValue={type}
                onValueChange={(itemValue) => setType(itemValue)}
              >
                <Picker.Item label="Etudiant" value="etudiant" />
                <Picker.Item label="Enseignant" value="professeur" />
                <Picker.Item label="Administrateur" value="administrateur" />
              </Picker>
              {/* <View style={{ height: 40 }} /> */}
            {/* </View> */}
            {/* <View> */}
              <TouchableOpacity style={styles.rightBtn} onPress={() => navigation.navigate('Login', {type: type})}>
                <View style={styles.row}>
                  {/*  */}
                  <Text style={styles.rightButtonText}>Suivant</Text>
                  {/* <Ionicons name="arrow-forward" size={20} color="#324359" /> */}
                </View>
              </TouchableOpacity>
            {/* </View> */}
          </View>
        </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Created By idealDev  &copy; 2023</Text>
      </View>
      </View>
  );
}

const styles = StyleSheet.create({
    container: {
        //margin: 0,
        flex: 1,
        backgroundColor: '#F4FFFC',
        padding: 1,
      },
      imageBackground: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
      },
      background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#C8C2F2',
        //top: 10,
        marginTop: 100,
        //paddingHorizontal: 10,
        padding: 1, // Padding inside the container
      },
      cadre: {
        // flex: 1,
        // marginBottom: 10,
        // justifyContent: 'flex-end',
        // alignItems: 'flex-start',
        // backgroundColor: '#446FF2',
        backgroundColor: 'rgba(193, 233, 83, 0.1)', // Couleur de fond floue avec transparence
        // backdropFilter: 'blur(10px)',
        // backgroundColor: '#C3E956',
        borderRadius: 70,
        padding: 45,
      },
      circle1: {
        position: 'absolute',
        top: -250,
        left: -200,
        width: 350,
        height: 400,
        borderRadius: 180,
        backgroundColor: '#F2EA7E',
        opacity: 0.2,
        transform: [{ rotate: '-45deg' }],
      },
      circle2: {
        position: 'absolute',
        top: 350,
        right: -50,
        // left: -50,
        width: 400,
        height: 400,
        borderRadius: 120,
        backgroundColor: '#C3E956',
        opacity: 0.15,
        transform: [{ rotate: '45deg' }],
      },
      circle3: {
        position: 'absolute',
        top: -5,
        left: 120,
        width: 350,
        height: 370,
        borderRadius: 90,
        backgroundColor: '#D9B4A7',
        opacity: 0.08,
        transform: [{ rotate: '65deg' }],
      },
      text2: {
        fontFamily: 'Lobster-Regular',
        fontSize: 96,
        color: '#282828',
        marginBottom: 1,
        textAlign: 'center',
        alignSelf: 'center',
      },
      subtext: {
        //fontWeight: 'bold',
        fontFamily: 'Lobster-Regular',
        fontSize: 24,
        color: '#282828',
        marginBottom: 1,
      },
      subheading:{
        fontFamily: 'Lobster-Regular',
        fontSize: 16,
        color: '#282828',
        marginBottom: 1,
        textAlign: 'left',
        alignSelf: 'center',
      },
      welcomeContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#C8C2F2'
      },
      input: {
        width: '100%',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
      },
      rightBtn: {
        //alignSelf: 'flex-start',
        marginTop: 'auto',
        // marginLeft: 'auto',
        // backgroundColor: '#A3A64B',
        borderRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 10,
          //borderWidth: 2,
          //borderColor: '#ccc',
        justifyContent: "center",
        alignItems: "center",
      },
      row: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      rightButtonText: {
        // marginRight: 'auto',
        // marginBottom: 'auto',
        fontSize: 26,
        fontFamily: 'DMSans-Medium',
        color: '#282828',
        padding: 10,
        textAlign: 'center',
        alignSelf: 'center',
        //textDecorationLine: 'underline',
      },
      footer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
      },
      footerText: {
        fontSize: 12,
        color: '#888',
        // fontWeight: 'bold',
        fontFamily: 'Lobster-Regular',
      },
});