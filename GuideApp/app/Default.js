import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

const Default = (props) => {
	return (	
		<View style={{marginTop: 64}}>
			<Text style={{color: '#C2C2C2', fontSize: 40, textAlign: 'center'}}>{props.title} scene</Text>
		</View>
	)
}

export default Default;
