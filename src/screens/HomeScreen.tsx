import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getPosts, Post } from "../services/postService";
import { COLORS, SPACING, SIZES } from "../styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/AppNavigator";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

const HomeScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const fetchPosts = useCallback(async (keyword = "") => {
    try {
      setLoading(true);
      const data = await getPosts(keyword);
      setPosts(data);
      setError(null);
    } catch (err) {
      setError("Failed to load posts. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts(search);
  };

  const handleSearch = () => {
    fetchPosts(search);
  };

  const renderPostItem = ({ item, index }: { item: Post; index: number }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => navigation.navigate("PostDetails", { id: item._id || item.id || index })}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <View style={styles.postMeta}>
        <Text style={styles.postAuthor}>By {item.author || "Anonymous"}</Text>
        {item.createdAt ? (
          <Text style={styles.postDate}>
             • {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        ) : null}
      </View>
      <Text style={styles.postDescription} numberOfLines={3}>
        {item.content}
      </Text>
      <View style={styles.cardFooter}>
        <Text style={styles.readMore}>Read More</Text>
        <Ionicons name="arrow-forward" size={16} color={COLORS.secondary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={COLORS.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search posts..."
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
        />
        {search !== "" ? (
          <TouchableOpacity
            onPress={() => {
              setSearch("");
              fetchPosts("");
            }}>
            <Ionicons
              name="close-circle"
              size={20}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {error !== null ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchPosts(search)}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (loading === true && refreshing === false) ? (
        <View style={styles.center}>
          <ActivityIndicator color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item, index) => (item._id || item.id || index).toString()}
          renderItem={renderPostItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No posts found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    margin: SPACING.m,
    paddingHorizontal: SPACING.m,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: { marginRight: SPACING.s },
  searchInput: { flex: 1, height: 50, fontSize: 16 },
  listContent: { padding: SPACING.m },
  postCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
    borderRadius: SIZES.radius,
    marginBottom: SPACING.m,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  postMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.s,
  },
  postAuthor: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: "italic",
  },
  postDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  postDescription: { fontSize: 15, color: COLORS.text, lineHeight: 22 },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: SPACING.m,
  },
  readMore: {
    color: COLORS.secondary,
    fontWeight: "600",
    marginRight: SPACING.xs,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  errorText: {
    color: COLORS.error,
    textAlign: "center",
    marginBottom: SPACING.m,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.s,
    borderRadius: SIZES.radius,
  },
  retryText: { color: "#FFF", fontWeight: "bold" },
  emptyText: { color: COLORS.textSecondary, fontSize: 16 },
});

export default HomeScreen;
