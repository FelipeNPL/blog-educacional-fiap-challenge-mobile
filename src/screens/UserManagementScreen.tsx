import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  User,
} from "../services/userService";
import { COLORS, SPACING, SIZES } from "../styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { AdminStackParamList } from "../navigation/AppNavigator";
import { getErrorMessage } from "../utils/errors";

type UserManagementRouteProp = RouteProp<AdminStackParamList, "UserManagement">;

const UserManagementScreen: React.FC = () => {
  const route = useRoute<UserManagementRouteProp>();
  const { role } = route.params;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getUsers(role);
      setUsers(response.data);
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenModal = (user: User | null = null) => {
    if (user !== null) {
      setEditingUser(user);
      setName(user.name);
      setEmail(user.email);
      setPassword("");
    } else {
      setEditingUser(null);
      setName("");
      setEmail("");
      setPassword("");
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (
      name === "" ||
      email === "" ||
      (editingUser === null && password === "")
    ) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      if (editingUser !== null) {
        await updateUser(editingUser._id || editingUser.id, { name, email });
        Alert.alert("Success", "User updated successfully");
      } else {
        await createUser({ name, email, password, role });
        Alert.alert("Success", "User created successfully");
      }
      setModalVisible(false);
      fetchUsers();
    } catch (err) {
      Alert.alert("Error", getErrorMessage(err, "Operation failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string | number) => {
    Alert.alert("Delete", `Are you sure you want to delete this ${role}?`, [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteUser(id);
            fetchUsers();
          } catch (err) {
            Alert.alert("Error", getErrorMessage(err, "Failed to delete user"));
          }
        },
      },
    ]);
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <View style={styles.userActions}>
        <TouchableOpacity
          onPress={() => handleOpenModal(item)}
          style={styles.iconButton}>
          <Ionicons name="pencil" size={20} color={COLORS.secondary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item._id || item.id)}
          style={styles.iconButton}>
          <Ionicons name="trash" size={20} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {role.charAt(0).toUpperCase() + role.slice(1)}s
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleOpenModal()}>
          <Ionicons name="person-add" size={20} color="#FFF" />
          <Text style={styles.addButtonText}>Add {role}</Text>
        </TouchableOpacity>
      </View>

      {loading === true ? (
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => (item._id || item.id).toString()}
          renderItem={renderUserItem}
          contentContainerStyle={styles.list}
        />
      )}

      <Modal
        visible={modalVisible === true}
        animationType="slide"
        transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingUser !== null ? "Edit" : "Create"} {role}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {editingUser === null ? (
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
              />
            ) : null}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.m,
    backgroundColor: COLORS.surface,
  },
  title: { fontSize: 20, fontWeight: "bold", color: COLORS.primary },
  addButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    padding: SPACING.s,
    borderRadius: SIZES.radius,
    alignItems: "center",
  },
  addButtonText: { color: "#FFF", marginLeft: SPACING.xs, fontWeight: "bold" },
  list: { padding: SPACING.m },
  userCard: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
    borderRadius: SIZES.radius,
    marginBottom: SPACING.s,
    alignItems: "center",
    elevation: 2,
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 16, fontWeight: "bold", color: COLORS.text },
  userEmail: { fontSize: 14, color: COLORS.textSecondary },
  userActions: { flexDirection: "row" },
  iconButton: { padding: SPACING.s },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: SPACING.l,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SPACING.l,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: SPACING.m,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  modalButton: {
    flex: 0.48,
    padding: SPACING.m,
    borderRadius: SIZES.radius,
    alignItems: "center",
  },
  cancelButton: { backgroundColor: COLORS.border },
  saveButton: { backgroundColor: COLORS.primary },
  cancelButtonText: { color: COLORS.text },
  saveButtonText: { color: "#FFF", fontWeight: "bold" },
});

export default UserManagementScreen;
