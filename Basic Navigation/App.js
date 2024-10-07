import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function Screen1({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>This is Page 1</Text>
      <Button
        title="Go to Page 2"
        onPress={() => navigation.navigate('Screen2')}
      />
      <StatusBar style="auto" />
    </View>
  );
}

function Screen2({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>This is Page 2</Text>
      <Button
        title="Go back to Page 1"
        onPress={() => navigation.navigate('Screen1')}
      />
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Screen1">
        <Stack.Screen name="Screen1" component={Screen1} options={{ title: 'Page 1' }} />
        <Stack.Screen name="Screen2" component={Screen2} options={{ title: 'Page 2' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
