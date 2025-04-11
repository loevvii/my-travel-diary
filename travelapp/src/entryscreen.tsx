import React, { useState, useEffect, useContext } from 'react';
import {View,Text,Button,Image,Alert,StyleSheet,TouchableOpacity,} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import uuid from 'react-native-uuid';
import { GlobalContext } from '../context/globalcontext';

interface TravelEntry {
  id: string;
  photoUri: string;
  address: string;
}

const AddEntryScreen = () => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const navigation = useNavigation();
  const { isDark } = useContext(GlobalContext);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    await ImagePicker.requestCameraPermissionsAsync();
    await Location.requestForegroundPermissionsAsync();
    await Notifications.requestPermissionsAsync();
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({ quality: 0.5 });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhotoUri(uri);
      getAddress();
    }
  };

  const getAddress = async () => {
    const location = await Location.getCurrentPositionAsync({});
    const reverseGeocoded = await Location.reverseGeocodeAsync(location.coords);
    const addr = reverseGeocoded[0];
    setAddress(`${addr.name}, ${addr.city}, ${addr.region}`);
  };

  const saveEntry = async () => {
    if (!photoUri || !address) {
      Alert.alert('Missing info', 'Please take a photo and ensure location is retrieved.');
      return;
    }

    const newEntry: TravelEntry = {
      id: uuid.v4().toString(),
      photoUri,
      address,
    };

    const existingData = await AsyncStorage.getItem('travelEntries');
    const entries = existingData ? JSON.parse(existingData) : [];
    entries.push(newEntry);
    await AsyncStorage.setItem('travelEntries', JSON.stringify(entries));

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Travel entry saved!',
        body: 'Your new travel memory has been added.',
      },
      trigger: null,
    });

    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <View style={styles.contentContainer}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.image} />
        ) : (
          <Text style={[styles.placeholderText, { color: isDark ? '#aaa' : '#000' }]}>
            No photo taken yet.
          </Text>
        )}
        <Text style={[styles.address, { color: isDark ? '#fff' : '#000' }]}>{address}</Text>
      </View>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: isDark ? '#ff453a' : '#007bff' },
          ]}
          onPress={takePhoto}
        >
          <Icon name="camera-alt" size={28} color="#fff" />
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: isDark ? '#ff453a' : '#007bff' },
          ]}
          onPress={saveEntry}
        >
          <Icon name="save" size={28} color="#fff" />
          <Text style={styles.buttonText}>Save Entry</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddEntryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
  address: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 14,
  },
});