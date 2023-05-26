import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as Google from "expo-auth-session/providers/google";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // const navigation = useNavigation();
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  //check for user
  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          //logged ing
          console.log("ran", auth.currentUser);
          setUserInfo(auth.currentUser);
          AsyncStorage.setItem("@user", JSON.stringify(user));
          setLoading(false);
        } else {
          // not logged in
          setUserInfo(null);
        }
        setLoading(false);
      }),

    []
  );

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "1042839886997-o92if7321rlhntqjb3tn6793t5r1jo93.apps.googleusercontent.com",
    iosClientId:
      "1042839886997-giqpm5n28gltuhogiq2jev73n379ree1.apps.googleusercontent.com",
    expoClientId:
      "1042839886997-afj0oalo89lcok42akuop24pu7m3g6a7.apps.googleusercontent.com",
    webClientId:
      "1042839886997-afj0oalo89lcok42akuop24pu7m3g6a7.apps.googleusercontent.com",
    selectAccount: true,
  });

  async function LogOut() {
    setLoading(true);
    if (userInfo) {
      signOut(auth)
        .then(async () => {
          setUserInfo(null);
          await AsyncStorage.removeItem("@user");
          // Sign-out successful.
        })
        .catch((error) => {
          // An error happened.
          console.log("error", error);
        });
    }
    setLoading(false);
  }
  async function LogIn() {
    setLoading(true);
    promptAsync();
  }
  function LogInIos() {
    setLoading(true);
    setUserInfo({
      uid: "J7XO5FBjAAQpFnUqAfvNMd8d93H3",
      email: "akbardev07@outlook.com",
      firstName: "Mo Salah",
      lastName: "Salah",
      displayName: "Mo Salah",
      photoURL:
        "https://lh3.googleusercontent.com/a/AGNmyxa_8vxqJ_dnpc9yTJl-9hlxWcvc2ziDJqRrWqDF=s96-c",
    });
    AsyncStorage.setItem("@user", JSON.stringify(userInfo));
    // setTimeout(setLoading(false, 3000));
    setLoading(false);
  }

  useEffect(() => {
    getUserFromGoogle();
  }, [response]);

  async function getUserFromGoogle() {
    const user = await AsyncStorage.getItem("@user");
    if (!user) {
      if (response?.type === "success") {
        setToken(response.authentication.accessToken);
        const { idToken, accessToken } = response.authentication;
        // console.log("here", response.authentication);
        const credential = GoogleAuthProvider.credential(idToken, accessToken);
        signInWithCredential(auth, credential);
        getUserInfo();
      }
      // return Promise.reject();
    } else {
      setUserInfo(JSON.parse(user));
    }
  }

  const getUserInfo = async () => {
    // if (!user) {
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      console.log("from google sign in", user);
    } catch (error) {
      // Add your own error handler here
    }
    // }
    // else {
    //   setUserInfo(JSON.parse(user));
    // }
  };
  const MemoValue = useMemo(
    () => ({
      loading,
      setLoading,
      userInfo,
      request,
      response,
      LogOut,
      LogIn,
      LogInIos,
    }),
    [userInfo, loading]
  );

  return (
    <AuthContext.Provider
      value={
        { MemoValue, request }
        // request,
        // response,
        // promptAsync,
        // LogOut,
        // LogIn,
      }
    >
      {loading ? (
        <SafeAreaView className="flex-1 h-screen justify-center items-center">
          <ActivityIndicator size="large" color="#00ff00" />
        </SafeAreaView>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}
