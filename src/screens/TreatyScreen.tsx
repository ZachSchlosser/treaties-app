import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Treaty, Contact } from '../types';
import { useAppContext } from '../context/AppContext';
import { TreatyEditor } from '../components/TreatyEditor';
import { ContactInput } from '../components/ContactInput';
import { ActionButtons } from '../components/ActionButtons';
import { MessagingService } from '../services/messaging';
import { getOpenAIService } from '../services/openai';
import { config } from '../config';

type RootStackParamList = {
  Swarm: undefined;
  Treaty: { treatyId: string };
};

type TreatyScreenRouteProp = RouteProp<RootStackParamList, 'Treaty'>;
type TreatyScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Treaty'>;

export const TreatyScreen: React.FC = () => {
  const navigation = useNavigation<TreatyScreenNavigationProp>();
  const route = useRoute<TreatyScreenRouteProp>();
  const { treaties, saveTreaty } = useAppContext();
  
  const treatyId = route.params.treatyId;
  const treaty = treaties.find(t => t.id === treatyId);
  
  const [content, setContent] = useState(treaty?.content || '');
  const [contact, setContact] = useState<Contact | undefined>(treaty?.contact);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: treaty?.metadata.title || 'Treaty',
      headerLeft: () => null,
    });
  }, [navigation, treaty]);

  useEffect(() => {
    // Auto-save when content or contact changes
    const saveTimer = setTimeout(() => {
      if (treaty && (content !== treaty.content || contact !== treaty.contact)) {
        handleSave();
      }
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [content, contact]);

  const handleSave = async () => {
    if (!treaty) return;
    
    setIsSaving(true);
    const updatedTreaty: Treaty = {
      ...treaty,
      content,
      contact,
      metadata: {
        ...treaty.metadata,
        lastModified: new Date().toISOString()
      }
    };
    
    await saveTreaty(updatedTreaty);
    setIsSaving(false);
  };

  const handleSendMessage = async (isTest: boolean) => {
    if (!contact) return;
    
    // Save before sending
    await handleSave();
    
    // Send message
    await MessagingService.sendMessage(contact, content, isTest);
  };

  const handleContentChange = async (newContent: string) => {
    setContent(newContent);
    
    // Check if content might be meant for LLM processing
    // This is a placeholder - you can adjust the trigger logic
    if (newContent.endsWith('\n\n')) {
      const openAI = getOpenAIService(config.openai.apiKey);
      const response = await openAI.sendToLLM(newContent.trim());
      
      if (response.content && !response.error) {
        // Append LLM response to content
        setContent(newContent + '\n---\n' + response.content);
      }
    }
  };

  if (!treaty) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TreatyEditor
            content={content}
            onContentChange={handleContentChange}
          />
          
          <ContactInput
            contact={contact}
            onContactChange={setContact}
          />
        </ScrollView>
        
        <ActionButtons
          contact={contact}
          message={content}
          onSendMessage={handleSendMessage}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
});
