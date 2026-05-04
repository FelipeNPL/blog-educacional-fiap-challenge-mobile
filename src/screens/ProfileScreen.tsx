import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";
import { COLORS, SPACING, SIZES } from "../styles/theme";
import { Ionicons } from "@expo/vector-icons";

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={60} color={COLORS.primary} />
        </View>
        <Text style={styles.userName}>{user?.name || "User Name"}</Text>
        <Text style={styles.userEmail}>
          {user?.email || "user@example.com"}
        </Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>
            {user?.role?.toUpperCase() || "STUDENT"}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.menuItem} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
          <Text style={[styles.menuText, { color: COLORS.error }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.m,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  userName: { fontSize: 22, fontWeight: "bold", color: COLORS.text },
  userEmail: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.m,
  },
  roleBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
  },
  roleText: { color: "#FFF", fontWeight: "bold", fontSize: 12 },
  content: { marginTop: SPACING.m, backgroundColor: COLORS.surface },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.l,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: SPACING.m,
    color: COLORS.text,
  },
});

export default ProfileScreen;
