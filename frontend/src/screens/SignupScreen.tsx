// src/screens/SignupScreen.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/AuthStack";

type Props = NativeStackScreenProps<AuthStackParamList, "Signup"> & {
  setIsLoggedIn: (value: boolean) => void;
};

export default function SignupScreen({ navigation, setIsLoggedIn }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert("⚠️ Missing Info", "Email and password are required to create your account");
      return;
    }
    try {
      setLoading(true);
      // create user
      await api.post("/auth/signup", {
        email,
        full_name: fullName || null,
        password,
      });

      // auto-login after successful signup
      const res = await api.post("/auth/login", { email, password });
      const token = res.data.access_token;
      await AsyncStorage.setItem("token", token);
      setIsLoggedIn(true);
    } catch (err: any) {
      console.log(err.response?.data || err.message);
      Alert.alert(
        "😔 Signup Failed",
        "Unable to create your account. Please try again or check if the email is already registered."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#ffecd2', '#fcb69f', '#ffeaa7', '#fff5f5']}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.View 
          style={[
            styles.inner,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
            }
          ]}
        >
          <Animated.View 
            style={[
              styles.headerContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.title}>🎉 Join Us!</Text>
            <Text style={styles.subtitle}>Create your account and start organizing your life</Text>
          </Animated.View>

          <Animated.View 
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              style={styles.inputContainer}
            >
              <Text style={styles.inputLabel}> Full Name (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="rgba(30, 28, 28, 0.7)"
                value={fullName}
                onChangeText={setFullName}
              />
            </LinearGradient>

            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              style={styles.inputContainer}
            >
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="rgba(30, 28, 28, 0.7)"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </LinearGradient>

            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
              style={styles.inputContainer}
            >
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Create a secure password"
                placeholderTextColor="rgba(30, 28, 28, 0.7)"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </LinearGradient>

            <TouchableOpacity 
              style={styles.button} 
              onPress={handleSignup} 
              disabled={loading}
            >
              <LinearGradient
                colors={loading 
                  ? ['#cccccc', '#999999'] 
                  : ['#a29bfe', '#6c5ce7']
                }
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>
                  {loading ? "⏳ Creating Account..." : "🚀 Create Account"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.linkButton}
              onPress={() => navigation.navigate("Login")}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                style={styles.linkGradient}
              >
                <Text style={styles.linkText}>
                  Already have an account? <Text style={styles.linkTextBold}>🔐 Login</Text>
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    borderRadius: 20,
    padding: 4,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  inputLabel: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 8,
    marginLeft: 16,
    fontWeight: '600',
  },
  input: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  button: {
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonGradient: {
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  linkButton: {
    borderRadius: 15,
    marginTop: 10,
  },
  linkGradient: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  linkText: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: 16,
  },
  linkTextBold: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
});
