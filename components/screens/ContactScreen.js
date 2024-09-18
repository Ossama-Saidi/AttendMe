import React, { useState, useEffect } from 'react';
import {  TouchableOpacity, StatusBar,  View, Text, StyleSheet } from 'react-native';
import { ImageBackground } from 'react-native';

import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';

export default function ContactScreen() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const type = route.params.type;

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
  return (
    <ImageBackground
      source={require('../../assets/images/contactscreen.png')}
      style={styles.imageBackground}
      >
      <View style={styles.container}>
        <StatusBar backgroundColor="#517339" barStyle="light-content" />
        <View style={styles.souscontainer}>
          {/* <Text style={styles.title}>Contactez notre équipe</Text> */}
          <View style={styles.contactInfo}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.text}>team.idealdev@outlook.com</Text>
            {/* </View> */}
            {/* <View style={styles.contactInfo}> */}
            <Text style={styles.label}>Téléphone:</Text>
            <Text style={styles.text}>123-456-7890</Text>
            {/* </View> */}
            {/* <View style={styles.contactInfo}> */}
            <Text style={styles.label}>Adresse:</Text>
            <Text style={styles.text}>Faculté des sciences, Oujda, Maroc</Text>
          </View>
        </View>
        <View style={{flex: 1}}>
          <TouchableOpacity style={styles.rightBtn} onPress={() => navigation.navigate('Login', {type: type})}>
            {/* <View style={styles.row}> */}
              <Ionicons name="arrow-back" size={20} color="white" />
            {/* </View> */}
          </TouchableOpacity>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Created By idealDev  &copy; 2023</Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 10,
    // backgroundColor: '#F2F2F2',
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'contain',
    justifyContent: 'center',
  },
  souscontainer: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    // backgroundColor: '#F2F2F2',
  },
  rightBtn: {
    //alignSelf: 'flex-start',
    marginTop: 30,
    marginLeft: 1,
    marginRight:1,
    backgroundColor: '#517339',
    borderRadius: 350,
    paddingVertical: 10,
    paddingHorizontal: 10,
      //borderWidth: 2,
      //borderColor: '#ccc',
    justifyContent: "center",
    alignItems: "center",
    // marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 50,
    color: 'white',
    fontFamily: 'Lobster-Regular',
    textAlign: "center",
    // fontFamily: 'Lobster-Regular',
    marginBottom: 20,
  },
  contactInfo: {
    marginBottom: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    // backgroundColor: '#446FF2',
    backgroundColor: 'rgba(255, 255, 255, 0.88)', // Couleur de fond floue avec transparence
    // backdropFilter: 'blur(10px)',
    // backgroundColor: '#D9D9D9',
    borderRadius: 70,
    padding: 45,
  },
  label: {
    textAlign: 'left',
    fontSize: 20,
    color: '#262626',
    // fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'DMSans-Bold',
  },
  text: {
    fontSize: 18,
    marginBottom: 16,
    fontFamily: 'Abel-Regular',
    color: '#666',
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    // color: '#888',
    color: 'white',
    // fontWeight: 'bold',
    fontFamily: 'Lobster-Regular',
  },
});