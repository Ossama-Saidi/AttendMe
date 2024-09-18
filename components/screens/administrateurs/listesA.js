import React,{ useState ,useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import { 
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Alert,
    StatusBar,
    SafeAreaView,
    Button,
    ImageBackground
    } from 'react-native';
import * as Font from 'expo-font';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import API_URL from '../../../config';



export default function ListesA() {
    const [fontLoaded, setFontLoaded] = useState(false);
    const navigation = useNavigation();
    const [type, setType] = useState('etudiant');
    const [error, setError] = useState('');
    const route = useRoute();
    const username = route.params.username;
    const nomFiliere = route.params.NomFiliere;
  
    const [ nombre_admins,setNbeA ] = useState('');
    const [ nombre_enseignants,setNbrP ] = useState('');
    const [ nombre_etudiants,setNbrE ] = useState('');
    const [ nombre_etudiants_filiere,setNbrEF ] = useState('');
    const [ nombre_professeurs_filiere,setNbrPF ] = useState('');

    const [activeTab, setActiveTab] = useState('tab1');
    const [tab1Data, setTab1Data] = useState([]);
    const [tab2Data, setTab2Data] = useState([]);
    const [tab3Data, setTab3Data] = useState([]);
    const [tab4Data, setTab4Data] = useState([]);

      useEffect(() => {
        // Appeler les routes correspondantes pour récupérer les données des tableaux
        axios.get(`${API_URL}listetudiantsfiliere/${username}`, {
          params: {
            username: username
          }
        })
          .then(response => response.data)
          .then(data => setTab1Data(data))
          .catch(error => console.error(error));
      
        axios.get(`${API_URL}listprofesseurs/${username}`, {
          params: {
            username: username
          }
        })
          .then(response => response.data)
          .then(data => setTab2Data(data))
          .catch(error => console.error(error));

        axios.get(`${API_URL}listmodules/${username}`, {
          params: {
            username: username
          }
        })
          .then(response => response.data)
          .then(data => setTab3Data(data))
          .catch(error => console.error(error));

        axios.get(`${API_URL}nbradmins`)
          .then(response => {
            setNbeA(response.data[0].nombre_admins);
          })
          .catch(error => console.error(error));

        axios.get(`${API_URL}nbrprofs`)
          .then(response => {
            setNbrP(response.data[0].nombre_enseignants);
        })
          .catch(error => console.error(error));

        axios.get(`${API_URL}nbretud`)
          .then(response => {
            setNbrE(response.data[0].nombre_etudiants);
        })
          .catch(error => console.error(error));

        axios.get(`${API_URL}nbrprofs/${username}`, {
          params: {
            username: username
          }
        })
          .then(response => {
            setNbrPF(response.data[0].nombre_enseignants_au_filiere);
        })
          .catch(error => console.error(error));

          axios.get(`${API_URL}nbretudfiliere/${username}`, {
            params: {
              username: username
            }
          })
            .then(response => {
              setNbrEF(response.data[0].nombre_etudiants_au_filiere);
          })
            .catch(error => console.error(error));
 
            axios.get(`${API_URL}nbretudsemestre/${username}`, {
              params: {
                username: username,
              }
            })
            .then(response => response.data)
            .then(data => setTab4Data(data))
            // .then(response => {
            //     setNbrES(response.data[0].nombre_etudiants_au_semestre);
            //     setNomS(response.data[0].nom);
            // })
              .catch(error => console.error(error));
    
      }, []);
      const handleTabChange = (tab) => {
        setActiveTab(tab);
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
<SafeAreaView style={styles.container}>
  <ImageBackground
        source={require('../../../assets/images/backAdmin.png')}
        style={styles.imageBackground}
      >
    <StatusBar backgroundColor="#E5F2D0" barStyle="light-content" />
    {/* <View style={{flex:1}}> */}
        <View style={styles.background}>
          {/* <View style={styles.row}> */}
                {/* <View style={{ height: 20 }} /> */}
                <TouchableOpacity style={styles.rightBtn} onPress={() => navigation.goBack()}>
                    <View style={styles.row}>
                        <Ionicons name="arrow-back" size={30} color="#F2F2F2" />
                        {/* <Text style={styles.rightButtonText}>Précédent</Text> */}
                    </View>
                </TouchableOpacity>
                {/* <Text style={styles.text2}>AttendMe</Text> */}
                {/* <Text style={styles.text1}>Welcome to</Text> */}
                <Text style={styles.subheading}>
                Listes
                </Text>
          {/* </View> */}
        </View>
      <ScrollView>
        <View style={styles.bottomBar}>
                <Button
                title=" Etudiants "
                onPress={() => handleTabChange('tab1')}
                disabled={activeTab === 'tab1'}
                />
                <Button
                title="Enseignants"
                onPress={() => handleTabChange('tab2')}
                disabled={activeTab === 'tab2'}
                />
                <Button
                title="  Modules  "
                onPress={() => handleTabChange('tab3')}
                disabled={activeTab === 'tab3'}
                />
        </View>
        <View style={styles.welcomeContainer}>
            
            {activeTab === 'tab1' && (
            // <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <ScrollView showHorizontalScrollIndicateur={false} horizontal={true}>
                <View  style={{marginVertical: 40,marginHorizontal: 20}}>
                    <Text style={styles.text2}>ID d'étudiant</Text>
                    {tab1Data.map(item => (
                        <Text style={styles.text1} key={item.id_etudiant}>{item.id_etudiant}</Text>
                    ))}
                </View>
                <View  style={{marginVertical: 40,marginHorizontal: 20}}>
                    <Text style={styles.text2}>Numéro apogée</Text>
                      {tab1Data.map(item => (
                          <Text style={styles.text1} key={item.id_etudiant}>{item.n_apoge}</Text>
                      ))}
                </View>
                <View  style={{marginVertical: 40,marginHorizontal: 20}}>
                    <Text style={styles.text2}>Nom</Text>
                    {tab1Data.map(item => (
                        <Text style={styles.text1} key={item.id_etudiant}>{item.nom}</Text>
                    ))}
                </View>
                <View  style={{marginVertical: 40,marginHorizontal: 20}}>
                    <Text style={styles.text2}>Prénom</Text>
                    {tab1Data.map(item => (
                        <Text style={styles.text1} key={item.id_etudiant}>{item.prenom}</Text>
                    ))}
                </View>
                <View  style={{marginVertical: 40,marginHorizontal: 20}}>
                    <Text style={styles.text2}>Semestre</Text>
                    {tab1Data.map(item => (
                        <Text style={styles.text1} key={item.id_etudiant}>{item.semestre}</Text>
                    ))}
                </View>
                <View  style={{marginVertical: 40,marginHorizontal: 20}}>
                    <Text style={styles.text2}>Responsable</Text>
                    {tab1Data.map(item => (
                        <Text style={styles.text1} key={item.id_etudiant}>{item.administrateur}</Text>
                    ))}
                </View>
                <View  style={{marginVertical: 40,marginHorizontal: 20}}>
                    <Text style={styles.text2}>Filiere</Text>
                    {tab1Data.map(item => (
                        <Text style={styles.text1} key={item.id_etudiant}>{item.filiere}</Text>
                    ))}
                </View>
            </ScrollView>
            )}


            {activeTab === 'tab2' && (
                <ScrollView showHorizontalScrollIndicateur={false} horizontal={true}>
                {/* <View style={{ flexDirection: 'row', justifyContent: 'center' }}> */}
                 <View  style={{marginVertical: 40,marginHorizontal:20}}>
                    <Text style={styles.text2}>ID d'enseignant</Text>
                    {/* Afficher les données du tableau pour Tab 2 */}
                    {tab2Data.map(item => (
                        <Text style={styles.text1} key={item.id_prof}>{item.id_prof}</Text>
                    ))}
                </View>
                <View  style={{marginVertical: 40,marginHorizontal: 20}}>
                    <Text style={styles.text2}>Username</Text>
                    {/* Afficher les données du tableau pour Tab 2 */}
                    {tab2Data.map(item => (
                        <Text style={styles.text1} key={item.id_prof}>{item.username}</Text>
                    ))}
                </View>
                <View  style={{marginVertical: 40,marginHorizontal: 20}}>
                    <Text style={styles.text2}>Nom d'enseignant</Text>
                    {tab2Data.map(item => (
                        <Text style={styles.text1} key={item.id_prof}>{item.enseignant}</Text>
                    ))}
                </View>
                <View  style={{marginVertical: 40,marginHorizontal: 20}}>
                    <Text style={styles.text2}>Responsable</Text>
                    {tab2Data.map(item => (
                        <Text style={styles.text1} key={item.id_prof}>{item.responsable}</Text>
                    ))}
                </View>
                <View  style={{marginVertical: 40,marginHorizontal: 20}}>
                    <Text style={styles.text2}>Filiere</Text>
                    {tab2Data.map(item => (
                        <Text style={styles.text1} key={item.id_prof}>{item.filiere}</Text>
                    ))}
                </View>
                {/* </View> */}
            </ScrollView>
            )}

            {activeTab === 'tab3' && (
            // <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <ScrollView showHorizontalScrollIndicateur={false} horizontal={true}>
                <View  style={{marginVertical: 40,marginHorizontal: 20}}>
                    <Text style={styles.text2}>Module</Text>
                    {/* Afficher les données du tableau pour Tab 3 */}
                    {tab3Data.map(item => (
                        <Text style={styles.text1} key={item.module}>{item.module}</Text>
                    ))}
                </View>
                <View  style={{marginVertical: 40,marginHorizontal: 20}}>
                    <Text style={styles.text2}>Enseignant</Text>
                    {tab3Data.map(item => (
                        <Text style={styles.text1} key={item.module}>{item.enseignant}</Text>
                    ))}
                </View>
                <View  style={{marginVertical: 40,marginHorizontal: 20}}>
                    <Text style={styles.text2}>Semestre</Text>
                    {tab3Data.map(item => (
                        <Text style={styles.text1} key={item.module}>{item.semestre}</Text>
                    ))}
                </View>
                <View  style={{marginVertical: 40,marginHorizontal: 20}}>
                    <Text style={styles.text2}>Responsable</Text>
                    {tab3Data.map(item => (
                        <Text style={styles.text1} key={item.module}>{item.responsable}</Text>
                    ))}
                </View>
                <View  style={{marginVertical: 40,marginHorizontal: 20}}>
                    <Text style={styles.text2}>Filiere</Text>
                    {tab3Data.map(item => (
                        <Text style={styles.text1} key={item.module}>{item.filiere}</Text>
                    ))}
                </View>
            </ScrollView>
            )}
        </View>    
    </ScrollView>
    <View style={{padding: 5,backgroundColor: '#A6A6A6',borderRadius: 25,/* justifyContent: 'center',alignItems: 'center',*/padding: 40, marginVertical: 10,marginHorizontal: 20}}>
          <Text style={[styles.text2,{textAlign:'center'}]}>Statistiques </Text>
          
          <View style={styles.row}>
            <Text style={styles.text1}>Le nombre total d'étudiants </Text>
            <Text style={styles.text1}>{nombre_etudiants}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text1}>Le nombre total des enseignants </Text>
            <Text style={styles.text1}>{nombre_enseignants}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text1}>Le nombre d'administrateurs </Text>
            <Text style={styles.text1}>{nombre_admins}</Text>
          </View>

          <Text style={[styles.text1,{textAlign: "center",alignSelf: "center"}]}> Au {nomFiliere} </Text>

          <View style={styles.row}>
            <Text style={styles.text1}>Le nombre d'étudiants </Text>
            <Text style={styles.text1}>{nombre_etudiants_filiere}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text1}>Le nombre des enseignants </Text>
            <Text style={styles.text1}> {nombre_professeurs_filiere}</Text>
          </View>
            <ScrollView showHorizontalScrollIndicateur={false} horizontal={true}>
              <View style={styles.row}>
                <View  style={{marginVertical: 40,marginHorizontal: 20}}>
                    <Text style={styles.text1}>Semestre</Text>
                    {tab4Data.map(item => (
                        <Text style={styles.text1} key={item.nom}>{item.nom}</Text>
                    ))}
                </View>
                <View  style={{marginVertical: 40,marginHorizontal: 20}}>
                    <Text style={styles.text1}>Nombre des étudiants</Text>
                    {tab4Data.map(item => (
                        <Text style={styles.text1} key={item.nom}>{item.nombre_etudiants_au_semestre}</Text>
                    ))}
                </View>
              </View>
            </ScrollView>
    </View>
  </ImageBackground>
</SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        //margin: 0,
        flex: 1,
        // backgroundColor: '#E5F2D0',
        // padding: 10,
      },
      imageBackground: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
      },
      background: {
        flexDirection: 'row',
        // flex: "auto",
        justifyContent: 'space-between',
        // justifyContent: 'space-around',
        alignItems: 'center',
        // backgroundColor: '#262626',
        height: 70,
        //top: 10,
        //paddingTop: 7,
        paddingHorizontal: 16,
        padding: 1, // Padding inside the container
      },
      circle1: {
        position: 'absolute',
        top: -350,
        left: -100,
        width: 400,
        height: 500,
        borderRadius: 50,
        backgroundColor: '#D9B4A7',
        opacity: 0.07,
        transform: [{ rotate: '-45deg' }],
      },
      logoContainer: {
        //flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      circle2: {
        position: 'absolute',
        top: -50,
        left: 100,
        width: 350,
        height: 350,
        borderRadius: 90,
        backgroundColor: '#D9B4A7',
        opacity: 0.07,
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
      bottomBar: {
        // flex: 1,
        // height: 64,
        // backgroundColor: '#0D0D0D',
        // borderTopWidth: 1,
        borderRadius:60,
        // borderTopColor: '#C3E6EA',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginHorizontal:50,
        marginVertical:30
      },
      buttonplus: {
        borderRadius: 50,
        marginTop: 20,
        marginLeft: 18,
        backgroundColor: '#C3E6EA',
        borderRadius: 350,
        paddingVertical: 10,
        paddingHorizontal: 10,
        // height: 48,
        // width: 48,
        justifyContent: 'center',
        alignItems: 'center',
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
        textAlign: 'center',
        alignSelf: 'center',
      },
      // subtext: {
      //   //fontWeight: 'bold',
      //   marginRight: 5,
      //   fontSize: 15,
      //   fontFamily: 'ChrustyRock',
      //   // color: 'white',
      //   padding: 10,
      //   color: 'black',
      //   marginBottom: 1,
      // },
      subheading:{
        fontFamily: 'DMSans-Medium',
        fontSize: 26,
        color: '#F2F2F2',
        marginBottom: 1,
        // marginLeft:150,
        textAlign: 'center',
        // alignSelf: 'center',
      },
      welcomeContainer: {
        // flex: 1,
        backgroundColor: '#D9D9D9',
        borderRadius: 25,
        // justifyContent: 'center',
        // alignItems: 'center',
        padding:20,
        marginVertical: 10, 
        marginHorizontal: 20
      },
      input: {
        width: '100%',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
      },
      rightBtn: {
        //alignSelf: 'flex-start',
        // marginTop: 1,
        // marginLeft: 1,
        // marginRight:1,
        // backgroundColor: '#262626',
        // borderRadius: 10,
        // paddingVertical: "auto",
        // paddingHorizontal: 10,
          //borderWidth: 2,
          //borderColor: '#ccc',
        // justifyContent: "center",
        // alignItems: "center",
      },
      row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      rightButtonText: {
        marginRight: 5,
        fontSize: 12,
        fontFamily: 'DMSans-Medium',
        color: 'white',
        padding: 10,
        //textDecorationLine: 'underline',
      },rightBtn1: {
        width: 80,
        height: "15%",
        backgroundColor: '#011126',
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
      },
});