/**
 * Happy Paisa Mobile App
 * React Native WebView Wrapper
 * Supports both Android and iOS
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Alert,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { WebView } from 'react-native-webview';

// Your deployed web app URL - update this after deployment
const WEB_APP_URL = 'https://happy-paisa-app.web.app'; // Will be updated after Firebase deployment

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  let webViewRef = null;

  const handleBackPress = () => {
    if (canGoBack && webViewRef) {
      webViewRef.goBack();
      return true; // Prevent default behavior
    }
    return false; // Let default behavior happen (exit app)
  };

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [canGoBack]);

  const onLoadStart = () => setIsLoading(true);
  const onLoadEnd = () => setIsLoading(false);
  
  const onError = (error) => {
    console.error('WebView Error:', error);
    Alert.alert(
      'Connection Error',
      'Unable to load Happy Paisa. Please check your internet connection and try again.',
      [{ text: 'OK' }]
    );
  };

  const onNavigationStateChange = (navState) => {
    setCanGoBack(navState.canGoBack);
  };

  const injectedJavaScript = `
    // Mobile-specific JavaScript
    window.isMobileApp = true;
    window.platform = '${Platform.OS}';
    
    // Hide address bar and make fullscreen
    document.addEventListener('DOMContentLoaded', function() {
      // Add mobile app class for specific styling
      document.body.classList.add('mobile-app');
      
      // Disable zoom
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
      
      // Prevent context menu on long press
      document.addEventListener('contextmenu', e => e.preventDefault());
    });
    
    true; // Required for injected JavaScript
  `;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#1a1a2e"
        hidden={false}
      />
      
      <View style={styles.webviewContainer}>
        <WebView
          ref={ref => (webViewRef = ref)}
          source={{ uri: WEB_APP_URL }}
          style={styles.webview}
          onLoadStart={onLoadStart}
          onLoadEnd={onLoadEnd}
          onError={onError}
          onNavigationStateChange={onNavigationStateChange}
          injectedJavaScript={injectedJavaScript}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          allowsFullscreenVideo={true}
          allowsBackForwardNavigationGestures={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
          androidHardwareAccelerationDisabled={false}
          androidLayerType="hardware"
          mixedContentMode="always"
          thirdPartyCookiesEnabled={true}
          userAgent="HappyPaisaApp/1.0 (Mobile)"
        />
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator 
              size="large" 
              color="#8B5CF6" 
              style={styles.loadingIndicator}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  webviewContainer: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default App;