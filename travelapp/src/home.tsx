import React, { useEffect, useState, useContext } from 'react';
import {View,Text,FlatList,Image,TouchableOpacity,StyleSheet,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { GlobalContext } from '../context/globalcontext';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface TravelEntry {
  id: string;
  photoUri: string;
  address: string;
  timestamp: number;
}

const HomeScreen = () => {
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { isDark, toggleTheme } = useContext(GlobalContext);

  useEffect(() => {
    if (isFocused) loadEntries();
  }, [isFocused]);

  const loadEntries = async () => {
    const data = await AsyncStorage.getItem('travelEntries');
    const parsedData: TravelEntry[] = data ? JSON.parse(data) : [];
    parsedData.sort((a, b) => b.timestamp - a.timestamp);
    setEntries(parsedData);
  };

  const removeEntry = async (id: string) => {
    const newEntries = entries.filter(entry => entry.id !== id);
    await AsyncStorage.setItem('travelEntries', JSON.stringify(newEntries));
    setEntries(newEntries);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#000' }]}>
          Travel Memories
        </Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.darkModeButton}>
          <Icon
            name={isDark ? 'brightness-3' : 'wb-sunny'}
            size={28}
            color={isDark ? '#fff' : '#000'}
          />
        </TouchableOpacity>
      </View>

      {entries.length === 0 ? (
        <Text style={[styles.noEntriesText, { color: isDark ? '#fff' : '#000' }]}>
          No entries yet.
        </Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.entryContainer}>
              <Image source={{ uri: item.photoUri }} style={styles.photo} />

              <Text style={[styles.locationText, { color: isDark ? '#fff' : '#000' }]}>
                {item.address}
              </Text>

              <TouchableOpacity onPress={() => removeEntry(item.id)}>
                <Icon
                  name="delete"
                  size={28}
                  color={isDark ? '#ff453a' : '#ff453a'}
                  style={styles.trashIcon}
                />
              </TouchableOpacity>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.flatListContent}
        />
      )}

      <TouchableOpacity
        style={[
          styles.fab,
          { backgroundColor: isDark ? '#ff453a' : '#007bff' },
        ]}
        onPress={() => navigation.navigate('AddEntry')}
      >
        <Icon name="add" size={36} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  darkModeButton: {
    padding: 8,
  },
  noEntriesText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  entryContainer: {
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: (props: any) => props.theme.isDark ? '#111' : '#fff',
    padding: 16,
  },
  photo: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  trashIcon: {
    alignSelf: 'flex-end',
  },
  separator: {
    height: 16,
  },
  flatListContent: {
    paddingBottom: 80, 
  },
  fab: {
    position: 'absolute',
    bottom: 40,
    right: '40%',
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});