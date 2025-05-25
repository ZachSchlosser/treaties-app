export interface Treaty {
  id: string;
  content: string;
  contact?: Contact;
  metadata: {
    createdAt: string;
    lastModified: string;
    title?: string;
  };
}

export interface Contact {
  type: 'sms' | 'email' | 'signal';
  value: string;
}

export interface AppState {
  treaties: Treaty[];
  selectedTreatyId?: string;
}

export interface LLMResponse {
  content: string;
  error?: string;
}
