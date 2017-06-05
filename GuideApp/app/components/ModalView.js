import React, {Component} from 'react';
import {
  StyleSheet,
  Animated,
  Dimensions
} from 'react-native'
 
const screen = Dimensions.get('window');

export default class ModalView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0), // init opacity 0
    };
    const value = this.props.type === 'slide' ? screen.width : 1;
    Animated.timing(          // Uses easing functions
      this.state.fadeAnim,    // The value to drive
      {
        toValue: value,
        duration: 250,
      }            // Configuration
    ).start();
  }

  componentDidMount() {
  }

  render() {
    const styles = this.props.type === 'slide' ? {width: this.state.fadeAnim} : {opacity: this.state.fadeAnim};
    
    return (
      <Animated.View          // Special animatable View
        style={styles}>
        {this.props.children}
      </Animated.View>
    );
  }
}
