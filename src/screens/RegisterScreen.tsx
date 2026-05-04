import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { COLORS, SPACING, SIZES } from "../styles/theme";
import api from "../services/api";
import { AuthStackParamList } from "../navigation/AppNavigator";
import { getErrorMessage } from "../utils/errors";

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Register"
>;

const RegisterScreen: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });
      // After registration, go to login
      navigation.navigate("Login");
    } catch (err: any) {
      console.error("Registration error", err);
      setError(getErrorMessage(err, "Registration failed. Try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join our educational community</Text>
          </View>

          <View style={styles.form}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Your Name"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="******"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleRegister}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Register</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLinkText}>
                Already have an account? Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { flexGrow: 1 },
  content: { flex: 1, justifyContent: "center", padding: SPACING.l },
  header: { alignItems: "center", marginBottom: SPACING.xl },
  title: { fontSize: 32, fontWeight: "bold", color: COLORS.primary },
  subtitle: { fontSize: 18, color: COLORS.textSecondary, marginTop: SPACING.s },
  form: {
    backgroundColor: COLORS.surface,
    padding: SPACING.l,
    borderRadius: SIZES.radius,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: SPACING.s,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    fontSize: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SPACING.m,
    borderRadius: SIZES.radius,
    alignItems: "center",
    marginTop: SPACING.s,
  },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  errorText: {
    color: COLORS.error,
    marginBottom: SPACING.m,
    textAlign: "center",
  },
  loginLink: { marginTop: SPACING.l, alignItems: "center" },
  loginLinkText: { color: COLORS.secondary, fontWeight: "600" },
});

export default RegisterScreen;
