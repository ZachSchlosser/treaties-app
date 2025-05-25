# Treaties.ai Mobile App

A React Native mobile application for creating, managing, and sending treaties via SMS, email, or Signal.

## Phase 1 Features

- **Treaty Screen**: Edit treaty text and contact information
- **Contact Management**: Support for SMS, email, and Signal contacts
- **Summon/Test Buttons**: Send treaties with confirmation dialog
- **Swarm Screen**: View and manage all treaties
- **LLM Integration**: OpenAI API integration for text processing
- **Data Persistence**: Local storage using AsyncStorage

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ZachSchlosser/treaties-app.git
cd treaties-app
```

2. Install dependencies:
```bash
npm install
```

3. Configure OpenAI API Key:
   - Open `src/config/index.ts`
   - Add your OpenAI API key (temporarily for development)
   - Or set the `OPENAI_API_KEY` environment variable

## Running the App

### Using Expo Go (Recommended for Development)

1. Install Expo Go on your mobile device from the App Store or Google Play

2. Start the development server:
```bash
npm start
```

3. Scan the QR code with:
   - iOS: Camera app
   - Android: Expo Go app

### Android Emulator

```bash
npm run android
```

### iOS Simulator (macOS only)

```bash
npm run ios
```

## Building for Production

### Android APK

1. Install Expo CLI globally:
```bash
npm install -g expo-cli
```

2. Build the APK:
```bash
expo build:android -t apk
```

3. Follow the prompts to create or use existing credentials

### iOS Build

```bash
expo build:ios
```

Note: iOS builds require an Apple Developer account.

## Project Structure

```
treaties-app/
├── src/
│   ├── screens/          # Main app screens
│   ├── components/       # Reusable UI components
│   ├── services/         # Business logic services
│   ├── context/          # React Context for state
│   ├── types/            # TypeScript definitions
│   └── config/           # Configuration files
├── App.tsx               # Main app entry point
└── package.json
```

## Key Components

- **SwarmScreen**: Main screen showing all treaties
- **TreatyScreen**: Individual treaty editing screen
- **TreatyEditor**: Text input for treaty content
- **ContactInput**: Contact information input with validation
- **ActionButtons**: Summon and Test action buttons

## Services

- **StorageService**: Handles AsyncStorage operations
- **MessagingService**: Manages SMS, email, and Signal integration
- **OpenAIService**: Handles LLM API calls

## Testing

To test the app:

1. Create a new treaty from the Swarm screen
2. Enter treaty text
3. Add contact information (phone, email, or Signal)
4. Use Test button to send a test message
5. Use Summon button to send the actual treaty

## Known Limitations

- Signal integration uses clipboard fallback (no direct message API)
- LLM integration triggers on double newline (can be customized)
- Minimal UI styling (designs pending)

## Phase 2 Considerations

The app is structured to easily accommodate:
- Multiple contacts per treaty
- Voice-to-text functionality
- Svalbard Treaty Vault
- Enhanced UI with designer assets
- Additional LLM providers

## Troubleshooting

### Build Issues
- Clear cache: `expo start -c`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

### Android Specific
- Ensure Android SDK is properly installed
- Check emulator is running: `adb devices`

### iOS Specific
- Run `cd ios && pod install` if using React Native CLI
- Check Xcode is up to date

## Support

For issues or questions, please create an issue in the GitHub repository.
