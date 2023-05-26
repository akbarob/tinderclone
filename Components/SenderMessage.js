import { View, Text } from "react-native";
import React from "react";

export default function SenderMessage({ message }) {
  console.log("sender message", message.timestamp);
  return (
    <View className="flex flex-col items-end ml-auto ">
      <View className=" bg-indigo-600 rounded-lg rounded-tr-none  px-5 py-3 mx-3 my-2  ">
        <Text className="text-white">{message.messages}</Text>
      </View>
      <Text className="text-black text-[10px] -mt-1 mx-3 ">
        {new Intl.DateTimeFormat("en-GB", {
          timeStyle: "short",
        }).format(message?.timestamp)}
      </Text>
    </View>
  );
}
