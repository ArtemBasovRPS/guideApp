import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';

let 
markersPoints = [
  {
    latitude: 45.49997739916979,
    longitude: -122.7112418040633,
  },
  {
    latitude: 45.50317986407431,
    longitude: -122.7083698287606,
  },
  {
    latitude: 45.50555880064633,
    longitude: -122.7047143131494,
  }, 
  {
    latitude: 45.51059079907184,
    longitude: -122.6928344741464,
  }, 
  {
    latitude: 45.50956621162111,
    longitude: -122.698317579925,
  }, 
  {
    latitude: 45.51168849315885,
    longitude: -122.71111138165,
  }, 
  {
    latitude: 45.51022473964839,
    longitude: -122.7070642635226,
  }, 
  {
    latitude: 45.50464380078803,
    longitude: -122.6994923874736,
  }, 
  {
    latitude: 45.50171588929248,
    longitude: -122.6951844245195,
  }, 
  {
    latitude: 45.49942844061033,
    longitude: -122.6897013187409,
  }, 
  {
    latitude: 45.51443286965149,
    longitude: -122.7028867229819,
  }, 
  {
    latitude: 45.50995031099672,
    longitude: -122.7032783254981,
  }, 
  {
    latitude: 45.50464380078803,
    longitude: -122.7028867229819,
  }, 
  {
    latitude: 45.50125835999208,
    longitude: -122.7026255428791,
  },
  {
    latitude: 45.49979433524499,
    longitude: -122.7019727602601,
  },
  {
    latitude: 45.50866954794306,
    longitude: -122.7034090831876,
  },
  {
    latitude: 45.50089247487141,
    longitude: -122.6817378401756,
  },
  {
    latitude: 45.50135000714512,
    longitude: -122.6766466721892,
  },
  {
    latitude: 45.50784600026068,
    longitude: -122.6742967218161,
  },
  {
    latitude: 45.51370103334267,
    longitude: -122.6759938895702,
  },
  {
    latitude: 45.51589651371823,
    longitude: -122.6813462376595,
  },
  {
    latitude: 45.51187151840814,
    longitude: -122.6855237782001,
  },
  {
    latitude: 45.50866954794306,
    longitude: -122.6859153807163,
  },
  {
    latitude: 45.5049182553116,
    longitude: -122.6847405731678,
  },
  {
    latitude: 45.50171588929248,
    longitude: -122.6651584357023,
  },
  {
    latitude: 45.50482684894507,
    longitude: -122.6663332432508,
  },
  {
    latitude: 45.50921841639751,
    longitude: -122.666724845767,
  },
  {
    latitude: 45.51269477224675,
    longitude: -122.6671164482832,
  },
  {
    latitude: 45.51543933460369,
    longitude: -122.6676388084888,
  },
  {
    latitude: 45.51607952528268,
    longitude: -122.6635916903615,
  },
  {
    latitude: 45.51699433924986,
    longitude: -122.658500187099,
  },
  {
    latitude: 45.51379266023959,
    longitude: -122.6574558019638,
  },
  {
    latitude: 45.51004170904385,
    longitude: -122.6568033546209,
  },
  {
    latitude: 45.50830347602433,
    longitude: -122.6568033546209,
  },
  {
    latitude: 45.50528434924566,
    longitude: -122.6569337770343,
  },
  {
    latitude: 45.50299681056203,
    longitude: -122.6564114168286,
  },
  {
    latitude: 45.50290540107571,
    longitude: -122.6498842611909,
  },
  {
    latitude: 45.50711407829893,
    longitude: -122.6454455405474,
  },
  {
    latitude: 45.51205454306226,
    longitude: -122.6419207826257,
  },
  {
    latitude: 45.51754312652155,
    longitude: -122.6397012546659,
  },
  {
    latitude: 45.51333522909064,
    longitude: -122.635784894228,
  },
  {
    latitude: 45.50930981563313,
    longitude: -122.6350016891956,
  },
  {
    latitude: 45.50400348002333,
    longitude: -122.6352628692985,
  },
  {
    latitude: 45.50208200405155,
    longitude: -122.636437676847,
  },
  {
    latitude: 45.5082120751546,
    longitude: -122.6376124843955,
  },
  {
    latitude: 45.50830347602433,
    longitude: -122.6408763974905,
  },
  {
    latitude: 45.50866954794306,
    longitude: -122.6430955901742,
  },
  {
    latitude: 45.51553072373705,
    longitude: -122.6403540372849,
  },
  {
    latitude: 45.50738875574625,
    longitude: -122.6348712667823,
  },
  {
    latitude: 45.51598813704057,
    longitude: -122.6373516395688,
  },
  {
    latitude: 45.50574184582816,
    longitude: -122.6477954909205,
  },
  {
    latitude: 45.50528434924566,
    longitude: -122.6754715293646,
  },
  {
    latitude: 45.51498191683931,
    longitude: -122.6842182129622,
  },
  {
    latitude: 45.51571373649114,
    longitude: -122.6787354424596,
  },
  {
    latitude: 45.50354596931329,
    longitude: -122.6748187467456,
  },];

export default class Maps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      polylinePoints: []
    }
    this.handlePress = this.handlePress.bind(this);
  }

  componentDidMount() {
    //TODO
  }

  getRandomInt(min, max) {
    let rand = min + Math.random() * (max - min)
    rand = Math.round(rand);

    return rand;
  }

  handlePress(e) {
    let latLng = e.nativeEvent.coordinate;
    this.setState({
      polylinePoints: [
        ...this.state.polylinePoints,
        {
          latitude: latLng.latitude,
          longitude: latLng.longitude
        }
      ]
    })
    // let latLng = e.nativeEvent.coordinate;
    // polylinePoints.push({
    //   latitude: latLng.latitude,
    //   longitude: latLng.longitude
    // })
    // console.log(polylinePoints)
    // console.log(markersPoints)
    // this.points.push(e.nativeEvent.coordinate);
    // console.log(this.points)
    // this.setState({
    //   markers: [
    //     ...this.state.markers,
    //     {
    //       coordinate: e.nativeEvent.coordinate,
    //       cost: `$${this.getRandomInt(50, 300)}`
    //     }
    //   ]
    // })
  }

  render() {
    return (
      <MapView provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 45.5209087,
          longitude: -122.6705107,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={this.handlePress}
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
        {markersPoints.map((marker, index) => {
          return (
            <Marker key={index} coordinate={marker} >
              <View style={styles.marker}>
              {/*<Text style={styles.text}>{marker.cost}</Text>*/}
              </View>
            </Marker>
          )
        })}
      </MapView>
    );
  }
}

const styles = StyleSheet.create({
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

