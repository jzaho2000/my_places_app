import React, {useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import {Header, Icon, Input, Button, ListItem} from 'react-native-elements';
import * as SQLite from 'expo-sqlite';
import { StyleSheet, Text, View, FlatList, Alert, TouchableOpacity} from 'react-native';



/*<Input placeholder='Type your firstname’ label=’FIRSTNAME’
onChangeText={description => setDesc({description})}
value={description}/>
<Button raised icon={{name: 'save'}} onPress={saveItem}
title="SAVE" />*/

export default function HomeView({navigation}) {
  const [address,setAddress] = React.useState('');
  const [addressList, setAddressList] = React.useState([]);
  const db = SQLite.openDatabase('addresslist.db');


  useEffect( () => {
    db.transaction(
      tx => {
        tx.executeSql('create table if not exists addresslist(id integer primary key not null, address text not null);');
      }, 
      showError, 
      updateList
    );
    
  }, []);



  const showError = (error) => {
    console.log(error.message);
  }

  const updateList = () =>  {
    db.transaction( 
      tx => {
          tx.executeSql('select id, address from addresslist order by address;', [], (_, {rows})  =>setAddressList(rows._array) );
      }, 
      showError, 
      null
    );
  }

  const addAddress = () => {
    if (address == null || address.trim() == '' )
      return;

    db.transaction(
      tx => {
          tx.executeSql('insert into addresslist (address) values (?);',
                        [address]);
          setAddress('');
      },
      showError,
      updateList
    );
  }

  const deleteAddress = (id, add) => {

    Alert.alert(
      'Delete address',
      'Do you want to delete address ' + add,
      [
        {text: 'YES',
         onPress: () => {
          db.transaction(
            tx => {
                tx.executeSql('delete from addresslist where id = ?', [id]);
            },
            showError,
            updateList
          );
         }
        },
        {
          text: 'NO'
        }
      ],
      {cancelable: false}
    );
    //console.log("Delete product " + id);

  }

  const showMap = (address) => {
    if (address == null || address.trim() == '')
      return;

    navigation.navigate('Map', {address});
  }

  renderItem = ({item}) => (
      <ListItem bottomDivider>
        <ListItem.Content style={styles.listContent} >
          <ListItem.Title style={styles.titleStyle} onLongPress={() => deleteAddress(item.id, item.address)} >{item.address}</ListItem.Title>
          <ListItem.Subtitle><Text style={styles.linkStyle} onPress={() => showMap(item.address)} >show on map &gt;</Text></ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchView} >
        <Input placeholder='Type in address' label='PLACEFINDER' 
               onChangeText={address => setAddress(address)}
               value={address}
               inputContainerStyle={styles.addressStyle} />
        <Button raised icon={{name: 'save', color: 'white'}} buttonStyle={{backgroundColor:'grey'}} title="SAVE" onPress={addAddress} />
      </View>
      <View style={styles.addList}>
        <FlatList data={addressList} 
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
        />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
    //justifyContent: 'center',
    marginTop: 0
  },
  searchView : {
    paddingLeft: 10,
    paddingRight: 10
  },
  addressStyle: {
    borderBottomColor: 'green',
    borderBottomWidth: 2
  },
  addList : {
  },
  listContent : {
    flexDirection: 'row',
    
  },
  titleStyle: {
    alignContent: 'flex-start',
    width: '70%'
  },
  linkStyle : {
    paddingLeft: 10,
    marginLeft: 10,
    color: 'lightgrey'
  }

});