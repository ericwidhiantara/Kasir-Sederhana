import React from 'react';
import { StyleSheet, Text, View} from 'react-native';

export default class HelloWorld  extends React.Component {
    render() {
    return (
      <View style = {styles.container}>
           <Text>Hello World</Text>
           <Text>Saya Calon Programmer Handal React-Native</Text>
         </View>
       );
  }
}

const styles =StyleSheet.create({
  container : {
    flex: 1,
    backgroundColor: '#ffff99',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
