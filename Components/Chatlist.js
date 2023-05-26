import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import ChatRow from "./ChatRow";

export default function Chatlist() {
  const [matches, setMatches] = useState();
  const {
    MemoValue: { userInfo },
  } = useAuth();
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "tindermatches"),
          where("usersMatched", "array-contains", userInfo.uid)
        ),
        (snapshot) =>
          setMatches(
            snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          )
      ),
    [userInfo]
  );
  return matches?.length > 0 ? (
    <FlatList
      data={matches}
      renderItem={({ item }) => <ChatRow matchDetails={item} />}
      keyExtractor={(item) => item.id}
    />
  ) : (
    <View>
      <Text>No matches at the moment</Text>
    </View>
  );
}
