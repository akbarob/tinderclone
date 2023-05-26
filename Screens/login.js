import {
  View,
  Text,
  Button,
  ImageBackground,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useLayoutEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
  const {
    MemoValue: { userInfo, LogIn, LogInIos, request },
  } = useAuth();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  });
  return (
    <View className="flex-1">
      <ImageBackground
        source={{ uri: "https://tinder.com/static/tinder.png" }}
        // resizeMode="cover"
        className="flex-1 relative"
      >
        <Text className="text-amber-500">Tinder!!!!!!!! Login</Text>
        {Platform.OS === "ios" ? (
          <TouchableOpacity
            onPress={() => {
              LogInIos();
            }}
            className="absolute p-4 mx-[25%] bottom-40 w-52 bg-white rounded-2xl"
          >
            <Text className="text-black text-center font-semibold p-2 text-lg">
              Ios Sign in & get swiping
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            title="Sign in with Google"
            disabled={!request}
            onPress={() => {
              LogIn();
            }}
            className={`absolute p-4 mx-[25%] bottom-40 w-52  ${
              !request ? "bg-gray-500 border-4 border-solid" : "bg-white"
            }rounded-2xl `}
          >
            <Text className="text-black text-center font-semibold p-2 text-lg">
              Sign in & get swiping
            </Text>
          </TouchableOpacity>
        )}
      </ImageBackground>
    </View>
  );
}
