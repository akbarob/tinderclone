import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import useAuth from "../hooks/useAuth";

import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";

import Swiper from "react-native-deck-swiper";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  where,
  query,
  setDoc,
  getDoc,
  getDocsFromServer,
  DocumentSnapshot,
  serverTimestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase";
import { randomUUID } from "expo-crypto";
import generateId from "../lib/generateId";

export default function Home() {
  const swipeRef = useRef(null);
  const navigation = useNavigation();
  const [profile, setProfile] = useState([]);

  const {
    MemoValue: { userInfo, LogOut, request },
  } = useAuth();
  // console.log("userInfo", userInfo);

  useEffect(() => {
    let unsub;

    async function FetchProfile() {
      //passes
      const q = query(collection(db, "users", userInfo.uid, "passes"));
      const passes = await getDocs(q).then((snapshot) =>
        snapshot.docs.map((doc) => doc.id)
      );

      const passesUserIds = passes.length > 0 ? passes : ["test"];

      //matches

      const m = query(collection(db, "users", userInfo.uid, "matches"));
      const matches = await getDocs(m).then((snapshot) =>
        snapshot.docs.map((doc) => doc.id)
      );

      const matchesUserIds = matches.length > 0 ? matches : ["test"];

      unsub = onSnapshot(
        query(
          collection(db, "users"),
          where("id", "not-in", [...passesUserIds, ...matchesUserIds])
        ),
        (snapshot) => {
          setProfile(
            snapshot.docs
              .filter((doc) => doc.id !== userInfo.uid)
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
          );
        },
        (error) => {
          console.log(error);
        }
      );
    }
    FetchProfile();
    return unsub;
  }, [db]);
  // console.log("profiles", profile);
  useEffect(
    () =>
      onSnapshot(doc(db, "users", userInfo.uid), (snapshot) => {
        console.log("snapSHot:", snapshot.exists());
        if (!snapshot.exists()) {
          navigation.navigate("Modal");
        }
      }),
    []
  );

  function swipeLeft(cardIndex) {
    if (!profile[cardIndex]) return;
    const userSwiped = profile[cardIndex];
    console.log("you swiped pass on ", userSwiped.displayName);
    setDoc(doc(db, "users", userInfo.uid, "passes", userSwiped.id), userSwiped);
  }
  async function swipeRight(cardIndex) {
    if (!profile[cardIndex]) return;
    const userSwiped = profile[cardIndex];

    const loggedInProfile = (
      await getDoc(doc(db, "users", userInfo.uid))
    ).data();

    const SwipedProfile = (
      await getDoc(doc(db, "users", userSwiped.id))
    ).data();

    //check if the user swiped on you

    getDoc(doc(db, "users", userSwiped.id, "matches", userInfo.uid)).then(
      (documentSnapshot) => {
        if (documentSnapshot.exists()) {
          // user has matched with you before you swiped on them
          //create a match
          console.log(
            `Hooray you matched with ${userSwiped.displayName} -  ${userSwiped.job}`
          );

          //create a match
          setDoc(
            doc(db, "tindermatches", generateId(userInfo.uid, userSwiped.id)),
            {
              users: {
                [userInfo.uid]: loggedInProfile,
                [userSwiped.id]: userSwiped,
              },
              usersMatched: [userInfo.uid, userSwiped.id],
              timestamp: serverTimestamp(),
            }
          );
          navigation.navigate("Match", {
            loggedInProfile,
            userSwiped,
          });
        } else {
          // usser has swiped as first interaction between users
          console.log(`you swiped on ${userSwiped.displayName}`);
          setDoc(
            doc(db, "users", userInfo.uid, "matches", userSwiped.id),
            userSwiped
          );
        }
      }
    );

    console.log(`you swiped RIght  on ${userSwiped.displayName}`);
    setDoc(
      doc(db, "users", userInfo.uid, "matches", userSwiped.id),
      userSwiped
    );
  }

  const data = [
    {
      firstName: "Akbar",
      lastName: "Badmus",
      occupation: "Software Engineer",
      photoUrl: userInfo?.photoURL,
      age: 26,
    },
    {
      firstName: "Stephen",
      lastName: "Curry",
      occupation: "Professional Basketballer",
      photoUrl:
        "https://media.gettyimages.com/id/1343460307/photo/stephen-curry-of-the-golden-state-warriors-poses-for-a-portrait-during-the-golden-state.jpg?s=612x612&w=0&k=20&c=L526y0dgQ8q9_1JxeyVU1jbXB7IZ88mMoM596ZPBkMo=",
      age: 35,
    },
    {
      firstName: "Kylian",
      lastName: "Mbappe",
      occupation: "Professional Footballer",
      photoUrl:
        "https://www.planetsport.com/image-library/square/500/k/kylian-mbappe-psg-france-3-april-2022.jpg",
      age: 24,
    },
    {
      firstName: "Mohammed",
      lastName: "Salah",
      occupation: "Professional Footballer",
      photoUrl:
        "https://i2-prod.buzz.ie/incoming/article29069500.ece/ALTERNATES/s810/0_GettyImages-1453448459.jpg",
      age: 30,
    },
  ];

  // useLayoutEffect(() => {
  //   navigation.setOptions({ headerShown: false });
  // });

  return (
    <SafeAreaView className="flex-1 py-3">
      {/* Header */}
      <View className="flex flex-row justify-between items-center px-5">
        <TouchableOpacity className="">
          <Image
            source={{ uri: userInfo?.photoURL }}
            className="w-10 h-10 rounded-full"
          />
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-amber-300"
          onPress={() => navigation.navigate("Modal")}
        >
          <Image
            source={require("../assets/tinder-logo.png")}
            className="w-14 h-14 mt-2"
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity
          className=""
          onPress={() => navigation.navigate("Chat")}
        >
          <Ionicons name="chatbubbles-sharp" size={32} color="#ff5864" />
        </TouchableOpacity>
      </View>

      {/* Card */}
      <View className="flex-1 -mt-6 relative">
        <Swiper
          // infinite
          ref={swipeRef}
          stackSize={3}
          backgroundColor="#4fd0e9"
          cardIndex={0}
          verticalSwipe={false}
          showSecondCard
          animateCardOpacity
          containerStyle={{ backgroundColor: "transparent" }}
          cards={profile}
          onSwipedAll={() => {
            // alert("onSwipedAll");
            setProfile([]);
            console.log("end");
          }}
          onSwipedLeft={(cardIndex) => {
            swipeLeft(cardIndex);
            console.log("not a fit");
          }}
          onSwipedRight={(cardIndex) => {
            swipeRight(cardIndex);
            console.log(" a Good fit");
          }}
          keyExtractor={(card) => (card ? card.id : randomUUID())}
          renderCard={(card) =>
            card ? (
              <View
                className="bg-white h-3/4 rounded-xl"
                key={card.id}
                activeOpacity={1}
              >
                <Image
                  source={{ uri: card?.photoURL }}
                  className="absolute top-0 h-full w-full rounded-xl"
                />

                <View className="flex flex-row justify-between items-center bg-white w-full absolute bottom-0 px-6 py-6 rounded-b-xl shadow">
                  <View>
                    <Text className="text-xl font-bold">
                      {card?.displayName}
                    </Text>
                    <Text>{card?.job} </Text>
                  </View>
                  <View>
                    <Text className="text-3xl font-bold">{card?.age} </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View
                className="relative bg-white roundex-xl jus items-center justify-center shadow-md h-3/4"
                key={12}
              >
                <Text className="font-bold pb-5">No more Profiles</Text>
                <Image
                  resizeMode="contain"
                  source={{ uri: "https://links.papareact.com/6gb" }}
                  className="w-full h-20  rounded-xl"
                />
              </View>
            )
          }
          overlayLabels={{
            left: {
              title: "cold",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "Hot",
              style: {
                label: {
                  textAlign: "left",
                  color: "green",
                },
              },
            },
          }}
        />
      </View>

      {/* <Text>home</Text>
      {userInfo && <Text>{userInfo.email}</Text>}

      <Text>TO Log out</Text>
      <TouchableOpacity onPress={LogOut} className="py-3 px-6 bg-amber-500">
        <Text>Press here</Text>
      </TouchableOpacity> */}

      <View className="flex flex-row justify-evenly items-center">
        <TouchableOpacity
          className="justify-center items-center rounded-full w-16 h-16 bg-red-200"
          onPress={() => {
            swipeRef.current.swipeLeft();
          }}
        >
          <Entypo name="cross" size={24} color="red" />
        </TouchableOpacity>

        <TouchableOpacity
          className="justify-center items-center rounded-full w-16 h-16 bg-green-200"
          onPress={() => {
            swipeRef.current.swipeRight();
          }}
        >
          <AntDesign name="heart" size={24} color="green" />
        </TouchableOpacity>
      </View>
      {/* <TouchableOpacity
        className="justify-center items-center rounded-full w-16 h-16 bg-green-200"
        onPress={() => {}}
      >
        <Text name="heart" size={24} color="green">
          Rrefresh
        </Text>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
}
