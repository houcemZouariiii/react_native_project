import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Import local images
const backgroundImage = require('../image/Google Pixel 2 XL - 6.png');
const coffeeImage = require('../image/Spalsh.png');

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.container}
      resizeMode="cover"
      imageStyle={{ opacity: 1 }}
    >
      <View style={styles.content}>
        {/* Bottom section with text and button */}
        <View style={styles.bottomSection}>
          {/* Coffee image overlapping the card */}
          <View style={styles.imageWrapper}>
            <Image
              source={coffeeImage}
              style={styles.coffeeImage}
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.title}>Coffee so good,{'\n'}your taste buds{'\n'}will love it</Text>
          <Text style={styles.subtitle}>
            The best grain, the finest roas, the{'\n'}most powerful flavor.
          </Text>
          
          <TouchableOpacity
            style={styles.button}
            onPress={onComplete}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Get started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C4A574',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSection: {
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 50,
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'absolute',
    top: -180,
    alignItems: 'center',
    width: '100%',
    zIndex: 10,
  },
  coffeeImage: {
    width: width * 0.5,
    height: height * 0.3,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#ffffffff',
    textAlign: 'center',
    marginBottom: 80,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 13,
    color: '#ffffffff',
    textAlign: 'center',
    marginBottom: 60,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#2D5A3D',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingScreen;
