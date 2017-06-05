import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TabBarIOS,
  Navigator,
  TouchableOpacity,
  //NavigatorIOS,
} from 'react-native';

import Ionicon from 'react-native-vector-icons/Ionicons';
import TabNavigator from 'react-native-tab-navigator';

import Default from './components/Default';
import Profile from './components/Profile';
import Login from './components/Login';
import Maps from './components/GoogleMaps/Maps';

export default class App extends Component {
  state = {
    selectedTab: "maps"
  }

  NavigationBarRouteMapper = {

    LeftButton(route, navigator, index, navState) {
      if(index > 0) {
        return (
          <TouchableOpacity
            activeOpacity={.85}
            onPress={() => componentNavigator.pop()}
            style={styles.navigationBarButton} >  
              <Ionicon 
                name='ios-arrow-back'
                style={[styles.iconMenu]} /> 
          </TouchableOpacity>
        )
      } 
      return null;
    },
    RightButton(route, navigator, index, navState) {
      return null;
    },
    Title(route, navigator, index, navState) {
      return <Text style={[styles.navigationBarText, styles.navigationBarTitle]}>{route.title}</Text>
    }
  };

  _renderContent = (category: string, title: ?string, component) => {
    if (category === 'maps')
      return <Maps category="maps"/>;

    return (
      <Navigator
        configureScene={ this.configureScene }
        style={styles.wrapper}
        initialRoute={{
          id: category,
          component: component,
          title: title,
          passProps: {
            filter: category,
            title: title
          }
        }}
        renderScene={this.renderScene}
        navigationBar={
          <Navigator.NavigationBar 
            style={styles.navigationBar} 
            routeMapper={ this.NavigationBarRouteMapper } />
        }
      />
    );
  }

  configureScene(route, routeStack){
    return Navigator.SceneConfigs.PushFromRight
  }

  renderScene(route, navigator) {
    return <route.component navigator={navigator} {...route.passProps} />
  }

  render() {
    let backgroundColor = this.state.selectedTab === 'login' ? '#2e2f43' : '#2e2f43';

    return (
      <View style={styles.container}>
        <TabNavigator

          
          tabBarStyle={{ backgroundColor, overflow: 'hidden',  }}
          sceneStyle={{ paddingBottom: 0, backgroundColor: 'transparent'}}>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'profile'}
            title="Profile"
            renderIcon={() => <Ionicon name="ios-contact-outline" style={styles.tabIcon}/>}
            renderSelectedIcon={() => <Ionicon name="ios-contact" style={[styles.tabIcon, styles.tabIconSelect]}/>}
            onPress={() => this.setState({ selectedTab: 'profile' })}>
              {this._renderContent("login", "Login", Login)}
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'home'}
            title="Locality"
            renderIcon={() => <Ionicon name="ios-pin-outline" style={styles.tabIcon}/>}
            renderSelectedIcon={() => <Ionicon name="ios-pin" style={[styles.tabIcon, styles.tabIconSelect]}/>}
            onPress={() => this.setState({ selectedTab: 'home' })}>
              {this._renderContent("home", "Locality", Default)}
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={this.state.selectedTab === 'maps'}
            title="Maps"
            renderIcon={() => <Ionicon name="ios-globe-outline" style={styles.tabIcon}/>}
            renderSelectedIcon={() => <Ionicon name="md-globe" style={[styles.tabIcon, styles.tabIconSelect]}/>}
            onPress={() => this.setState({ selectedTab: 'maps' })}>
              {this._renderContent("maps", "Maps")}
          </TabNavigator.Item>
        </TabNavigator>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1
  },
   navigationBar: {
    // backgroundColor: '#C7F1A1',
    // backgroundColor: 'rgba(0,0,0,.7)',
    // backgroundColor: '#2e2f43',
    backgroundColor: '#35B79F',
  },
  navigationBarTitle: {
    fontSize: 23,
    fontWeight: '600',
  },
  navigationBarButton: {
    flexDirection: 'row',
    paddingHorizontal:  12,
  },
  navigationBarText: {
    color: 'white',
    fontSize: 17,
    lineHeight: 20,
    paddingVertical: 12,
  },
  iconMenu: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'normal',
    paddingVertical: 2,
  },
  tabBarStyle: {
    // opacity: 0,
    // height: 0,
    backgroundColor: "#C7F1A1"
  },
  tabIcon: {
    color: '#8A8A8A',
    fontSize: 26,
  },
  tabIconSelect: {
    color: '#2082E4',
  },
});
