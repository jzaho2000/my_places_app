import React, {useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import {Icon, Input, Button, ListItem} from 'react-native-elements';
import MapView, {Marker} from 'react-native-maps';
import { StyleSheet, Text, View, Alert } from 'react-native';


/*<Input placeholder='Type your firstname’ label=’FIRSTNAME’
onChangeText={description => setDesc({description})}
value={description}/>
<Button raised icon={{name: 'save'}} onPress={saveItem}
title="SAVE" />*/

export default function MapAdddressView({route, navigation}) {
  
  let defaultCoord = {latitude: 60.200692,longitude: 24.934302,latitudeDelta: 0.0322, longitudeDelta: 0.0221};;
  let defaultMark= {latitude: 60.200692,longitude: 24.934302 };
  let KEY = '1234567890abcdefghijklmnopqr';
  const {address} = route.params;
  console.log(address);
  const [coord,setCoord] = React.useState(defaultCoord);
  const [mark, setMark] = React.useState(defaultMark);

  function findLocation() {
    
    const uri = 'http://www.mapquestapi.com/geocoding/v1/address?key=' + KEY + 
                '&location=' + encodeURIComponent(address)  + '&outFormat=json&thumbMaps=false';
 
    console.log(uri);
  
    fetch(uri)
    .then((response) => response.json()) 
    .then((responseJson) => {
      
      console.log(JSON.stringify(responseJson));

      let co = responseJson.results[0].locations[0].displayLatLng;

      let lat = co.lat;
      let lng = co.lng;
      let dLat = coord.latitudeDelta;
      let dLng = coord.longitudeDelta;

      let new_coord = {latitude: (lat), longitude: (lng), latitudeDelta: (dLat), longitudeDelta: (dLng)};
      let m = {latitude: (lat), longitude: (lng)};
      

      setCoord(new_coord);
      setMark(m);
          
    })
    .catch((error) => {
      Alert.alert('Error', error.message );
    });


  }

  useEffect(() => {
    findLocation();

  }, []);

  return (
    <View style={styles.container}>
      <MapView style={styles.redView} 
        region = {coord}
      >
        <Marker coordinate={mark}
                 title={address} />
      </MapView>
      
     

      <View style={styles.blueView}>
        <Button title="SHOW" onPress={() => findLocation()} />
      </View>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  redView: {
    marginTop: 20,
    width: '100%',
    flex: 4/5,
    
  },
  blueView: {
    flex: 1/5,
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
  
  }

});