import React from 'react';
import 'react-native-gesture-handler';
import {StatusBar} from 'react-native';
import {YellowBox} from 'react-native';

import Routes from './src/routes';

YellowBox.ignoreWarnings(['Picker has been extracted from react-native']);

export default function App() {
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Routes />
    </>
  );
}
