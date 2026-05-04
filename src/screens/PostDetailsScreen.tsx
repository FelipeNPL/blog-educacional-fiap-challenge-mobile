import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { getPostById, Post } from "../services/postService";
import { COLORS, SPACING, SIZES } from "../styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/AppNavigator";

type PostDetailsRouteProp = RouteProp<RootStackParamList, "PostDetails">;

const PostDetailsScreen: React.FC = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const route = useRoute<PostDetailsRouteProp>();
  const navigation = useNavigation();
  const { id } = route.params;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id);
        setPost(data);
      } catch (err) {
        setError("Failed to load post details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (!!loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={COLORS.primary} />
      </View>
    );
  }

  if (error || !post) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || "Post not found"}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{post.title}</Text>
        <View style={styles.meta}>
          <Ionicons
            name="person-circle-outline"
            size={20}
            color={COLORS.textSecondary}
          />
          <Text style={styles.author}>By {post.author || "Anonymous"}</Text>
          {post.createdAt ? (
            <Text style={styles.date}>
              • {new Date(post.createdAt).toLocaleDateString()}
            </Text>
          ) : null}
        </View>
        <View style={styles.divider} />
        <Text style={styles.postContent}>{post.content}</Text>

        <View style={styles.commentSection}>
          <Text style={styles.commentTitle}>Comments</Text>
          <View style={styles.commentPlaceholder}>
            <Ionicons name="chatbubbles-outline" size={40} color={COLORS.border} />
            <Text style={styles.commentText}>Comments coming soon!</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.bottomBackButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#FFF" />
          <Text style={styles.bottomBackButtonText}>Back to List</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.l,
  },
  content: { padding: SPACING.l },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: SPACING.s,
  },
  meta: { flexDirection: "row", alignItems: "center", marginBottom: SPACING.m },
  author: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
    fontStyle: "italic",
  },
  date: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.l,
    marginTop: SPACING.s,
  },
  postContent: { fontSize: 18, lineHeight: 28, color: COLORS.text },
  commentSection: { marginTop: SPACING.xl, paddingTop: SPACING.l, borderTopWidth: 1, borderTopColor: COLORS.border },
  commentTitle: { fontSize: 20, fontWeight: "bold", color: COLORS.text, marginBottom: SPACING.m },
  commentPlaceholder: { alignItems: "center", padding: SPACING.xl, backgroundColor: COLORS.background, borderRadius: SIZES.radius },
  commentText: { marginTop: SPACING.s, color: COLORS.textSecondary, fontSize: 16 },
  bottomBackButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    padding: SPACING.m,
    borderRadius: SIZES.radius,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.xl,
    marginBottom: SPACING.l,
  },
  bottomBackButtonText: { color: "#FFF", fontWeight: "bold", marginLeft: SPACING.s, fontSize: 16 },
  errorText: { color: COLORS.error, fontSize: 16, marginBottom: SPACING.m },
  backButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.s,
    borderRadius: SIZES.radius,
  },
  backButtonText: { color: "#FFF", fontWeight: "bold" },
});

export default PostDetailsScreen;
