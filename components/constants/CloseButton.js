import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CloseButton = ({ onPress }) => {
  const close = () => {
    onPress(setNomModule);
  }
  return (
    <TouchableOpacity style={styles.container} onPress={close}>
      <Ionicons name="close-circle" size={36} color="#252625" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 2,
  },
});

export default CloseButton;