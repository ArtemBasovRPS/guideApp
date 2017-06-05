import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';

import Ionicon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Maps from './GoogleMaps/Maps';

let {height, width} = Dimensions.get('window');

const Profile = (props) => {
	return (
		<Image style={{flex: 1, width: null,height: null,resizeMode: 'cover', }}>	
			<View style={styles.container}>
			<ScrollView >
				<View style={{height: 300, backgroundColor: '#35B79F', width, justifyContent: 'center', alignItems: 'center'}}>
					<View style={styles.user}>
						<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30}}>
							<View style={{borderBottomWidth: .5, flex:2, borderColor: '#F2F2F2'}}/>
							<Image source={require('../assets/post.png')} style={styles.avatar} />
							<View style={{borderBottomWidth: .5, flex:2, borderColor: '#F2F2F2'}}/>
						</View>
						<View >
							<Text style={styles.text}>Artem Basov</Text>
							<Text style={styles.location}>Minsk, Belarus</Text>
						</View>
					</View>

					<TouchableOpacity
						activeOpacity={.8}
						onPress={() => {}}
						style={{borderWidth: 2, borderColor: '#fff', borderRadius: 25, marginTop: 30,height: 50, width:150, justifyContent: 'center', alignItems: 'center'}}
						>
						<Text style={{color: '#fff', fontSize: 18}}>Edit Profile</Text>
					</TouchableOpacity>	

					<View style={{flex: 1,  flexDirection: 'column', marginTop: 15, width,}}>
					<View style={{flexDirection: 'row', height: 50, justifyContent: 'space-between'}}>
						<View style={{flex:1, height: 50,backgroundColor: "rgba(25,100,200,.2)"}}>
							<Text style={styles.text}>3</Text>
							<Text style={styles.info}>Goals</Text> 
						</View>
						<View style={{flex:1, height: 50,backgroundColor: "rgba(25,100,200,.2)", borderLeftWidth: .5,}}>
							<Text style={styles.text}>3</Text>
							<Text style={styles.info}>Visited City</Text> 
						</View>
						<View style={{flex:1,height: 50, backgroundColor: "rgba(25,100,200,.2)", borderLeftWidth: .5}}>
							<Text style={styles.text}>1</Text>
							<Text style={[styles.info, styles.center]}>Routes</Text> 
						</View>
					</View>
					{/*<View style={{flex: 1, marginBottom: 50}}>
						<Maps/>	
					</View>	*/}
				</View>

				</View>





				<View>
					<TouchableOpacity activeOpacity={.6} style={{alignItems: 'flex-start'}}>
						<View style={{flexDirection: 'row', alignItems:'center', width, height: 60}}>
							<Ionicon name="md-create"  style={{fontSize: 23, marginLeft: 20,color: '#d94b4e'}}/>
							<View style={{borderBottomWidth: 1, width: width-70, marginHorizontal: 20, height: 60, justifyContent: 'center', borderColor: '#F2F2F2'}}><Text>Plan the day</Text></View>
						</View>
					</TouchableOpacity>
					<TouchableOpacity activeOpacity={.6} style={{alignItems: 'flex-start', }}>
						<View style={{flexDirection: 'row',alignItems:'center', width, height: 60}}>
							<Ionicon name="md-map" style={{fontSize: 23, marginLeft: 20,color: '#d94b4e'}}/>
							<View style={{borderBottomWidth: 1, width: width-70, marginHorizontal: 20, height: 60, justifyContent: 'center', borderColor: '#F2F2F2'}}><Text>Maps</Text></View>
						</View>
					</TouchableOpacity>
					<TouchableOpacity activeOpacity={.6} style={{alignItems: 'flex-start', }}>
						<View style={{flexDirection: 'row', alignItems:'center', width, height: 60}}>
							<MaterialIcons name="room" style={{fontSize: 23, marginLeft: 15,color: '#d94b4e'}}/>
							<View style={{borderBottomWidth: 1, width: width-70, marginHorizontal: 20,height: 60, justifyContent: 'center', borderColor: '#F2F2F2'}}><Text>My routes</Text></View>
						</View>
					</TouchableOpacity>
					<TouchableOpacity activeOpacity={.6} style={{alignItems: 'flex-start', }}>
						<View style={{flexDirection: 'row', alignItems:'center', width, height: 60}}>
							<MaterialIcons name="add-location" style={{fontSize: 23, marginLeft: 15, color: '#d94b4e'}}/>
							<View style={{borderBottomWidth: 1, width: width-70, marginHorizontal: 20,height: 60, justifyContent: 'center', borderColor: '#F2F2F2'}}><Text >Create place</Text></View>
						</View>
					</TouchableOpacity>
					<TouchableOpacity activeOpacity={.6} style={{alignItems: 'flex-start', }}>
						<View style={{flexDirection: 'row', alignItems:'center', width, height: 60}}>
							<MaterialIcons name="power-settings-new" style={{fontSize: 23, marginLeft: 15,color: '#d94b4e'}}/>
							<View style={{borderBottomWidth: 1, width: width-70, marginHorizontal: 20,height: 60, justifyContent: 'center', borderColor: '#F2F2F2'}}><Text >Logout</Text></View>
						</View>
					</TouchableOpacity>
				</View>







				</ScrollView>
			</View>
		</Image>
	)
}

const styles = StyleSheet.create({
	container: {
		marginTop: 40, 
		
		height: height -  49.5,
		// justifyContent: 'flex-start',
		// alignItems: 'center',
	},
	user: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	avatar: {
		width: 81,
		height: 81,
		borderRadius: 41,
		resizeMode: 'cover',
		backgroundColor: '#C2C2C2',
		borderWidth: 5,
		borderColor: 'transparent',
		flex:1,
	},
	text: {
		textAlign: 'center',
		color: '#fff',
		fontSize: 23,
	},
	location: {
		fontSize: 14,
		textAlign: 'center',
		color: '#fff',
	},
	info: {
		textAlign: 'center',
		color: '#f2f2f2',
		fontSize: 12,
		marginTop: 5,
	},
	center: {
		// marginHorizontal: 60
	},
});

export default Profile;
