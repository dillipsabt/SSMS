#!/bin/bash

echo "🚀 Multi-Tenancy Setup Script"
echo "================================"
echo ""

# Check if on Windows (Git Bash) or Unix
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    OS="Windows"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macOS"
elif [[ "$OSTYPE" == "linux"* ]]; then
    OS="Linux"
else
    OS="Unknown"
fi

echo "Detected OS: $OS"
echo ""

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Step 2: Create/Verify .env.local
echo "📝 Setting up .env.local..."
if [ ! -f .env.local ]; then
    cat > .env.local << EOF
VITE_ENV=development
VITE_WALKOUT_HR_TESTING_URL=http://api.apollo.walkouthr.in:9999
EOF
    echo "✅ .env.local created"
else
    echo "✅ .env.local already exists"
fi
echo ""

# Step 3: Create/Verify .env.production
echo "📝 Setting up .env.production..."
if [ ! -f .env.production ]; then
    cat > .env.production << EOF
VITE_ENV=production
EOF
    echo "✅ .env.production created"
else
    echo "✅ .env.production already exists"
fi
echo ""

# Step 4: Display hosts file instructions
echo "⚠️  IMPORTANT: Update your hosts file!"
echo ""
if [ "$OS" = "Windows" ]; then
    echo "📁 File: C:\\Windows\\System32\\drivers\\etc\\hosts"
    echo "👤 Run Notepad as Administrator"
elif [ "$OS" = "macOS" ] || [ "$OS" = "Linux" ]; then
    echo "📁 Command: sudo nano /etc/hosts"
fi
echo ""
echo "Add these lines:"
echo "127.0.0.1 apollo.localhost"
echo "127.0.0.1 care.localhost"
echo ""

# Step 5: Ready to start
echo "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Update your hosts file (see instructions above)"
echo "2. Run: npm run dev"
echo "3. Visit: http://apollo.localhost:5173 or http://care.localhost:5173"
echo ""
echo "Happy coding! 🚀"
