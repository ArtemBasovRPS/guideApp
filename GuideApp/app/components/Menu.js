import React, {Component} from 'react';
import {
	View,
	StyleSheet,
	Text,
	Image,
	Dimensions,
	TouchableOpacity,
	ScrollView
} from 'react-native';

import Ionicon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import ModalView from './ModalView';

import Api from '../helpers/api';
const api = new Api();

const screen = Dimensions.get('window');
const places = [{icon: 'flight', name: 'airport'}, 
								{icon: 'directions-bus', name: 'bus station'}, 
								{icon: 'local-bar', name: 'bar'}, 
								{icon: 'local-cafe', name: 'cafe'}, 
								{icon: 'restaurant', name: 'restaurant'}, 
								{icon: 'local-hotel', name: 'lodging'}, 
							  {icon: 'train', name: 'train station'},
							  {icon: 'local-pharmacy', name: 'pharmacy'}];//hospital

export default class Menu extends Component {
	constructor(props) {
		super(props)
		console.log(props)
	}

	getData = (location, names, radius=5000) => {
		//{latitude: 53.90428042342294, longitude: 27.56048619747162}
    //this.state.currentPosition
    console.log(location)
    console.log(names)
    this.props.onHide()
    api.getNearPlaces(location, radius, names)
    .then(response => {
      //console.log(response)
      console.log(1)
      this.props.passPlaces(response)
    })
	}

	render() {
		return (
			<View style={{height: screen.height -  49.5, backgroundColor: '#2e2f43'}}>
				<View style={styles.tabBarStyle}>
					<TouchableOpacity
						activeOpacity={.85}
           	onPress={() => {this.props.onHide()}}
            style={styles.navigationBarButton} >  
              <Ionicon name='ios-arrow-back' style={styles.iconClose} /> 
          </TouchableOpacity>
					<Text style={styles.title}>My routes</Text>
					<View style={{flex: 1}}/>
				</View>
				<ScrollView>
				<View style={{height: screen.height, flexDirection: 'row', backgroundColor: '#1a2d43'}}>
					{/*<View style={styles.menu}>
											{places.map((place, index) => {
					
												return (
													<TouchableOpacity key={index} activeOpacity={.85} style={styles.item} onPress={() => {this.getData(this.props.currentPosition, place.name)}}>
														<MaterialIcons name={place.icon} style={[styles.icon, styles.iconPlace]} />
														<Text style={{marginTop: 10, fontSize: 16, color: '#f2f2f2'}}>{place.name}</Text>
													</TouchableOpacity>
												)
											})}
										</View>*/}
					<View style={styles.menu}>
						<View style={[styles.itemRoute]}>
							<View>
								<Text>My first route</Text>
								<Text>Description first rote</Text>
							</View>
							<Ionicon name="ios-arrow-forward-outline" style={{color: "black", fontSize: 28, marginRight: 30}}/>
						</View>
						<View style={[styles.itemRoute]}>
							<View>
								<Text>My second route</Text>
								<Text>Description second rote</Text>
								</View>
								<Ionicon name="ios-arrow-forward-outline" style={{color: "black", fontSize: 28, marginRight: 30}}/>
						</View>
						<View style={[styles.itemRoute]}>
						<View>
							<Text>My third route</Text>
							<Text>Description third rote</Text>
							</View>
							<Ionicon name="ios-arrow-forward-outline" style={{color: "black", fontSize: 28, marginRight: 30}}/>
							
						</View>
					</View>
					<View style={styles.containerSetting}>
						<TouchableOpacity
							activeOpacity={.85}
	           	onPress={() => {this.props.onHide()}}
	            style={styles.itemSetting} >  
	              <Ionicon name='md-pin' style={[styles.icon]} /> 
	              <Text style={{textAlign: 'center',color: '#f2f2f2'}}>Places</Text>
	          </TouchableOpacity>
	          <TouchableOpacity
							activeOpacity={.85}
	           	onPress={() => {this.props.onHide()}}
	            style={styles.itemSetting} >  
	              <MaterialIcons name='add-circle' style={[styles.icon]} />
	              <Text style={{textAlign: 'center',color: '#f2f2f2'}}>Create route</Text>
	          </TouchableOpacity>
	          <TouchableOpacity
							activeOpacity={.85}
	           	onPress={() => {this.props.onHide()}}
	            style={styles.itemSetting} >  
	              <MaterialIcons name='add-location' style={styles.icon} />
	              <Text style={{textAlign: 'center',color: '#f2f2f2'}}>Add place</Text>
	          </TouchableOpacity>
	          <TouchableOpacity
							activeOpacity={.85}
	           	onPress={() => {this.props.onHide()}}
	            style={styles.itemSetting} >  
	              <MaterialIcons name='edit-location' style={[styles.icon, {color: "#d94b4e"}]}/>
	              <Text style={{textAlign: 'center', color: "#d94b4e"}}>Edit route</Text>
	          </TouchableOpacity>
					</View>
				</View>
				</ScrollView>
			</View>
			
		)
	}
}

const styles = StyleSheet.create({
	menu: {
		height: screen.height,
		// flex: 5,
		width: 310,
		// flexDirection: 'row',
		flexDirection: 'column',
   	// flexWrap: 'wrap',
   	// justifyContent: 'space-around',
   	backgroundColor: "#FAFAFA",
	},
	itemRoute: {
		height: 80,
		borderColor: '#562239',
		borderBottomWidth: 2,
		justifyContent: 'space-between',
		alignItems: "center",
		marginLeft: 8,
		color: "#FAFAFA",
		flexDirection: 'row'
	},
	tabBarStyle: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2e2f43',
  },
  navigationBarButton: {
    // flex: 1,
    width: 65,
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
	item: {
		width: 140,
		height: 140,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: .5,
		borderColor: '#f2f2f2',
		borderRadius: 16,
		margin: 5.5
	},
	itemText: {
		fontSize: 17,
		lineHeight: 20,
		textAlign: 'center',
	},
	close: {
		height: 66,
		justifyContent: 'center',
		alignItems: 'center',	
	},
	iconClose: {
		justifyContent: 'flex-start',
		color: '#fff',
		fontSize: 36, 
		marginLeft: 12
	},
	containerSetting: {
		flex: 1, 
		height: screen.height, 
		backgroundColor: '#1a2d43',
	  borderLeftWidth: 2, 
	  borderColor: '#2e2f43',
	},
	itemSetting: {
		height: 80,
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: '#562239',
		borderBottomWidth: 2,
	},
	icon: {
    color: '#737382',
    fontSize: 36,
    fontWeight: 'normal',
  },
  iconPlace: {
  	color: '#09C',
  	marginTop: 30,
  }
})

