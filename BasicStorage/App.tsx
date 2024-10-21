import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, Switch, StyleSheet } from 'react-native';
import RNFS from 'react-native-fs';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App: React.FC = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);


  // Function to pick an image from the gallery
  const pickImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (uri) {
          saveImage(uri);
        }
      }
    });
  };

// Function to save the image to local storage and replace the old image
const saveImage = async (uri: string) => {
  const fileName = 'image.jpg';
  const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
  
  try {
    const fileExists = await RNFS.exists(path);
    if (fileExists) {
      await RNFS.unlink(path);
      console.log('Old image deleted:', path);
    }

    // Save the new image to the same location
    await RNFS.copyFile(uri, path);
    console.log('Image saved to local storage:', path);

    // Update the state with the new image path
    setImageUri(null);
    setTimeout(() => setImageUri(path), 100); 

  } catch (error) {
    console.log('Error saving image:', error);
  }
};


  // Function to load the saved image
  const loadImage = () => {
    const fileName = 'image.jpg';
    const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    
    RNFS.exists(path)
      .then((exists) => {
        if (exists) {
          setImageUri(path);
          console.log('Image loaded from local storage:', path);
        } else {
          console.log('Image does not exist');
        }
      })
      .catch((error) => console.log('Error loading image:', error));
  };


  // Load user settings from AsyncStorage when the app starts
  useEffect(() => {
    loadSettings();
    loadImage();
  }, []);

  // Save user settings to AsyncStorage
  const saveSettings = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('darkMode', JSON.stringify(value));
      console.log('Settings saved');
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  // Load user settings from AsyncStorage
  const loadSettings = async () => {
    try {
      const value = await AsyncStorage.getItem('darkMode');
      if (value !== null) {
        setIsDarkMode(JSON.parse(value));
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  // Toggle the dark mode setting
  const toggleDarkMode = (value: boolean) => {
    setIsDarkMode(value);
    saveSettings(value);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
      
      <Button title="Pick Image" onPress={pickImage} />
      <Button title="Load Image" onPress={loadImage} />
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <Text>No image selected</Text>
      )}

      <Text style={{ color: isDarkMode ? '#fff' : '#000', marginTop: 30 }}>
        Dark Mode: {isDarkMode ? 'Enabled' : 'Disabled'}
      </Text>
      <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});

export default App;
