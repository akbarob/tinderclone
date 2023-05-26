import {
  View,
  Text,
  SafeAreaView,
  Touchable,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Chatlist from "../Components/Chatlist";

export default function Chat() {
  return (
    <SafeAreaView className="flex-1 mt-10">
      <Header title="Chat" callEnabled />

      <Chatlist />
    </SafeAreaView>
  );
}
