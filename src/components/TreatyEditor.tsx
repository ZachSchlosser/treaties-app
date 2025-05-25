import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';

interface TreatyEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  placeholder?: string;
}

export const TreatyEditor: React.FC<TreatyEditorProps> = ({ 
  content, 
  onContentChange, 
  placeholder = 'Enter treaty text...' 
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Treaty Text</Text>
      <TextInput
        style={styles.textInput}
        value={content}
        onChangeText={onContentChange}
        placeholder={placeholder}
        multiline
        textAlignVertical="top"
        autoCapitalize="sentences"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    minHeight: 200,
  },
});
