'use strict';

const APIKEY = 'AIzaSyB9kkiGSu4UfmDXDYKdID1JapWMI8szbHw';

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
//	Делать запросы поиска мест при каждой смене region   !!!!!!!!!!!!!!!!!!!!!!!!!
export default class Api {
	constructor() {
	}

	getRandomInt = (min, max) => {
    let rand = min + Math.random() * (max - min)
    rand = Math.round(rand);

    return rand;
  }

  decode = (t,e) => {
    for(var n,o,u=0,l=0,r=0,d= [],h=0,i=0,a=null,c=Math.pow(10,e||5);u<t.length;) {
      a=null,h=0,i=0;
      do 
      	a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;
      while(a>=32);
      n=1&i?~(i>>1):i>>1,h=i=0;
      do 
      	a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;
      while(a>=32);
      o=1&i?~(i>>1):i>>1,l+=n,r+=o,d.push([l/c,r/c])
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
// // https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU&key=YOUR_API_KEY
//   getPhotoRequest = (photo_reference) => {
//     const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${400}&photoreference=${photo_reference}&key=${APIKEY}`;
//     return new Promise((resolve, reject) => {
//       fetch(url)
//       .then(response => {
//         console.log('----------------------');
//         console.log(response.url);
//         console.log()
//         let url = response.url
//         resolve(url);
//       }) 
//       .catch(e => {console.warn(e)})
//     })
//   }

//   getPhoto = (photo_reference) => {
//     this.getPhotoRequest(photo_reference)
//     .then(response => response)
//     .catch(err => {console.log(err)})
//   }

//   parsePhoto = (data) => {
//     return data.reduce((result, item) => {
//       return [
//         ...result,
//         {
//           url: this.getPhoto(item.photo_reference),
//         }
//       ]
//     }, [])
//   }

  parseSearchData = (data) => {
    console.log(data)
  	return data.reduce((result, item) => {
  		return [
	  		...result,
	  		{
	  			coordinate: {
	  				latitude: item.geometry.location.lat,
	  				longitude: item.geometry.location.lng
	  			},
	  			icon: item.icon,
	  			place_id: item.place_id,
          name: item.name,
          vicinity: item.vicinity,
	  		}
  		]
  	}, [])
  }

  getNearPlaces = (point, radius, name, types="", language="ru") => {
    // const url = `https://maps.googleapis.com/maps/api/place/radarsearch/json?location=${point.latitude},${point.longitude}&radius=${radius}&types=${types}&name=${name}&language=${language}&key=${APIKEY}`;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${point.latitude},${point.longitude}&radius=${radius}&types=${types}&name=${name}&language=${language}&key=${APIKEY}`;
    //const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query="${name} in Minsk"&language=${language}&key=${APIKEY}`;
    return new Promise((resolve, reject) => {
      fetch(url)
      .then(response => response.json())
      .then(json => {
      	if (json.status === "OK") {
      			console.log(json.results)
      			resolve(this.parseSearchData(json.results))
      	} else {
      			reject(json.status)
      	}
      })
      .catch(e => {console.warn(e)})
    })
  }
} 
