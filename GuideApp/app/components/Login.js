import React, { Component } from 'react';
import {
  ActivityIndicatorIOS,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

// import Signup from './Signup';
// import ForgotPassword from './ForgotPassword';
// import Main from '../Main';


export default class Login extends Component {
	constructor(props) {
    super(props);

    this.state = {
      loading: false,
      values: {
        username: '',
        password: '',
      },
      errors: {
        username: null,
        password: null,
      }
    }
  }


  validateData() {
    let valid = true;
    let errors = {
      username: null,
      password: null,
    };

    if(this.state.values.username.length < 4) {
      valid = false;
      errors.username = "Username must be at least 4 characters"
    } else {
      var re = /^\w+$/; 
      if (re.exec(this.state.values.username) === null) {
        valid = false;
        errors.username = "Username may contain only letters, digits and `_`"
      }
    }

    if(this.state.values.password.length < 4) {
      valid = false;
      errors.password = "Password must be at least 4 characters"
    }

    this.setState({
      errors: errors
    });

    return valid;
  }


  renderLoginButton() {
    if(this.state.loading) {
      return (
        <TouchableOpacity
            style={[styles.primaryButton, {opacity: 1}]}
            activeOpacity={1} >
          <ActivityIndicatorIOS color={StyleComponents.colors.brand} />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={.75}
          onPress={() => this.onLoginButtonPressed()} >
        <Text style={styles.primaryButtonText}>LOGIN</Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.descriptionContainer}>
          {/*<Text style={styles.descriptionText}></Text>*/}
        </View>
        <View style={styles.fieldSet}>
          <Text style={styles.error}>{this.state.errors.username}</Text>
          <TextInput
            autoFocus={true}
            ref='username'
            style={styles.textInput}
            placeholder='Username'
            placeholderTextColor='rgba(255, 255, 255, .5)'
            keyboardAppearance='dark'
            returnKeyType='next'
            enablesReturnKeyAutomatically={true}
            autoCapitalize='none'
            onChangeText={event => this.setState(extendObject(this.state, {
              values: {
                username: event
              }
            }))}
            onSubmitEditing={(event) => { 
              this.refs.email.focus(); 
            }}
            autoCorrect={false} />
          <View style={styles.fieldsSeparator} />
          <Text style={styles.error}>{this.state.errors.email}</Text>
          <TextInput
            style={styles.textInput}
            ref='email'
            keyboardType='email-address'
            placeholder='Password'
            placeholderTextColor='rgba(255, 255, 255, .5)'
            keyboardAppearance='dark'
            returnKeyType='next'
            enablesReturnKeyAutomatically={true}
            autoCapitalize='none'
            onChangeText={event => this.setState(extendObject(this.state, {
              values: {
                email: event
              }
            }))}
            onSubmitEditing={(event) => { 
              this.refs.password.focus(); 
            }}
            autoCorrect={false} />
        </View>
        
        {this.renderLoginButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create(
  {
  logo: {
    alignSelf: 'center',
    height: 42,
    marginTop: 18,
    marginBottom: 15,
    width: 243,
  },
  descriptionContainer: {
    marginBottom: 37,
  },
  descriptionText: {
    textAlign: "center",
    fontSize: 26,
  },
    
  passwordFieldWithHelpButton: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    height: 60,
  },
    passwordInput: {
      flex: 1,
      paddingRight: 0,
    },
    helpButton: {
      
    },
      icon: {
        color: 'rgba(255, 255, 255, .5)',
        borderBottomRightRadius: 5,
        fontSize: 24,
        height: 60,
        marginHorizontal:5,
        paddingHorizontal: 15,
        paddingVertical: 18
      },
    container: {
      paddingTop: 84,
      
      flex: 1,
    },

    descriptionContainer: {
      marginBottom: 20,
    },

    fieldSet: {
      alignSelf: 'stretch',
      backgroundColor: '#8D8D8D',
      borderRadius: 5,
      margin: 20,
      marginTop: 0,
    },
      fieldsSeparator: {
        backgroundColor: '#FFFFFF',
        height: 1,
        opacity: .2,
      },

    textInput: {
      alignSelf: 'stretch',
      color: 'white',
      fontSize: 17,
      height: 42,
      lineHeight: 24,
      paddingHorizontal: 20,
      paddingBottom: 18,
      paddingTop: 0,
    },
    error: {
      color: '#CA4200',
      fontSize: 11,
      height: 13,
      lineHeight: 13,
      marginHorizontal: 20,
      marginTop: 4,
    },
    primaryButton: {
      alignSelf: 'stretch',
      backgroundColor: '#008FFF',
      borderRadius: 5,
      marginBottom: 20,
      marginHorizontal: 20,
      padding: 20,
    },
      primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        textAlign: 'center',
      },
});
