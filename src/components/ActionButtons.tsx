import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Contact } from '../types';
import { MessagingService } from '../services/messaging';

interface ActionButtonsProps {
  contact?: Contact;
  message: string;
  onSendMessage: (isTest: boolean) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ contact, message, onSendMessage }) => {
  const handleAction = (isTest: boolean) => {
    if (!contact || !contact.value) {
      Alert.alert('Missing Contact', 'Please enter contact information before sending.');
      return;
    }

    if (!message.trim()) {
      Alert.alert('Empty Message', 'Please enter treaty text before sending.');
      return;
    }

    if (!MessagingService.validateContact(contact)) {
      Alert.alert('Invalid Contact', 'Please enter valid contact information.');
      return;
    }

    Alert.alert(
      'Confirm?',
      `Send treaty to ${contact.value} via ${contact.type.toUpperCase()}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Confirm',
          onPress: () => onSendMessage(isTest)
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.summonButton]}
        onPress={() => handleAction(false)}
      >
        <Text style={styles.buttonText}>Summon</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.testButton]}
        onPress={() => handleAction(true)}
      >
        <Text style={styles.testButtonText}>Test</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summonButton: {
    backgroundColor: '#007AFF',
    flex: 2,
    marginRight: 10,
  },
  testButton: {
    backgroundColor: '#f0f0f0',
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  testButtonText: {
    color: '#333',
    fontSize: 16,
  },
});
