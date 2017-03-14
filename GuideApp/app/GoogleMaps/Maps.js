import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Linking,
  TouchableOpacity
} from 'react-native';

import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';
import Ionicon from 'react-native-vector-icons/Ionicons';

import RNGooglePlaces from 'react-native-google-places';

const APIKEY = 'AIzaSyB9kkiGSu4UfmDXDYKdID1JapWMI8szbHw';

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
        latitudeDelta: 0.06360365089180675,
        longitudeDelta: 0.06713971495628357,
      },
      currentPosition: null,
    }
    this.map = null;
    this.handlePress = this.handlePress.bind(this)
  }

  //watchID: ?number = null;

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position)
        this.setState({
          currentPosition: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        });
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    // this.watchID = navigator.geolocation.watchPosition((position) => {
    //   let lastPosition = JSON.stringify(position);
    //   this.setState({lastPosition});
    // });
  }

  componentWillUnmount() {
    //navigator.geolocation.clearWatch(this.watchID);
  }

  getRandomInt(min, max) {
    let rand = min + Math.random() * (max - min)
    rand = Math.round(rand);

    return rand;
  }

  decode = (t,e) => {
    for(var n,o,u=0,l=0,r=0,d= [],h=0,i=0,a=null,c=Math.pow(10,e||5);u<t.length;) {
      a=null,h=0,i=0;do a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;while(a>=32);n=1&i?~(i>>1):i>>1,h=i=0;do a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;while(a>=32);o=1&i?~(i>>1):i>>1,l+=n,r+=o,d.push([l/c,r/c])
    }

    return d=d.map(function(t){ return {latitude:t[0],longitude:t[1]} })
  }

  getWayPoints = (startPoint, endPoint) => {
    let 
        origin = `${startPoint.latitude},${startPoint.longitude}`, 
        destination = `${endPoint.latitude},${endPoint.longitude}`, 
        url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${APIKEY}&mode=driving`;

    return new Promise((resolve, reject) => {
      fetch(url)
      .then(response => response.json())
      .then(json => {
        if (json.status === "OK") {
            resolve(this.decode(json.routes[0].overview_polyline.points));
        } else {
            resolve(endPoint);
        }
      })
      .catch(e => {console.warn(e)})
    });  
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
      this.getWayPoints(this.segments[this.segments.length - 1][this.segments[this.segments.length - 1].length - 1], {latitude, longitude})
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
      this.replaceSegment(e.nativeEvent.coordinate, 0);
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
          let resPoints = await this.getWayPoints(startPoint, endPoint);
          this.replaceSegment(resPoints, index)
      } else {
          let [resPointsPreviousSegment, 
               resPointsNextSegment] = await Promise.all([this.getWayPoints(startPoint, endPoint), this.getWayPoints(startPointNext, endPointNext)]);

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
          }
        })
        console.log(place);
        // place represents user's selection from the
        // suggestions and it is a simplified Google Place object.
    })
    .catch(error => console.log(error.message));  // error is a Javascript Error object
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView 
          provider={PROVIDER_GOOGLE}
          ref={(ref) => { this.map = ref }}
          style={styles.map}
          region={this.state.region}
          onPress={this.handlePress}
          onRegionChangeComplete={this.onRegionChangeComplete}
        >
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
          {this.state.currentPosition
            ? 
              <Marker
                coordinate={this.state.currentPosition}>
                <Ionicon name="ios-pin" style={styles.iconCurrentPosition}/>
              </Marker>
            :
              null
            }
        </MapView>
        <View style={styles.tabBarStyle}>
          <TouchableOpacity
            style={styles.navigationBarButton}
            activeOpacity={1}
            onPress={() => {
              //console.log('press menu')
              RNGooglePlaces.openPlacePickerModal()
              .then((place) => {
                  console.log(place);
                  // place represents user's selection from the
                  // suggestions and it is a simplified Google Place object.
              })
              .catch(error => console.log(error.message));  // error is a Javascript Error object
            }}>
              <Ionicon name="md-menu" style={styles.iconMenu}/>
          </TouchableOpacity>

          <Text style={[styles.navigationBarText, styles.navigationBarTitle]}>Maps</Text>

          <TouchableOpacity
            style={styles.navigationBarButton}
            activeOpacity={1}
            onPress={() => {this.openSearchModal()}}>
              <Ionicon name="ios-search" style={styles.iconMenu}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  tabBarStyle: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C7F1A1',
  },
  navigationBarTitle: {
    fontSize: 23,
    fontWeight: '600',
    flex: 5,
    textAlign: 'center',
  },
  navigationBarButton: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,

  },
  navigationBarText: {
    color: 'white',
    marginTop: 12,
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
    fontSize: 36,
    fontWeight: 'normal',
  },
});
