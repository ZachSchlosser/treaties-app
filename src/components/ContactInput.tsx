import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Contact } from '../types';
import { MessagingService } from '../services/messaging';

interface ContactInputProps {
  contact?: Contact;
  onContactChange: (contact: Contact) => void;
}

export const ContactInput: React.FC<ContactInputProps> = ({ contact, onContactChange }) => {
  const [contactType, setContactType] = useState<Contact['type']>(contact?.type || 'sms');
  const [contactValue, setContactValue] = useState(contact?.value || '');
  const [error, setError] = useState<string>('');

  const handleTypeChange = (type: Contact['type']) => {
    setContactType(type);
    setError('');
    const newContact: Contact = { type, value: contactValue };
    if (contactValue && MessagingService.validateContact(newContact)) {
      onContactChange(newContact);
    }
  };

  const handleValueChange = (value: string) => {
    setContactValue(value);
    const newContact: Contact = { type: contactType, value };
    
    if (value) {
      if (MessagingService.validateContact(newContact)) {
        setError('');
        onContactChange(newContact);
      } else {
        setError(getErrorMessage(contactType));
      }
    } else {
      setError('');
    }
  };

  const getErrorMessage = (type: Contact['type']): string => {
    switch (type) {
      case 'sms':
        return 'Invalid phone number';
      case 'email':
        return 'Invalid email address';
      case 'signal':
        return 'Invalid Signal contact';
      default:
        return 'Invalid contact';
    }
  };

  const getPlaceholder = (): string => {
    switch (contactType) {
      case 'sms':
        return 'Enter phone number';
      case 'email':
        return 'Enter email address';
      case 'signal':
        return 'Enter Signal contact';
      default:
        return 'Enter contact';
    }
  };

  const getKeyboardType = () => {
    switch (contactType) {
      case 'sms':
        return 'phone-pad';
      case 'email':
        return 'email-address';
      default:
        return 'default';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Contact Information</Text>
      
      <View style={styles.typeSelector}>
        <TouchableOpacity
          style={[styles.typeButton, contactType === 'sms' && styles.selectedType]}
          onPress={() => handleTypeChange('sms')}
        >
          <Text style={[styles.typeText, contactType === 'sms' && styles.selectedTypeText]}>SMS</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.typeButton, contactType === 'email' && styles.selectedType]}
          onPress={() => handleTypeChange('email')}
        >
          <Text style={[styles.typeText, contactType === 'email' && styles.selectedTypeText]}>Email</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.typeButton, contactType === 'signal' && styles.selectedType]}
          onPress={() => handleTypeChange('signal')}
        >
          <Text style={[styles.typeText, contactType === 'signal' && styles.selectedTypeText]}>Signal</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={contactValue}
        onChangeText={handleValueChange}
        placeholder={getPlaceholder()}
        keyboardType={getKeyboardType()}
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  typeButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  selectedType: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeText: {
    color: '#333',
  },
  selectedTypeText: {
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});
