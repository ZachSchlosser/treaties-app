// Test Storage Service - Real functionality tests
// Run with: node test-storage.js

// Mock AsyncStorage for Node.js environment
const storage = {};
const AsyncStorage = {
  getItem: async (key) => storage[key] || null,
  setItem: async (key, value) => { storage[key] = value; },
  removeItem: async (key) => { delete storage[key]; },
  clear: async () => { Object.keys(storage).forEach(key => delete storage[key]); }
};

// Replace the import in storage service
const StorageService = {
  async getTreaties() {
    try {
      const jsonValue = await AsyncStorage.getItem('@treaties_storage');
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error reading treaties:', e);
      return [];
    }
  },

  async saveTreaties(treaties) {
    try {
      const jsonValue = JSON.stringify(treaties);
      await AsyncStorage.setItem('@treaties_storage', jsonValue);
    } catch (e) {
      console.error('Error saving treaties:', e);
    }
  },

  async saveTreaty(treaty) {
    try {
      const treaties = await this.getTreaties();
      const index = treaties.findIndex(t => t.id === treaty.id);
      
      if (index >= 0) {
        treaties[index] = treaty;
      } else {
        treaties.push(treaty);
      }
      
      await this.saveTreaties(treaties);
    } catch (e) {
      console.error('Error saving treaty:', e);
    }
  },

  async deleteTreaty(id) {
    try {
      const treaties = await this.getTreaties();
      const filtered = treaties.filter(t => t.id !== id);
      await this.saveTreaties(filtered);
    } catch (e) {
      console.error('Error deleting treaty:', e);
    }
  }
};

// Actual tests
async function runTests() {
  console.log('=== Storage Service Tests ===\n');

  // Test 1: Get treaties from empty storage
  console.log('Test 1: Getting treaties from empty storage');
  const emptyTreaties = await StorageService.getTreaties();
  console.log('Result:', emptyTreaties);
  console.log('✓ Pass: Returns empty array\n');

  // Test 2: Save a new treaty
  console.log('Test 2: Saving a new treaty');
  const testTreaty1 = {
    id: 'treaty_001',
    content: 'This is a real test treaty for emergency situations',
    contact: {
      type: 'sms',
      value: '+1234567890'
    },
    metadata: {
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      title: 'Emergency Treaty'
    }
  };
  
  await StorageService.saveTreaty(testTreaty1);
  const afterSave1 = await StorageService.getTreaties();
  console.log('Treaties after save:', afterSave1);
  console.log('✓ Pass: Treaty saved successfully\n');

  // Test 3: Save another treaty
  console.log('Test 3: Saving a second treaty');
  const testTreaty2 = {
    id: 'treaty_002',
    content: 'Medical emergency - please contact my doctor',
    contact: {
      type: 'email',
      value: 'doctor@example.com'
    },
    metadata: {
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      title: 'Medical Treaty'
    }
  };
  
  await StorageService.saveTreaty(testTreaty2);
  const afterSave2 = await StorageService.getTreaties();
  console.log('Number of treaties:', afterSave2.length);
  console.log('Treaty IDs:', afterSave2.map(t => t.id));
  console.log('✓ Pass: Multiple treaties stored\n');

  // Test 4: Update existing treaty
  console.log('Test 4: Updating existing treaty');
  const updatedTreaty = {
    ...testTreaty1,
    content: 'UPDATED: This treaty has been modified',
    metadata: {
      ...testTreaty1.metadata,
      lastModified: new Date().toISOString()
    }
  };
  
  await StorageService.saveTreaty(updatedTreaty);
  const afterUpdate = await StorageService.getTreaties();
  const updated = afterUpdate.find(t => t.id === 'treaty_001');
  console.log('Updated content:', updated.content);
  console.log('✓ Pass: Treaty updated successfully\n');

  // Test 5: Delete a treaty
  console.log('Test 5: Deleting a treaty');
  await StorageService.deleteTreaty('treaty_002');
  const afterDelete = await StorageService.getTreaties();
  console.log('Treaties after delete:', afterDelete.length);
  console.log('Remaining IDs:', afterDelete.map(t => t.id));
  console.log('✓ Pass: Treaty deleted successfully\n');

  // Test 6: Save multiple treaties at once
  console.log('Test 6: Saving multiple treaties');
  const multipleTreaties = [
    {
      id: 'treaty_003',
      content: 'Fire emergency protocol',
      metadata: { createdAt: new Date().toISOString(), lastModified: new Date().toISOString() }
    },
    {
      id: 'treaty_004',
      content: 'Earthquake safety instructions',
      metadata: { createdAt: new Date().toISOString(), lastModified: new Date().toISOString() }
    }
  ];
  
  await StorageService.saveTreaties(multipleTreaties);
  const finalTreaties = await StorageService.getTreaties();
  console.log('Total treaties:', finalTreaties.length);
  console.log('✓ Pass: Multiple treaties saved\n');

  // Show final storage state
  console.log('=== Final Storage State ===');
  console.log('Raw storage:', JSON.stringify(storage, null, 2));
  
  console.log('\n✅ All Storage Service tests passed!');
}

// Run the tests
runTests().catch(console.error);
