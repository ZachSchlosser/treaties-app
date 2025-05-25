import { Linking, Alert, Clipboard } from 'react-native';
import { Contact } from '../types';

export const MessagingService = {
  async sendMessage(contact: Contact, message: string, isTest: boolean = false): Promise<void> {
    const finalMessage = isTest 
      ? `This is a test of the treaty, not an actual summons\n\n${message}`
      : message;

    try {
      switch (contact.type) {
        case 'sms':
          await this.sendSMS(contact.value, finalMessage);
          break;
        case 'email':
          await this.sendEmail(contact.value, finalMessage);
          break;
        case 'signal':
          await this.sendSignal(contact.value, finalMessage);
          break;
      }
    } catch (error) {
      Alert.alert('Error', `Failed to send message: ${error}`);
    }
  },

  async sendSMS(phoneNumber: string, message: string): Promise<void> {
    const url = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
    const canOpen = await Linking.canOpenURL(url);
    
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      throw new Error('SMS not supported on this device');
    }
  },

  async sendEmail(email: string, message: string): Promise<void> {
    const subject = 'Treaty Summons';
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    const canOpen = await Linking.canOpenURL(url);
    
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      throw new Error('Email not supported on this device');
    }
  },

  async sendSignal(contact: string, message: string): Promise<void> {
    // Signal doesn't have a direct deep link for pre-filled messages
    // We'll copy the message to clipboard and open Signal
    await Clipboard.setString(message);
    
    // Try to open Signal app
    const signalUrl = 'signal://';
    const canOpen = await Linking.canOpenURL(signalUrl);
    
    if (canOpen) {
      Alert.alert(
        'Message Copied',
        'The treaty message has been copied to your clipboard. Please paste it in Signal after selecting the contact.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Signal', onPress: () => Linking.openURL(signalUrl) }
        ]
      );
    } else {
      Alert.alert(
        'Signal Not Found',
        'Signal app is not installed. The message has been copied to your clipboard.',
        [{ text: 'OK' }]
      );
    }
  },

  validateContact(contact: Contact): boolean {
    switch (contact.type) {
      case 'sms':
        // Basic phone number validation
        return /^[\d\s\-\+\(\)]+$/.test(contact.value) && contact.value.length >= 10;
      case 'email':
        // Basic email validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.value);
      case 'signal':
        // Signal can use phone numbers or usernames
        return contact.value.length > 0;
      default:
        return false;
    }
  }
};
