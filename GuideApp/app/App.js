import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import Maps from './GoogleMaps/Maps';

export default class App extends Component {
  

  render() {
    return (
      <View style={styles.container}>
        <Maps/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
