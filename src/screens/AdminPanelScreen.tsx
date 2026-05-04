import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getPosts, deletePost, Post } from '../services/postService';
import { COLORS, SPACING, SIZES } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { AdminStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';

type AdminNavigationProp = NativeStackNavigationProp<AdminStackParamList, 'AdminPanel'>;

const AdminPanelScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<AdminNavigationProp>();
  const { logout } = useAuth();

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load posts for administration.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts])
  );

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to exit?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: logout },
    ]);
  };

  const handleDelete = (id: string | number) => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePost(id);
              fetchPosts();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete post.');
            }
          }
        },
      ]
    );
  };

  const renderAdminItem = ({ item, index }: { item: Post; index: number }) => (
    <View style={styles.adminCard}>
      <View style={styles.cardInfo}>
        <Text style={styles.postTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.cardMeta}>
          <Text style={styles.postAuthor}>By {item.author || 'Anonymous'}</Text>
          {item.createdAt ? (
            <Text style={styles.postDate}>
               • {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => navigation.navigate('CreateEditPost', { post: item })}
        >
          <Ionicons name="pencil" size={20} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item._id || item.id!)}
        >
          <Ionicons name="trash" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('CreateEditPost', {})}
          >
            <Ionicons name="add" size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.managementSection}>
        <TouchableOpacity 
          style={styles.manageUsersButton}
          onPress={() => navigation.navigate('UserManagement', { role: 'professor' })}
        >
          <Ionicons name="people" size={20} color={COLORS.primary} />
          <Text style={styles.manageUsersText}>Professors</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.manageUsersButton}
          onPress={() => navigation.navigate('UserManagement', { role: 'student' })}
        >
          <Ionicons name="school" size={20} color={COLORS.primary} />
          <Text style={styles.manageUsersText}>Students</Text>
        </TouchableOpacity>
      </View>

      {!!loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item, index) => String(item?._id || item?.id || index)}
          renderItem={renderAdminItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchPosts(); }} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No posts available to manage.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.m, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  addButton: { width: 40, height: 40, backgroundColor: COLORS.success, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.s },
  logoutButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  managementSection: { flexDirection: 'row', padding: SPACING.m, justifyContent: 'space-between' },
  manageUsersButton: { flex: 0.48, flexDirection: 'row', backgroundColor: COLORS.surface, padding: SPACING.m, borderRadius: SIZES.radius, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.primary },
  manageUsersText: { color: COLORS.primary, fontWeight: '600', marginLeft: SPACING.s, fontSize: 12 },
  listContent: { padding: SPACING.m },
  adminCard: { flexDirection: 'row', backgroundColor: COLORS.surface, padding: SPACING.m, borderRadius: SIZES.radius, marginBottom: SPACING.s, alignItems: 'center', justifyContent: 'space-between', elevation: 2 },
  cardInfo: { flex: 1, marginRight: SPACING.m },
  postTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  cardMeta: { flexDirection: 'row', alignItems: 'center' },
  postAuthor: { fontSize: 12, color: COLORS.textSecondary },
  postDate: { fontSize: 11, color: COLORS.textSecondary, marginLeft: SPACING.xs },
  actions: { flexDirection: 'row' },
  actionButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginLeft: SPACING.s },
  editButton: { backgroundColor: COLORS.secondary },
  deleteButton: { backgroundColor: COLORS.error },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center', marginTop: SPACING.xl, color: COLORS.textSecondary },
});

export default AdminPanelScreen;
