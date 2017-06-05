import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Linking,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,  
} from 'react-native';

import MapView, { Marker, Polyline} from 'react-native-maps';
import Ionicon from 'react-native-vector-icons/Ionicons';
import RNGooglePlaces from 'react-native-google-places';

import ModalView from '../ModalView';
import Menu from '../Menu';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Api from '../../helpers/api';
const api = new Api();

const places = [{icon: 'flight', name: 'airport'}, 
                {icon: 'directions-bus', name: 'bus station'}, 
                {icon: 'local-bar', name: 'bar'}, 
                {icon: 'local-cafe', name: 'cafe'}, 
                {icon: 'restaurant', name: 'restaurant'}, 
                {icon: 'local-hotel', name: 'lodging'}, 
                {icon: 'train', name: 'train station'},
                {icon: 'local-pharmacy', name: 'pharmacy'}];

export default class Maps extends Component {
  segments = [];

  constructor(props) {
    super(props);
    this.state = {
      points: null,
      markers: [],
      polylinePoints: [],
      region: {
        latitude: 53.90428042342294,
        longitude: 27.56048619747162,
        latitudeDelta: 0.16360365089180675,
        longitudeDelta: 0.16713971495628357,
      },
      currentPosition: null,
      searchPlaces: [],
      showMenu: false,
      wayToSearchPlace: [],
      googleModalSearchPLace: null,
    }
    this.mapRef = null;
    this.handlePress = this.handlePress.bind(this)
  }

  //watchID: ?number = null;

  componentDidMount() {
    // navigator.geolocation.getCurrentPosition(
    //   (position) => {
    //     console.log(position)
    //     this.setState({
    //       currentPosition: {latitude: 53.90428042342294, longitude: 27.56048619747162},
    //       // currentPosition: {
    //       //   latitude: position.coords.latitude,
    //       //   longitude: position.coords.longitude
    //       // }
    //     });
    //   },
    //   (error) => alert(JSON.stringify(error)),
    //   {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    // );

    // this.watchID = navigator.geolocation.watchPosition((position) => {
    //   let lastPosition = JSON.stringify(position);
    //   this.setState({lastPosition});
    // });
  }

  getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position)
        this.setState({
          currentPosition: {latitude: 53.90428042342294, longitude: 27.56048619747162},
          // currentPosition: {
          //   latitude: position.coords.latitude,
          //   longitude: position.coords.longitude
          // }
        });
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  componentWillUnmount() {
    //navigator.geolocation.clearWatch(this.watchID);
  } 

  addPolylinePoint = ({latitude, longitude}) => {
    this.setState({
      polylinePoints: [
        ...this.state.polylinePoints,
        {
          latitude,
          longitude
        }
      ]
    })
  }

  addSegment = (segment) => {
    this.segments.push(segment)
  }

  // 'https://maps.googleapis.com/maps/api/directions/json?
  // origin=' + startPosition 
  // + '&destination=' + endPosition 
  // + '&departure_time='+Date.now() //////???????????
  // +'&traffic_model=best_guess&key=' ////////?????????
  // + Util.GOOGLE_API_KEY;
  addPolylinePoints = ({latitude, longitude}) => {
    //const mode = 'driving'; // 'walking';
    let length = this.state.polylinePoints.length,
        points = this.state.polylinePoints;

    if (this.segments.length > 0) {
      api.getWayPoints(this.segments[this.segments.length - 1][this.segments[this.segments.length - 1].length - 1], {latitude, longitude})
      .then((resPoints) => {
        this.setState({
          polylinePoints: [
            ...this.state.polylinePoints,
            ...resPoints 
          ]
        })
        this.addSegment(resPoints)
      })
      .catch((res) => {
        console.log(res)
      })

    } else {
        //this.addPolylinePoint({latitude, longitude});
        this.addSegment([{latitude, longitude}]);
    }
  }

  addMarkerPoint = ({latitude, longitude}) => {
    this.setState({
      markers: [
        ...this.state.markers,
        {
          latitude,
          longitude
        }
      ]
    })
  }

  replaceSegment = (segment, index) => {
    this.segments[index] = segment;
  }

  getTransormSegmentsData = () => {
    let transformData = [];
    this.segments.map((segment, index) => {
      transformData = transformData.concat(segment)
    })
    
    return transformData;
  }

  replaceRoute = () => {
    this.setState({
      polylinePoints: this.getTransormSegmentsData(),
    })
  }

  updateRoute = async (e, index) => {
    if (this.segments.length === 1) {
      this.replaceSegment([e.nativeEvent.coordinate], 0);
      this.setState({
        polylinePoints: [e.nativeEvent.coordinate],
      })

      return;
    } 

    let segment ,
        startPoint,
        endPoint,
        startPointNext,
        endPointNext;

    if (index === 0) {
        this.replaceSegment(e.nativeEvent.coordinate, index);
        ++index;
        startPoint = e.nativeEvent.coordinate;
        endPoint = this.segments[index][this.segments[index].length - 1];
    } else {
        startPoint = this.segments[index][0];
        endPoint = e.nativeEvent.coordinate;

        if (index < this.segments.length - 1) {
          startPointNext = e.nativeEvent.coordinate;
          endPointNext = this.segments[index + 1][this.segments[index + 1].length - 1];
        }
    }

    try {
      if (!startPointNext && !endPointNext) {
          let resPoints = await api.getWayPoints(startPoint, endPoint);
          this.replaceSegment(resPoints, index)
      } else {
          let [resPointsPreviousSegment, 
               resPointsNextSegment] = await Promise.all([api.getWayPoints(startPoint, endPoint), api.getWayPoints(startPointNext, endPointNext)]);

          this.replaceSegment(resPointsPreviousSegment, index)
          this.replaceSegment(resPointsNextSegment, index + 1)
      }

    } catch (e) {
      console.log(e)
    }

    this.replaceRoute();
  }

  onRegionChangeComplete = (region) => {
    this.setState({
      region
    })
  }

  handlePress(e) {
    if (e.nativeEvent.coordinate) {
        this.addMarkerPoint(e.nativeEvent.coordinate)
        this.addPolylinePoints(e.nativeEvent.coordinate)
    } else {
        return;
    }
  }

  openSearchModal= () => {
    RNGooglePlaces.openAutocompleteModal()
    .then((place) => {
        this.setState({
          region: {
            latitude: place.latitude,
            longitude: place.longitude,
            latitudeDelta: 0.06360365089180675,
            longitudeDelta: 0.06713971495628357,
          },
          googleModalSearchPLace: {
            coordinate:{
              latitude: place.latitude,
              longitude: place.longitude,
            },  
            name: place.name,
            address: place.address,
            type: place.types[0],
          }
        })
        console.log(place);
    })
    .catch(error => console.log(error.message));
  }

  modalMenu = () => {
    this.setState({
      showMenu: !this.state.showMenu
    })
  }

  searchPlace = (places) => {
    this.setState({
      searchPlaces: places,
      wayToSearchPlace: [],
    })    
  }

  getWayToSearchPlace = (searchPlacePosition) => {
    if (!this.state.currentPosition) 
      return;
    api.getWayPoints(this.state.currentPosition, searchPlacePosition)
    .then(resPoints => {
      this.setState({
        wayToSearchPlace: resPoints,
      })
    })
    .catch(e => console.log(e))
  }

  render() {
    console.log(this.props)
    const customMapStyle = this.props.category === 'maps' ? require('./custom.json') : require('./custom.json');

    return (
      <View style={styles.container}>
        <MapView 
          // provider={PROVIDER_GOOGLE}
          ref={(ref) => { this.mapRef = ref }}
          style={styles.map}
          // customMapStyle={customMapStyle}
          region={this.state.region}
          onPress={this.handlePress}
          onRegionChangeComplete={this.onRegionChangeComplete}>

          {this.state.polylinePoints.length > 0
            ?
              <Polyline
                coordinates={this.state.polylinePoints}
                strokeColor="#000"
                fillColor="rgba(255,0,0,0.5)"
                strokeWidth={5}/>
            : 
              null
          }

          {this.state.markers.length > 0
            ?
              this.state.markers.map((marker, index) => {
                return (
                  <Marker 
                    key={index} 
                    coordinate={marker} 
                    draggable
                    onDragStart={(e) => {}}
                    onDragEnd={(e) => {this.updateRoute(e, index)}}>        
                  </Marker>
                )
              })
            :
              null
          }

          {this.state.wayToSearchPlace.length > 0
            ?
              <Polyline
                coordinates={this.state.wayToSearchPlace}
                strokeColor="#000"
                fillColor="rgba(0,200,0,0.5)"
                strokeWidth={5}/>
            : 
              null
          }

          {this.state.searchPlaces.length > 0
            ?
              this.state.searchPlaces.map((place, index) => {
                return (
                  <Marker
                    key={index}
                    coordinate={place.coordinate}
                    title="Title"
                    description="Description"
                    onPress={() => {this.getWayToSearchPlace(place.coordinate)}}>
                      <Image source={{uri: place.icon}} style={{width: 20, height: 20}}/>

                      <MapView.Callout style={styles.plainView}>
                        <View>
                          <Text style={{textAlign: 'center'}}>{place.name}</Text>
                          <Image source={require('../../assets/post.png')} width={72} height={72}/>
                          <Text style={{textAlign: 'center'}}>{place.vicinity}</Text>
                        </View>
                      </MapView.Callout>
                  </Marker>
                )
              })
            : 
              null
          }

          {this.state.currentPosition
            ? 
              <Marker
                coordinate={this.state.currentPosition}>
                <Ionicon name="md-pin" style={styles.iconCurrentPosition}/>
              </Marker>
            :
              null
          }
          {this.state.googleModalSearchPLace
            ? 
              <Marker
                coordinate={this.state.googleModalSearchPLace.coordinate}>
                <MaterialIcons name="place" style={{fontSize: 28, color: '#fff'}}/>
                <MapView.Callout style={styles.plainView}>
                  <View>
                    <TouchableOpacity onPress={() => {console.log('close');this.setState({googleModalSearchPLace: null})}}><Text>X</Text></TouchableOpacity>
                    <Text style={{textAlign: 'center'}}>{this.state.googleModalSearchPLace.name}</Text>
                    <Text style={{textAlign: 'center', marginVertical: 10}}>{this.state.googleModalSearchPLace.type}</Text>
                    <Text style={{textAlign: 'center'}}>{this.state.googleModalSearchPLace.address}</Text>
                  </View>
                </MapView.Callout>
              </Marker>
            :
              null
          }
        </MapView>
        {this.state.showMenu
          ?
            <Menu currentPosition={{latitude: 53.90428042342294, longitude: 27.56048619747162}} onHide={() => {this.modalMenu()}} passPlaces={(places) => {this.searchPlace(places)}}/>
          :
            null
        }
        {this.props.category === 'maps' ?
        <View style={styles.tabBarStyle}>
          <TouchableOpacity
            style={styles.navigationBarButton}
            activeOpacity={.5}
            onPress={() => {
              this.modalMenu()
            }}>
              <Ionicon name="md-menu" style={styles.iconMenu}/>
          </TouchableOpacity>

          <Text style={[styles.title]}>Maps</Text>

          <TouchableOpacity
            style={styles.navigationBarButton}
            activeOpacity={.5}
            onPress={() => {this.openSearchModal()}}>
              <Ionicon name="ios-search" style={styles.iconMenu}/>
          </TouchableOpacity>
        </View> : null}
        {!this.state.showMenu ?
          <View>
          <TouchableOpacity 
            activeOpacity={.75}
            style={{
              position: 'absolute',
              top: 50, right: 15,
              width: 40, height: 40, backgroundColor: "#fff", 
              borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {this.getCurrentPosition()}}>
            <MaterialIcons name="my-location" style={{color: "#d94b4e", fontSize: 28}}/>
          </TouchableOpacity>
          <TouchableOpacity 
            activeOpacity={.75}
            style={{
              position: 'absolute',
              top: 100, right: 15,
              width: 40, height: 40, backgroundColor: "#d94b4e", 
              borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {()=>{}}}>
            <MaterialIcons name="near-me" style={{color: "#fff", fontSize: 20}}/>
          </TouchableOpacity>

          {/*<View 
                      activeOpacity={.75}
                      style={{
                        position: 'absolute',
                        top: 0, left: 0,
                        width: 375, height: 150, backgroundColor: "#d94b4e", 
                         justifyContent: 'center', alignItems: 'center'}}
                      onPress={() => {()=>{}}}>
                      <View style={styles.fieldSet}>
                    
                    <TextInput
                      autoFocus={true}
                      
                      style={styles.textInput}
                      placeholder='Title'
                      placeholderTextColor='#2e2f43'
                      keyboardAppearance='dark'
                      returnKeyType='next'
                      enablesReturnKeyAutomatically={true}
                      autoCapitalize='none'
          
                      onSubmitEditing={(event) => { 
                        this.refs.email.focus(); 
                      }}
                      autoCorrect={false} />
                    <View style={styles.fieldsSeparator} />
                    
                    <TextInput
                      style={styles.textInput}
                      ref='email'
                      keyboardType='email-address'
                      placeholder='Description'
                      placeholderTextColor='#2e2f43'
                      keyboardAppearance='dark'
                      returnKeyType='next'
                      enablesReturnKeyAutomatically={true}
                      autoCapitalize='none'
          
                      onSubmitEditing={(event) => { 
                        this.refs.password.focus(); 
                      }}
                      autoCorrect={false} />
                  </View>
                    </View>
          
                    <TouchableOpacity 
                      activeOpacity={.75}
                      style={{
                        position: 'absolute',
                        top: 160, right: 15,
                        width: 70, height: 40, backgroundColor: "#d94b4e", 
                        borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}
                      onPress={() => {()=>{}}}>
                      <Text style={{color: "#F9F5ED"}}>Save</Text>
                    </TouchableOpacity>*/}
          <TouchableOpacity 
            activeOpacity={.75}
            style={{
              position: 'absolute',
              top: 50, left: 15,
              width: 40, height: 40, backgroundColor: "#d94b4e", 
              borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {()=>{}}}>
            <Ionicon name="md-create" style={{color: "#fff", fontSize: 20}}/>
          </TouchableOpacity>
          </View>
          : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    // flex: 1,
    ...StyleSheet.absoluteFillObject
  },
  textInput: {
      alignSelf: 'stretch',
      color: 'white',
      fontSize: 17,
      height: 44,
      lineHeight: 24,
      paddingHorizontal: 20,
      paddingBottom: 18,
      paddingTop: 0,

      marginTop: 16
    },
    fieldSet: {
      alignSelf: 'stretch',
      backgroundColor: '#F9F5ED',
      borderRadius: 5,
      margin: 10,
      marginTop: 10,
    },
      fieldsSeparator: {
        backgroundColor: 'black',
        height: 1,
        opacity: .2,
      },
  tabBarStyle: {
    height: 64, ///////////////////////////////////////////////
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2e2f43',

    // backgroundColor: '#C7F1A1',
  },
  navigationBarButton: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,

  },
  title: {
    fontSize: 23,
    fontWeight: '600',
    textAlign: 'center',
    color: 'white',
    marginTop: 12,
    flex: 5
  },
  iconMenu: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'normal',
  },
  marker: {
    backgroundColor: '#550bbc',
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
  iconCurrentPosition: {
    color: '#008fff',
    fontSize: 26,
    fontWeight: 'normal',
  },
  plainView: {
    width: 150,
  },
});
