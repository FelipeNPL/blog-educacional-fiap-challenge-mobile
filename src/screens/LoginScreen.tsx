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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { COLORS, SPACING, SIZES } from "../styles/theme";
import { AuthStackParamList } from "../navigation/AppNavigator";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Login"
>;

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    const result = await login(email, password);

    if (!result.success) {
      setError(result.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>FIAP Blog</Text>
          <Text style={styles.subtitle}>Welcome back!</Text>
        </View>

        <View style={styles.form}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
            onPress={handleLogin}
            disabled={!!loading}>
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerLinkText}>
              Don't have an account? Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
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
  registerLink: { marginTop: SPACING.l, alignItems: "center" },
  registerLinkText: { color: COLORS.secondary, fontWeight: "600" },
});

export default LoginScreen;
