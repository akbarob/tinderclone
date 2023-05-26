import { View, Text, Image } from "react-native";
import React from "react";

export default function ReceiverMessage({ message }) {
  console.log("Receivers message", message);

  return (
    <View className="flex flex-row ">
      <Image
        source={{ uri: message.photoURL }}
        className="h-10 w-10 rounded-full my-auto bg-gray-300"
      />
      <View>
        <View className="flex flex-row justify-start bg-rose-600 rounded-lg rounded-tl-none  px-5 py-3 mx-3 my-2">
          <Text className="text-white">{message?.messages}</Text>
        </View>
        <Text className="text-black text-[10px] -mt-1 mx-3 ">
          {new Intl.DateTimeFormat("en-GB", {
            timeStyle: "short",
          }).format(message?.timestamp)}
        </Text>
      </View>
    </View>
  );
}

{
  /* <View className="flex flex-col items-end ml-auto ">
      <View className=" bg-indigo-600 rounded-lg rounded-tr-none  px-5 py-3 mx-3 my-2  ">
        <Text className="text-white">{message.messages}</Text>
      </View>
      <Text className="text-black text-[10px] -mt-1 mx-3 ">
        {new Intl.DateTimeFormat("en-GB", {
          timeStyle: "short",
        }).format(message?.timestamp)}
      </Text>
    </View> */
}
