import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import ShareScreen from './ShareScreen';
import CreateSessionScreen from "./CreateSessionScreen";
import JoinSessionScreen from "./JoinSessionScreen";


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ShareScreen" component={ShareScreen} />
       

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
