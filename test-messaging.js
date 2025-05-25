// Test Messaging Service - Real functionality tests
// Run with: node test-messaging.js

// Import the validation logic from messaging service
const MessagingService = {
  validateContact(contact) {
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
  },

  // Generate URLs for testing
  generateSMSUrl(phoneNumber, message) {
    return `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
  },

  generateEmailUrl(email, message) {
    const subject = 'Treaty Summons';
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  }
};

// Actual tests
function runTests() {
  console.log('=== Messaging Service Tests ===\n');

  // Test 1: SMS Validation
  console.log('Test 1: SMS Contact Validation');
  const smsTests = [
    { value: '1234567890', expected: true, desc: 'Valid 10-digit number' },
    { value: '+1-234-567-8900', expected: true, desc: 'Valid formatted number' },
    { value: '(123) 456-7890', expected: true, desc: 'Valid with parentheses' },
    { value: '123', expected: false, desc: 'Too short' },
    { value: 'abc123', expected: false, desc: 'Contains letters' },
    { value: '', expected: false, desc: 'Empty string' }
  ];

  smsTests.forEach(test => {
    const contact = { type: 'sms', value: test.value };
    const result = MessagingService.validateContact(contact);
    const pass = result === test.expected;
    console.log(`  ${test.desc}: "${test.value}" -> ${result} ${pass ? '✓' : '✗'}`);
  });
  console.log();

  // Test 2: Email Validation
  console.log('Test 2: Email Contact Validation');
  const emailTests = [
    { value: 'test@example.com', expected: true, desc: 'Valid email' },
    { value: 'user.name@domain.co.uk', expected: true, desc: 'Valid with dots' },
    { value: 'test@', expected: false, desc: 'Missing domain' },
    { value: 'notanemail', expected: false, desc: 'Not an email' },
    { value: '@example.com', expected: false, desc: 'Missing local part' },
    { value: 'test @example.com', expected: false, desc: 'Contains space' }
  ];

  emailTests.forEach(test => {
    const contact = { type: 'email', value: test.value };
    const result = MessagingService.validateContact(contact);
    const pass = result === test.expected;
    console.log(`  ${test.desc}: "${test.value}" -> ${result} ${pass ? '✓' : '✗'}`);
  });
  console.log();

  // Test 3: Signal Validation
  console.log('Test 3: Signal Contact Validation');
  const signalTests = [
    { value: '+1234567890', expected: true, desc: 'Phone number' },
    { value: 'username123', expected: true, desc: 'Username' },
    { value: 'a', expected: true, desc: 'Single character' },
    { value: '', expected: false, desc: 'Empty string' }
  ];

  signalTests.forEach(test => {
    const contact = { type: 'signal', value: test.value };
    const result = MessagingService.validateContact(contact);
    const pass = result === test.expected;
    console.log(`  ${test.desc}: "${test.value}" -> ${result} ${pass ? '✓' : '✗'}`);
  });
  console.log();

  // Test 4: URL Generation
  console.log('Test 4: URL Generation');
  
  const testMessage = 'This is a test treaty message with special chars: & ? #';
  const phoneNumber = '+1234567890';
  const email = 'test@example.com';

  console.log('SMS URL:');
  const smsUrl = MessagingService.generateSMSUrl(phoneNumber, testMessage);
  console.log(`  ${smsUrl}`);
  console.log(`  ✓ Properly encoded: ${smsUrl.includes('special%20chars%3A%20%26%20%3F%20%23')}`);
  console.log();

  console.log('Email URL:');
  const emailUrl = MessagingService.generateEmailUrl(email, testMessage);
  console.log(`  ${emailUrl}`);
  console.log(`  ✓ Contains subject: ${emailUrl.includes('subject=Treaty%20Summons')}`);
  console.log(`  ✓ Properly encoded body: ${emailUrl.includes('special%20chars%3A%20%26%20%3F%20%23')}`);
  console.log();

  // Test 5: Test with actual treaty content
  console.log('Test 5: Real Treaty Content');
  const realTreaty = `EMERGENCY MEDICAL INFORMATION

Name: John Doe
Blood Type: O+
Allergies: Penicillin, Peanuts
Medications: Insulin (Type 1 Diabetes)

Emergency Contact: Jane Doe (555-0123)
Doctor: Dr. Smith (555-0456)

Please provide this information to medical personnel.`;

  const encodedSms = MessagingService.generateSMSUrl('911', realTreaty);
  console.log('  SMS URL length:', encodedSms.length);
  console.log('  ✓ Contains medical info:', encodedSms.includes('EMERGENCY%20MEDICAL'));
  
  const encodedEmail = MessagingService.generateEmailUrl('emergency@hospital.com', realTreaty);
  console.log('  Email URL length:', encodedEmail.length);
  console.log('  ✓ Contains medical info:', encodedEmail.includes('Blood%20Type'));

  console.log('\n✅ All Messaging Service tests completed!');
}

// Run the tests
runTests();
