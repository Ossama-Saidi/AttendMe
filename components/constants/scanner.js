import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet ,Image,StatusBar} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import API_URL from '../../config';

const scanner = ({ username }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState('');
  
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScannedData({ type, data });
    setModalVisible(false);

    axios.post(`${API_URL}operationsEtudiant`, { 
      username: username,
      data: data
    })
    .then(response => {
      setNom(response.data[0].nom);
    })
    .catch (error => {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again later.');
      }
    });
  };

  const openScanner = () => {
    setScannedData(null);
    setModalVisible(true);
  };
  const closeScanner = () => {
    setScannedData(null);
    setModalVisible(false);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={openScanner}>
        <Image source={require('../../assets/icons/scan.png')} style={styles.icon} />
        {/* <Text style={styles.buttonText}>SCAN</Text> */}
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide" transparent={false}>
      <StatusBar backgroundColor="#F2F2F2" barStyle="light-content" />
        <View style={styles.modalContainer}>
          <BarCodeScanner
            style={styles.scanner}
            onBarCodeScanned={handleBarCodeScanned}
          />
          <TouchableOpacity style={styles.buttonc} onPress={closeScanner}>
            <Text style={styles.buttoncText}>Annuler</Text>
            {/* <Ionicons name="close-circle" size={36} color="#2256F2" /> */}
          </TouchableOpacity>
        </View>
      </Modal>

      {scannedData && (
        <View style={styles.infoContainer}>
          {/* <Text style={styles.infoText}>Type: {scannedData.type}</Text> */}
          {/* <Text style={styles.infoText}>Data: {scannedData.data}</Text> */}
          {error ? <Text style={styles.msgerror}>{error}</Text> : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  /**
   * button: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  
   */
  button: {
    // padding: 10,
    // backgroundColor: '#007AFF',
    // backgroundColor: '#2135A6',
    // backgroundColor: 'rgba(241, 196, 44, 0.8)',
    borderRadius: 5,
    // marginBottom: 20,
    // paddingVertical: 10,
    // paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#f2f2f2',
    width: 100,
    height: 40,
    // width: '50%',
    // height: 50,
  },
  buttonc: {
    // padding: 10,
    // backgroundColor: '#F1C42C',
    // borderRadius: 10,
    // marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    height: 50,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // buttonText: {
  //   fontSize: 18,
  //   fontFamily: 'DMSans-Medium',
  //   color: 'black',
  //   textAlign: 'center',
  // },
  buttoncText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2256F2',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding:1,
    borderRadius: 10,
    backgroundColor: '#F2F2F2'
  },
  scanner: {
    flex: 1,
    width: '200%',//surface
    height: '100%',//fait rien
    marginBottom: 1,
  },
  // imageBackground: {
  //   flex: 1,
  //   resizeMode: 'cover',
  //   justifyContent: 'center',
  // },
  icon: {
    // Add your icon styles here
    width: 54,
    height: 54,
  },
  infoContainer: {
    marginTop: 20,
  },
  infoText: {
    fontSize: 18,
  },
});

export default scanner;