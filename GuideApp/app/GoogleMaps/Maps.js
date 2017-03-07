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

const APIKEY = 'AIzaSyB9kkiGSu4UfmDXDYKdID1JapWMI8szbHw';

export default class Maps extends Component {
  markersPoints = [];


  constructor(props) {
    super(props);
    this.state = {
      points: null,
      markers: [],
      polylinePoints: []
    }
    this.map = null;
  }

  componentDidMount() {
    //TODO

    //this.setState({points: this.initPoints()})
  }

  getRandomInt(min, max) {
    let rand = min + Math.random() * (max - min)
    rand = Math.round(rand);

    return rand;
  }

  initPoints() {
    return this.markersPoints.map((marker, index) => {
        return (
          <Marker key={index} coordinate={marker} draggable>
            <View style={styles.marker}>
            {/*<Text style={styles.text}>{marker.cost}</Text>*/}
            </View>
          </Marker>
        )
    })
  }

  decode = (t,e) => {
    for(var n,o,u=0,l=0,r=0,d= [],h=0,i=0,a=null,c=Math.pow(10,e||5);u<t.length;) {
      a=null,h=0,i=0;do a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;while(a>=32);n=1&i?~(i>>1):i>>1,h=i=0;do a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;while(a>=32);o=1&i?~(i>>1):i>>1,l+=n,r+=o,d.push([l/c,r/c])
    }

    return d=d.map(function(t){ return {latitude:t[0],longitude:t[1]} })
  }
//transforms something like this geocFltrhVvDsEtA}ApSsVrDaEvAcBSYOS_@... to an array of coordinates

  addPointPolyline = (latitude, longitude) => {
    this.setState({
      polylinePoints: [
        ...this.state.polylinePoints,
        {
          latitude: latitude,
          longitude: longitude
        }
      ]
    })
  }

  addPointsPolyline({latitude, longitude}) {
    //const mode = 'driving'; // 'walking';
    let length = this.state.polylinePoints.length;
    let points = this.state.polylinePoints;

    if (length > 0) {

      let origin = this.state.polylinePoints[length - 1].latitude + ',' + this.state.polylinePoints[length - 1].longitude;
      let destination = `${latitude},${longitude}`;
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${APIKEY}&mode=driving`;

      fetch(url)
      .then(response => response.json())
      .then(json => {
        if (json.status === "OK") {
            let resPoints = this.decode(json.routes[0].overview_polyline.points);
            this.setState({
              polylinePoints: [
                ...this.state.polylinePoints,
                ...resPoints 
              ]
            })
        } else {
          this.addPointPolyline(latitude, longitude);
        }
      })
      .catch(e => {console.warn(e)})

    } else {
        this.addPointPolyline(latitude, longitude);
    }
  }

  handlePress(e) {
    this.addPointsPolyline(e.nativeEvent.coordinate)
  }



  onRegionChangeComplete(region) {
    console.log(region)
  }

  // drawPolyline() {
  //   console.log('draw')
  //   console.log(this.state.polylinePoints)
  //   return (this.state.polylinePoints.length > 0
  //     ?
  //       <Polyline
  //         coordinates={this.state.polylinePoints}
  //         strokeColor="#000"
  //         fillColor="rgba(255,0,0,0.5)"
  //         strokeWidth={5}/>
  //     : 
  //       null
  //   )
  // }

  render() {
    return (
      <View style={styles.container}>
        <MapView 
          provider={PROVIDER_GOOGLE}
          ref={(ref) => { this.map = ref }}
          style={styles.map}
          initialRegion={{
            latitude: 53.90428042342294,
            longitude: 27.56048619747162,
            latitudeDelta: 0.06360365089180675,
            longitudeDelta: 0.06713971495628357,
          }}
          onPress={this.handlePress.bind(this)}
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
          {/*this.state.points*/}
        </MapView>
        <TouchableOpacity
        style={styles.menu}
          activeOpacity={.8}
          onPress={() => {}}>
            <Ionicon name="md-menu" style={styles.iconMenu}/>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 64,
  },
  menu: {
    width: 40, 
    height: 40, 
    marginTop: 15, 
    marginLeft: 20, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  iconMenu: {
    backgroundColor: 'transparent',
    fontSize: 40,
    color: "#4F8EF7",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  marker: {
    backgroundColor: '#550bbc',
    width: 10,
    height: 10,
    borderRadius: 10,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

  // handleNavigation = (la, lo) => {
  //   const rla = 53.90428042342294;
  //   const rlo = 27.56048619747162;
  //   const url = `http://maps.apple.com/?saddr=${rla},${rlo}&daddr=${la},${lo}&dirflg=d`;
  //   return Linking.openURL(url);
  // }

