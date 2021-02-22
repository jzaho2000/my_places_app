import React, {useState, useRef} from 'react';
import { StatusBar } from 'expo-status-bar';
//import {Header, Icon, Input, Button, ListItem} from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//import { StyleSheet, Text, View } from 'react-native';


import HomeView from './HomeView';
import MapView from './MapAddressView';
import MapAdddressView from './MapAddressView';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="My Places" component={HomeView} />
        <Stack.Screen name="Map" component={MapAdddressView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}