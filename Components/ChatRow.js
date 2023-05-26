import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import getMatchesUserInfo from "../lib/getMatchedUserInfo";

export default function ChatRow({ matchDetails }) {
  const [matchedUserInfo, setMatchedUserInfo] = useState(null);
  const navigation = useNavigation();

  const {
    MemoValue: { userInfo },
  } = useAuth();

  useEffect(() => {
    setMatchedUserInfo(getMatchesUserInfo(matchDetails.users, userInfo.uid));
  }, [matchDetails, userInfo]);
  //   console.log("hereeee:", matchedUserInfo);
  useEffect(() => {}, []);
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Message", {
          matchDetails,
        })
      }
      className="bg-rose-500/10 flex-row items-cemter px-5 py-3 mx-3 my-1 shadow-sm rounded-lg"
    >
      <Image
        source={{ uri: matchedUserInfo?.photoURL }}
        className="w-16 h-16 mr-4 rounded-full"
      />
      <View className="flex flex-col justify-between items-center">
        <Text>{matchedUserInfo?.displayName}</Text>
        <Text>say HI</Text>
      </View>
    </TouchableOpacity>
  );
}
