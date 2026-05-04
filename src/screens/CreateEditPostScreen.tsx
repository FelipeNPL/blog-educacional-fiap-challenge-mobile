import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { createPost, updatePost } from "../services/postService";
import { COLORS, SPACING, SIZES } from "../styles/theme";
import { useAuth } from "../context/AuthContext";
import { AdminStackParamList } from "../navigation/AppNavigator";
import { getErrorMessage } from "../utils/errors";

type CreateEditRouteProp = RouteProp<AdminStackParamList, "CreateEditPost">;

const CreateEditPostScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<CreateEditRouteProp>();
  const { user } = useAuth();
  const postToEdit = route.params?.post;
  const isEditing = !!postToEdit;

  const [title, setTitle] = useState(postToEdit?.title || "");
  const [content, setContent] = useState(postToEdit?.content || "");
  const [author, setAuthor] = useState(postToEdit?.author || user?.name || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title || !content) {
      Alert.alert("Validation Error", "Title and content are required.");
      return;
    }

    setLoading(true);
    try {
      const postData = { title, content, author };
      if (isEditing && !!postToEdit) {
        await updatePost(postToEdit._id || postToEdit.id!, postData);
        Alert.alert("Success", "Post updated successfully!");
      } else {
        await createPost(postData);
        Alert.alert("Success", "Post created successfully!");
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", getErrorMessage(error, "Failed to save post."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <Text style={styles.label}>Post Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter post title"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Author Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter author name"
            value={author}
            onChangeText={setAuthor}
          />

          <Text style={styles.label}>Content</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Write your content here..."
            value={content}
            onChangeText={setContent}
            multiline={true}
            numberOfLines={10}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.button, loading ? styles.buttonDisabled : null]}
            onPress={handleSave}
            disabled={!!loading}>
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>
                {isEditing ? "Update Post" : "Publish Post"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={!!loading}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: SPACING.m },
  form: {
    backgroundColor: COLORS.surface,
    padding: SPACING.l,
    borderRadius: SIZES.radius,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: SPACING.m,
    marginBottom: SPACING.l,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
  },
  textArea: { height: 200 },
  button: {
    backgroundColor: COLORS.primary,
    padding: SPACING.m,
    borderRadius: SIZES.radius,
    alignItems: "center",
    marginTop: SPACING.m,
  },
  buttonDisabled: { backgroundColor: COLORS.textSecondary },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  cancelButton: {
    backgroundColor: "transparent",
    padding: SPACING.m,
    borderRadius: SIZES.radius,
    alignItems: "center",
    marginTop: SPACING.s,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelButtonText: { color: COLORS.textSecondary, fontSize: 16, fontWeight: "600" },
});

export default CreateEditPostScreen;
