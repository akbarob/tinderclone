import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import Header from "../Components/Header";
import getMatchesUserInfo from "../lib/getMatchedUserInfo";
import SenderMessage from "../Components/SenderMessage";
import ReceiverMessage from "../Components/ReceiverMessage";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export default function Message() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  function SendMessage() {
    addDoc(collection(db, "tindermatches", matchDetails.id, "messages"), {
      timestamp: serverTimestamp(),
      photoURL: matchDetails.users[userInfo.uid].photoURL,
      displayName: userInfo.displayName,
      userId: userInfo.uid,
      messages: input,
    });
    console.log(`messages sent`);
    setInput("");
  }
  const {
    MemoValue: { userInfo },
  } = useAuth();
  const { params } = useRoute();
  const { matchDetails } = params;

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "tindermatches", matchDetails.id, "messages"),
          orderBy("timestamp", "asc")
        ),
        (snapshot) =>
          setMessages(
            snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          )
      ),
    [matchDetails, db]
  );
  return (
    <SafeAreaView className="flex-1 ">
      <Header
        title={
          getMatchesUserInfo(matchDetails?.users, userInfo.uid).displayName
        }
        callEnabled
      />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <FlatList
          className="pl-2 bg-rose-800  "
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) =>
            item.userId === userInfo.uid ? (
              <SenderMessage key={item.id} message={item} />
            ) : (
              <ReceiverMessage key={item.id} message={item} />
            )
          }
        />
      </TouchableWithoutFeedback>

      <View className=" flex-row justify-between items-center border-t border-gray-200 px-4 py-2">
        <TextInput
          className="h-10 text-lg w-[90%] "
          placeholder="send message..."
          onChangeText={setInput}
          value={input}
          // onSubmitEditing={SendMessage}
        />
        <TouchableOpacity onPress={SendMessage} disabled={!input}>
          <Text className={`${!input ? "text-gray-300" : "text-rose-500"}  `}>
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
