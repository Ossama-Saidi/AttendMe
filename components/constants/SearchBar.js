import React, {useState, useEffect} from 'react';
import { View, TextInput, TouchableOpacity,Text , StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import API_URL from '../../config';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const SearchBar = ({ username, onSearch , onClose }) => {
  const [selectedKeyword, setSelectedKeyword] = React.useState('');
  // console.log(username);

  const handleSearch = () => {
    onSearch(selectedKeyword);
  };
  const handleClose = () => {
    onClose(setSelectedKeyword);
  }
  // const predefinedKeywords = [
  //   "Keyword 1",
  //   "Keyword 2",
  //   "Keyword 3",
  //   // Add more keywords as needed
  // ];
  const [predefinedKeywords, setPredefinedKeywords] = useState([]);

    useEffect(() => {
      axios.get(`${API_URL}getKeywords/${username}`,{
        params: {
          username: username,
        }
      }) // Replace with your actual API endpoint
        .then(response => {
          setPredefinedKeywords(response.data.keywords);
        })
        .catch(error => {
          console.error('Error fetching keywords:', error);
        });
    }, []);

  return (
    <View>
      <View style={styles.container}>
        {/* <TextInput
          style={styles.input}
          placeholder="Tapez ici"
          onChangeText={setNomModule}
          value={nomModule}
        /> */}
        <Picker
          style={styles.input}
          selectedValue={selectedKeyword}
          onValueChange={(value) => setSelectedKeyword(value)}
        >
          <Picker.Item label="Select a keyword" value="" />
          {predefinedKeywords.map((keyword, index) => (
          <Picker.Item key={index} label={keyword} value={keyword} />
          ))}
        </Picker>
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Rechercher</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.addButton2} onPress={handleClose}>
        <Ionicons name="close-circle" size={28} color="#2256F2" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 5,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    // backgroundColor: '#FFFFFF',
    borderRadius: 5,
    marginRight: 5,
  },
  button: {
    // backgroundColor: '#2256F2',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: '#2256F2',
    // color: 'white',
    fontWeight: 'bold',
  },
  addButton2: {
    // backgroundColor: '#262626',
    // backgroundColor: '#007AFF',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    //-----------
  }
});

export default SearchBar;
