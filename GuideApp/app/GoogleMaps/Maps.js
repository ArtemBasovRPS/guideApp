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
  segments = [];

  constructor(props) {
    super(props);
    this.state = {
      points: null,
      markers: [],
      polylinePoints: [],
      markers: [],
    }
    this.map = null;
  }

  componentDidMount() {
    //TODO
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

  addPolylinePoint = (latitude, longitude) => {
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

    if (length > 0) {
      this.getWayPoints(this.state.polylinePoints[length - 1], {latitude, longitude})
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
        this.addPolylinePoint(latitude, longitude);
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

  handlePress(e) {
    if (e.nativeEvent.coordinate) {
      this.addMarkerPoint(e.nativeEvent.coordinate)
      this.addPolylinePoints(e.nativeEvent.coordinate)
    } else {
      return;
    }
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
        segment = this.segments[index]
        startPoint = e.nativeEvent.coordinate;
        endPoint = segment[segment.length - 1];
    } else if (index === this.segments.length - 1) {
        startPoint = this.segments[index][0];
        endPoint = e.nativeEvent.coordinate;
    } else {
        segment = this.segments[index]
        startPoint = segment[0];
        endPoint = e.nativeEvent.coordinate;

        startPointNext = e.nativeEvent.coordinate;
        segment = this.segments[index + 1];
        endPointNext = segment[segment.length - 1];
    }

    try {
      if (!startPointNext && !endPointNext) {
        let resPoints = await this.getWayPoints(startPoint, endPoint);
        this.replaceSegment(resPoints, index)
      } else {
        let 
            [resPointsPreviousSegment, 
             resPointsNextSegment] = await Promise.all([this.getWayPoints(startPoint, endPoint), this.getWayPoints(startPointNext, endPointNext)]);

        this.replaceSegment(resPointsPreviousSegment, index)
        this.replaceSegment(resPointsNextSegment, index + 1)
      }

    } catch (e) {
      console.log(e)
    }

    this.replaceRoute();

  }

  onRegionChangeComplete(region) {
    console.log(region)
  }

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
          {this.state.markers.length > 0
            ?
              this.state.markers.map((marker, index) => {
                return (
                  <Marker 
                    key={index} 
                    coordinate={marker} 
                    draggable
                    onDragStart={(e) => {
                      console.log(index + 'marker drag start')
                    }}
                    onDragEnd={(e) => {this.updateRoute(e, index)}}>
                  </Marker>
                )
              })
            :
              null
          }
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 64,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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
});
