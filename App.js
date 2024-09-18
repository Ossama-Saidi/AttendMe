import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomePage from './components/screens/WelcomePage';
import LoginPage from './components/screens/LoginPage';
import ForgotPassword from './components/screens/ForgotPassword';
import ResetPassword from './components/screens/ResetPassword';
import ContactScreen from './components/screens/ContactScreen';

import HomeEtud from './components/screens/etudiants/HomeEtud';
import HomeProf from './components/screens/professeurs/HomeProf';
import HomeAdmin from './components/screens/administrateurs/HomeAdmin';
import AdminGlobal from './components/screens/administrateurs/AdminGlobal';
import Listes from './components/screens/administrateurs/listes';
import ListesA from './components/screens/administrateurs/listesA';


const Stack = createStackNavigator();

export default function App() {
  
  return (  

    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomePage} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
        <Stack.Screen name="ContactScreen" component={ContactScreen} options={{ headerShown: false }} />

        <Stack.Screen name="HomeEtud" component={HomeEtud} options={{ headerShown: false }} />
        <Stack.Screen name="HomeProf" component={HomeProf} options={{ headerShown: false }} />
        <Stack.Screen name="HomeAdmin" component={HomeAdmin} options={{ headerShown: false }} />
        <Stack.Screen name="AdminGlobal" component={AdminGlobal} options={{ headerShown: false }} />
        <Stack.Screen name="Listes" component={Listes} options={{ headerShown: false }} />
        <Stack.Screen name="ListesA" component={ListesA} options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};