import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function Match() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { loggedInProfile, userSwiped } = params;
  // console.log(loggedInProfile, userSwiped);
  return (
    <View className="flex-1 h-full bg-rose-500 pt-20">
      <View className="px-10 pt-20 justify-center">
        <Image
          source={{ uri: "https://links.papareact.com/mg9" }}
          className="w-full h-28"
          resizeMode="contain"
        />
      </View>
      <Text className="text-2xl text-white text-center">
        You and{" "}
        <Text className="font-semibold">{userSwiped?.displayName} </Text> have
        liked each other
      </Text>

      <View className="flex-row mt-10 justify-evenly">
        <Image
          source={{ uri: loggedInProfile.photoURL }}
          className="w-32 h-32 rounded-full bg-gray-200"
          resizeMode="cover"
        />
        <Image
          source={{ uri: userSwiped.photoURL }}
          className="w-32 h-32 rounded-full bg-gray-200"
          resizeMode="cover"
        />
      </View>
      <TouchableOpacity
        className="bg-white m-5 px-10 py-8 rounded-full mt-20"
        onPress={() => {
          navigation.navigate("Chat");
          // alert("pressed");
        }}
      >
        <Text className="text-center font-bold">Send a message</Text>
      </TouchableOpacity>
    </View>
  );
}
