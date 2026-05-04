import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../context/AuthContext";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import PostDetailsScreen from "../screens/PostDetailsScreen";
import AdminPanelScreen from "../screens/AdminPanelScreen";
import CreateEditPostScreen from "../screens/CreateEditPostScreen";
import UserManagementScreen from "../screens/UserManagementScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { Post } from "../services/postService";
import { COLORS } from "../styles/theme";

export type RootStackParamList = {
  Home: undefined;
  PostDetails: { id: string | number };
};

export type AdminStackParamList = {
  AdminPanel: undefined;
  CreateEditPost: { post?: Post };
  UserManagement: { role: "professor" | "student" };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Feed: undefined;
  Admin: undefined;
  Account: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const AdminStackNav = createNativeStackNavigator<AdminStackParamList>();
const AuthStackNav = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const PostStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: "FIAP Blog" }}
    />
    <Stack.Screen
      name="PostDetails"
      component={PostDetailsScreen}
      options={{ title: "Post" }}
    />
  </Stack.Navigator>
);

const AdminNavigator = () => (
  <AdminStackNav.Navigator>
    <AdminStackNav.Screen
      name="AdminPanel"
      component={AdminPanelScreen}
      options={{ title: "Admin" }}
    />
    <AdminStackNav.Screen
      name="CreateEditPost"
      component={CreateEditPostScreen}
      options={{ title: "Manage Post" }}
    />
    <AdminStackNav.Screen
      name="UserManagement"
      component={UserManagementScreen}
      options={{ title: "Manage Users" }}
    />
  </AdminStackNav.Navigator>
);

const AuthNavigator = () => (
  <AuthStackNav.Navigator screenOptions={{ headerShown: false }}>
    <AuthStackNav.Screen name="Login" component={LoginScreen} />
    <AuthStackNav.Screen name="Register" component={RegisterScreen} />
  </AuthStackNav.Navigator>
);

const AccountNavigator = () => {
  const { user } = useAuth();
  return user ? <ProfileScreen /> : <AuthNavigator />;
};

const MainTabNavigator = () => {
  const { isProfessor } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarIcon: ({ focused, color }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";
          if (route.name === "Feed") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Admin") {
            iconName = focused ? "settings" : "settings-outline";
          } else if (route.name === "Account") {
            iconName = focused ? "person" : "person-outline";
          }
          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}>
      <Tab.Screen
        name="Feed"
        component={PostStack}
        options={{ headerShown: false }}
      />
      {isProfessor ? (
        <Tab.Screen
          name="Admin"
          component={AdminNavigator}
          options={{ headerShown: false }}
        />
      ) : null}
      <Tab.Screen
        name="Account"
        component={AccountNavigator}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { loading } = useAuth();

  if (loading === true) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <MainTabNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;
