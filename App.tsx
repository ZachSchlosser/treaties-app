import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppProvider } from './src/context/AppContext';
import { SwarmScreen } from './src/screens/SwarmScreen';
import { TreatyScreen } from './src/screens/TreatyScreen';

export type RootStackParamList = {
  Swarm: undefined;
  Treaty: { treatyId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Swarm">
          <Stack.Screen 
            name="Swarm" 
            component={SwarmScreen}
            options={{
              title: 'Treaties',
            }}
          />
          <Stack.Screen 
            name="Treaty" 
            component={TreatyScreen}
            options={{
              title: 'Treaty',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
