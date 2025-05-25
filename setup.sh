#!/bin/bash

echo "Treaties.ai Setup Script"
echo "======================="
echo ""

# Check if config file exists
if [ ! -f "src/config/index.ts" ]; then
    echo "Creating config file from template..."
    cp src/config/index.ts.example src/config/index.ts
    echo "✓ Config file created"
    echo ""
    echo "⚠️  Please edit src/config/index.ts and add your OpenAI API key"
else
    echo "✓ Config file already exists"
fi

echo ""
echo "Installing dependencies..."
npm install

echo ""
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Add your OpenAI API key to src/config/index.ts"
echo "2. Run 'npm start' to launch the development server"
echo "3. Scan the QR code with Expo Go app on your phone"
echo ""
echo "For more information, see README.md"
