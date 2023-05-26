import { View, Text, TouchableOpacity } from "react-native";
import Foundation from "@expo/vector-icons/Foundation";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { useNavigation } from "@react-navigation/native";

export default function Header({ title, callEnabled }) {
  const navigation = useNavigation();
  return (
    <View className="p-2 px-4 flex-row items-center justify-between">
      <View className="flex flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={34} color="#ff5864" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">{title}</Text>
      </View>
      {callEnabled && (
        <TouchableOpacity className="bg-green-200 rounded-full p-3 w-16 h-16 justify-center items-center">
          <Foundation name="telephone" size={34} color="green" />
        </TouchableOpacity>
      )}
    </View>
  );
}
