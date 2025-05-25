# Treaties.ai Android Device Testing Guide - Phase 3

## Prerequisites
- Android phone with Expo Go app installed
- Phone and computer on same WiFi network
- Expo server running (`npm start`)

## Testing Checklist

### 1. Initial Setup
- [ ] Open Expo Go app on Android phone
- [ ] Scan QR code from terminal
- [ ] Wait for app to load (may take 30-60 seconds first time)
- [ ] Verify app opens without crashes

### 2. Core Functionality Tests

#### A. Treaty Creation on Device
- [ ] Tap "Create First Treaty" or "New" button
- [ ] Test keyboard appears when tapping text field
- [ ] Type: "Emergency: Call 911 immediately"
- [ ] Verify keyboard can be dismissed
- [ ] Verify text appears correctly

#### B. Contact Input Testing
- [ ] **SMS Test**:
  - Tap SMS tab
  - Enter YOUR phone number
  - Verify number pad keyboard appears
  - Enter: (555) 123-4567
  - Verify formatting is accepted

- [ ] **Email Test**:
  - Tap Email tab
  - Enter: your.email@gmail.com
  - Verify email keyboard (with @ symbol)

- [ ] **Signal Test**:
  - Tap Signal tab
  - Enter any username
  - Verify standard keyboard

#### C. Action Button Testing - CRITICAL
- [ ] **Test Button - SMS**:
  1. With SMS contact selected, tap "Test"
  2. Confirm dialog appears
  3. Tap "Confirm"
  4. **Verify**: Phone's SMS app opens
  5. **Verify**: Recipient field has your number
  6. **Verify**: Message starts with "This is a test of the treaty..."
  7. **Verify**: Full treaty text is included
  8. Go back to app WITHOUT sending

- [ ] **Summon Button - SMS**:
  1. Tap "Summon"
  2. Confirm in dialog
  3. **Verify**: SMS app opens
  4. **Verify**: Message does NOT have test prefix
  5. **Verify**: Message is just the treaty text

- [ ] **Test Button - Email**:
  1. Change to email contact
  2. Tap "Test"
  3. Confirm in dialog
  4. **Verify**: Email app opens
  5. **Verify**: To field has email address
  6. **Verify**: Subject is "Treaty Summons"
  7. **Verify**: Body has test prefix + treaty

- [ ] **Signal Test**:
  1. Change to Signal contact
  2. Tap "Test"
  3. **Verify**: Alert about clipboard appears
  4. If Signal installed: Verify it opens
  5. If not: Verify appropriate message

### 3. Multiple Treaties Test
- [ ] Navigate back to main screen
- [ ] Create 3 different treaties:
  1. "Fire Emergency - Exit via stairs"
  2. "Medical Alert - Diabetic, needs insulin"
  3. "Contact spouse at 555-0123"
- [ ] Verify all appear in list
- [ ] Verify previews are correct
- [ ] Test scrolling if needed

### 4. Real-World Scenarios

#### Scenario 1: Medical Emergency
- [ ] Create treaty: 
  ```
  MEDICAL EMERGENCY
  Name: [Your Name]
  Conditions: Diabetes Type 1
  Medications: Insulin
  Allergies: Penicillin
  Emergency Contact: [Real contact]
  ```
- [ ] Add real emergency contact SMS
- [ ] Test "Summon" button
- [ ] Verify all info appears in SMS

#### Scenario 2: Quick Alert
- [ ] Create treaty: "Help needed at [your address]"
- [ ] Add email to friend/family
- [ ] Test sending
- [ ] Verify speed of access

### 5. Edge Cases & Stress Tests

- [ ] **Long Treaty Text**:
  - Create 500+ character treaty
  - Verify scrolling works
  - Test sending via SMS
  - Check if truncated

- [ ] **Special Characters**:
  - Use emojis: 🚨 ⚠️ 📞
  - Use symbols: & < > " '
  - Verify display and sending

- [ ] **Rapid Actions**:
  - Quickly create/delete treaties
  - Switch between screens rapidly
  - No crashes or data loss

### 6. Android-Specific Tests

- [ ] **Back Button**:
  - Use Android back button
  - Verify proper navigation
  - No app exit on first press

- [ ] **App Switching**:
  - Switch to another app
  - Come back to Treaties
  - Verify state preserved

- [ ] **Rotation** (if not locked):
  - Rotate device
  - Verify layout adjusts
  - No data loss

### 7. Performance Checks
- [ ] App loads in < 5 seconds
- [ ] Smooth scrolling
- [ ] No lag when typing
- [ ] Buttons respond immediately

### 8. Final Integration Test
1. [ ] Fresh start: Clear app data
2. [ ] Create real emergency treaty
3. [ ] Add your actual emergency contact
4. [ ] Test the full flow
5. [ ] Close app completely
6. [ ] Reopen and verify treaty exists
7. [ ] Make a real test call/SMS

## Results Documentation

### Working Features:
- [ ] Treaty creation
- [ ] Contact validation  
- [ ] SMS integration
- [ ] Email integration
- [ ] Signal fallback
- [ ] Data persistence
- [ ] Navigation

### Issues Found:
(List any problems here)

### Device Info:
- Android Version: ___________
- Phone Model: _____________
- Expo Go Version: _________

## Success Criteria
✅ All core features work
✅ No crashes during testing
✅ SMS/Email apps open correctly
✅ Messages are properly formatted
✅ Data persists between sessions
✅ Performance is acceptable

## Next Steps
If all tests pass:
1. Document any UI improvements needed
2. Prepare for production build
3. Plan beta testing with real users
