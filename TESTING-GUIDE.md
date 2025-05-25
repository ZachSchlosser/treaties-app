# Treaties.ai Testing Guide - Phase 2 (UI Testing)

## Current Status
✅ Phase 1 Complete - All services tested and working:
- Storage Service: Save/retrieve/update/delete treaties
- Messaging Service: Contact validation and URL generation
- OpenAI Service: API integration with error handling

## Phase 2: Local UI Testing

The Expo server should now be running. You should see:
- A QR code in your terminal
- Expo DevTools opened in your browser
- Options to run on iOS Simulator, Android Emulator, or Web

### Testing Steps:

#### 1. Open the App
- Press `w` in the terminal to open in web browser
- Or scan the QR code with Expo Go app on your phone

#### 2. Test Empty State (Swarm Screen)
- [ ] Verify "No treaties yet" message appears
- [ ] Verify "Create First Treaty" button is visible
- [ ] Click the button and verify navigation to Treaty screen

#### 3. Test Treaty Creation
On the Treaty Screen:
- [ ] Type in the text field: "This is my first test treaty"
- [ ] Wait 1 second - the treaty should auto-save
- [ ] Select SMS tab and enter: 1234567890
- [ ] Select Email tab and enter: test@example.com
- [ ] Select Signal tab and enter: testuser

#### 4. Test Validation
- [ ] Clear contact and try clicking "Test" - should show "Missing Contact" alert
- [ ] Add contact back, clear treaty text, click "Test" - should show "Empty Message" alert
- [ ] Enter invalid phone (123) - should show validation error
- [ ] Enter invalid email (test@) - should show validation error

#### 5. Test Action Buttons
With valid treaty text and contact:
- [ ] Click "Test" button
- [ ] Verify confirmation dialog appears with correct contact info
- [ ] Click Cancel - verify nothing happens
- [ ] Click "Test" again, then Confirm
- [ ] In web: verify console shows the action
- [ ] Click "Summon" button and test the same flow

#### 6. Test Navigation
- [ ] Use back button to return to Swarm screen
- [ ] Verify your treaty appears in the list
- [ ] Verify preview text shows correctly
- [ ] Verify contact info displays
- [ ] Click on the treaty to open it again
- [ ] Verify all data was preserved

#### 7. Test Multiple Treaties
- [ ] Go back to Swarm screen
- [ ] Click "New" button in header
- [ ] Create a second treaty: "Medical emergency information"
- [ ] Add email contact: doctor@hospital.com
- [ ] Go back and verify 2 treaties in list

#### 8. Test Data Persistence
- [ ] Stop the server (Ctrl+C in terminal)
- [ ] Restart with `npm start`
- [ ] Open the app again
- [ ] Verify both treaties still exist
- [ ] Open each and verify content/contacts preserved

#### 9. Test LLM Integration (if API key added)
- [ ] Open a treaty
- [ ] Type: "Help me write an emergency contact protocol"
- [ ] Press Enter twice (double newline)
- [ ] If API key is configured, should see AI response appended
- [ ] If no API key, nothing should happen (no errors)

### Expected Results:
- ✅ All navigation works smoothly
- ✅ Data saves automatically
- ✅ Validation prevents invalid inputs
- ✅ Confirmation dialogs work properly
- ✅ Treaties persist between sessions

### Common Issues:
1. **Can't see treaties after restart**: Check browser localStorage/cookies
2. **Validation not working**: Ensure you're testing the exact formats listed
3. **Auto-save not working**: Wait at least 1 second after typing

## Next: Phase 3 (Android Testing)
Once all Phase 2 tests pass, we'll test on a real Android device using Expo Go.
