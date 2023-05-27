import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import getMatchesUserInfo from "../lib/getMatchedUserInfo";
import { db } from "../firebase";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

export default function ChatRow({ matchDetails }) {
  const [lastMessage, setLastMessage] = useState([]);
  const [matchedUserInfo, setMatchedUserInfo] = useState(null);
  const navigation = useNavigation();

  const {
    MemoValue: { userInfo },
  } = useAuth();

  useEffect(() => {
    setMatchedUserInfo(getMatchesUserInfo(matchDetails.users, userInfo.uid));
  }, [matchDetails, userInfo]);
  //   console.log("hereeee:", matchedUserInfo);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "tindermatches", matchDetails.id, "messages"),
          orderBy("timestamp", "desc"),
          limit(1)
        ),
        (snapshot) =>
          setLastMessage(
            snapshot.docs?.map((doc) => ({ id: doc.id, ...doc.data() }))
          )
      ),
    [(db, matchDetails)]
  );
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Message", {
          matchDetails,
        })
      }
      className="bg-white flex-row items-cemter px-5 py-3 mx-3 my-1 shadow-sm rounded-lg"
    >
      <Image
        source={{ uri: matchedUserInfo?.photoURL }}
        className="w-16 h-16 mr-4 rounded-full"
      />
      <View className="flex flex-col justify-between items-start">
        <Text>{matchedUserInfo?.displayName}</Text>
        {lastMessage ? (
          lastMessage?.map((last) => (
            <Text className="font-semibold text-xl" key={last.id}>
              {last.messages}
            </Text>
          ))
        ) : (
          <Text>say hi</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
