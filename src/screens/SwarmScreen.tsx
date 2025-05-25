import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppContext } from '../context/AppContext';
import { Treaty } from '../types';

type RootStackParamList = {
  Swarm: undefined;
  Treaty: { treatyId: string };
};

type SwarmScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Swarm'>;

export const SwarmScreen: React.FC = () => {
  const navigation = useNavigation<SwarmScreenNavigationProp>();
  const { treaties, createNewTreaty, saveTreaty } = useAppContext();

  useEffect(() => {
    navigation.setOptions({
      title: 'Treaties',
      headerRight: () => (
        <TouchableOpacity onPress={handleCreateTreaty} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>New</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleCreateTreaty = async () => {
    const newTreaty = createNewTreaty();
    await saveTreaty(newTreaty);
    navigation.navigate('Treaty', { treatyId: newTreaty.id });
  };

  const handleSelectTreaty = (treatyId: string) => {
    navigation.navigate('Treaty', { treatyId });
  };

  const renderTreaty = ({ item }: { item: Treaty }) => {
    const preview = item.content.substring(0, 50) + (item.content.length > 50 ? '...' : '');
    const contactInfo = item.contact ? `${item.contact.type}: ${item.contact.value}` : 'No contact';
    
    return (
      <TouchableOpacity
        style={styles.treatyItem}
        onPress={() => handleSelectTreaty(item.id)}
      >
        <Text style={styles.treatyTitle}>
          {item.metadata.title || `Treaty ${item.id.substring(7, 13)}`}
        </Text>
        <Text style={styles.treatyPreview}>{preview || 'Empty treaty'}</Text>
        <Text style={styles.treatyContact}>{contactInfo}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {treaties.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No treaties yet</Text>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateTreaty}>
            <Text style={styles.createButtonText}>Create First Treaty</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={treaties}
          renderItem={renderTreaty}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerButton: {
    marginRight: 15,
  },
  headerButtonText: {
    color: '#007AFF',
    fontSize: 17,
  },
  listContent: {
    padding: 10,
  },
  treatyItem: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  treatyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  treatyPreview: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  treatyContact: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
