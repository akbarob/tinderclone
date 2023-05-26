import { StatusBar } from "expo-status-bar";
import {
  Button,
  StyleSheet,
  Text,
  View,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import useAuth, { AuthProvider } from "./hooks/useAuth";
import StackNavigator from "./StackNavigator";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <SafeAreaProvider>
          <KeyboardAvoidingView
            className="flex-1"
            // keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <StackNavigator />
          </KeyboardAvoidingView>
        </SafeAreaProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
