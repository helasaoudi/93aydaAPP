  import React from 'react';
  import { NavigationContainer } from '@react-navigation/native';
  import { createStackNavigator } from '@react-navigation/stack';
  import HomeScreen from './Screens/HomeScreen';
  import ShareScreen from './Screens/ShareScreen';
  import WaitingRoom from './Screens/WaitingRoomScreen';
  import CategoryScreen from './Screens/CategoryScreen';
  import 'react-native-url-polyfill/auto';

  const Stack = createStackNavigator();

  const App = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Category" component={CategoryScreen} />
          <Stack.Screen name="ShareScreen" component={ShareScreen} />
          <Stack.Screen name="WaitingRoom" component={WaitingRoom} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  };

  export default App;
