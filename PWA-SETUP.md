# UMI Student Portal - PWA Installation Guide

Your UMI Student Portal has been successfully converted into a Progressive Web App (PWA)! This means you can now install it on your desktop, mobile device, or tablet for quick access and offline functionality.

## 🚀 What's New - PWA Features

- **Desktop Installation**: Install the app on Windows, macOS, or Linux
- **Mobile Installation**: Add to home screen on iOS and Android devices
- **Offline Functionality**: Core features work even without internet connection
- **Push Notifications**: Receive important updates (when implemented)
- **Native-like Experience**: Runs like a native application
- **Automatic Updates**: Always stays up-to-date in the background

## 📱 How to Install

### Desktop Installation (Chrome, Edge, Firefox)

1. **Open the app** in your browser: `http://localhost:4173/` (or your production URL)
2. **Look for the install prompt** - You'll see a small notification in the bottom-right corner
3. **Click "Install"** or look for the install icon (⬇️) in your browser's address bar
4. **Follow the prompts** to install the app to your desktop
5. **Launch from desktop** - Find the "UMI Student Portal" icon on your desktop or in your applications

### Mobile Installation

#### Android (Chrome, Samsung Internet, Firefox)
1. Open the app in your mobile browser
2. Tap the **menu button** (three dots) in the browser
3. Select **"Add to Home Screen"** or **"Install App"**
4. Confirm the installation
5. Find the app icon on your home screen

#### iOS (Safari)
1. Open the app in Safari
2. Tap the **Share button** (square with arrow pointing up)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"** to confirm
5. Find the app icon on your home screen

## ✨ Features When Installed

### Standalone Experience
- Runs in its own window (no browser UI)
- Custom app icon and splash screen
- Integrated with your operating system

### Offline Capabilities
- **Cached Resources**: App shell loads instantly even offline
- **Data Persistence**: Your login state and recent data remain available
- **Graceful Degradation**: Features that require internet show appropriate messages

### Performance Benefits
- **Faster Loading**: Resources are cached locally
- **Reduced Data Usage**: Only new content is downloaded
- **Background Sync**: Updates happen automatically when online

## 🛠️ Technical Details

### Generated PWA Files
- `sw.js` - Service worker for caching and offline functionality
- `manifest.webmanifest` - App configuration and metadata
- `registerSW.js` - Automatic service worker registration script
- Various icon sizes (16x16 to 512x512) for different devices
- `favicon.ico` - Traditional browser favicon

### PWA Features Implemented
- **Web App Manifest**: Defines app metadata and behavior
- **Service Worker**: Handles caching and offline functionality  
- **Responsive Icons**: Optimized for all device types
- **Install Prompts**: Smart install notifications
- **Offline Fallbacks**: Graceful handling of network issues
- **Automatic Registration**: Service worker registers only in production builds

## 🎯 Installation Verification

After installation, verify everything works:

1. **Desktop**: Look for the app in your applications/programs list
2. **Mobile**: Check your home screen for the app icon
3. **Standalone Mode**: The app should open in its own window without browser UI
4. **Offline Test**: Disconnect from internet and verify core features still work

## 🔧 Development Commands

```bash
# Build the PWA
yarn build

# Preview the built PWA (required for testing PWA features)
yarn preview

# Development mode (PWA features are disabled in dev mode)
yarn dev
```

**Important**: PWA features (service worker, offline functionality, install prompts) only work in the built version. Always use `yarn build` followed by `yarn preview` to test PWA functionality.

## 📋 Browser Support

| Browser | Desktop Install | Mobile Install | Offline Support |
|---------|----------------|----------------|-----------------|
| Chrome  | ✅             | ✅             | ✅              |
| Edge    | ✅             | ✅             | ✅              |
| Firefox | ✅             | ✅             | ✅              |
| Safari  | ❌             | ✅             | ✅              |

## 🎨 Customization

The PWA appearance can be customized by modifying:

- **Theme Color**: Update `theme_color` in `vite.config.js` (currently blue: `#2563eb`)
- **Icons**: Replace icon files in the `public/` directory
- **App Name**: Update `name` and `short_name` in the manifest configuration
- **Background Color**: Modify `background_color` for the splash screen

## 🔍 Troubleshooting

### Service Worker Registration
✅ **Automatic Registration**: The app uses automatic service worker registration that only activates in production builds. No manual registration needed!

### Installation Prompt Not Showing
- Ensure you're using the **built version** (`yarn build` then `yarn preview`)
- Use HTTPS (or localhost for development)
- Check that all required PWA criteria are met
- Clear browser cache and try again

### App Not Working Offline
- Verify you're testing the **built version** (not dev mode)
- Check browser dev tools → Application → Service Workers
- Ensure the service worker is active and running
- Check the Network tab for cached resources

### Icons Not Displaying
- Verify icon files exist in the `public/` directory
- Check icon sizes match the manifest configuration
- Clear app cache and reinstall

### Development vs Production
- **Development mode** (`yarn dev`): PWA features are disabled, debug panel shows in bottom-left
- **Production mode** (`yarn build` + `yarn preview`): Full PWA functionality

## 🎓 Student-Specific Features

When installed, the UMI Student Portal provides quick access to:
- **Dashboard**: View grades, assignments, and announcements
- **Profile**: Manage personal information and academic records
- **Research Requests**: Submit and track research applications
- **Evaluations**: Complete course and instructor evaluations
- **Direct Messages**: Communicate with faculty and peers
- **Notifications**: Stay updated with important alerts

## 🌟 Next Steps

Consider implementing additional PWA features:
- Push notifications for grade updates and announcements
- Background sync for offline form submissions
- Periodic background sync for academic calendar updates
- App shortcuts for quick actions (submit assignment, check grades)
- Share target capability for academic documents

---

**Congratulations!** Your UMI Student Portal is now a fully functional Progressive Web App. Students can install it like any native application while enjoying all the benefits of web technology and staying connected to their academic journey! 📚 