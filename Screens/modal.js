import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import * as ImagePicker from "expo-image-picker";
import ImageViewer from "../Components/ImageViewer";
import { useNavigation } from "@react-navigation/native";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { randomUUID } from "expo-crypto";

export default function Modal() {
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [job, onChangeJob] = React.useState("");
  const [name, onChangeName] = React.useState("");
  const [age, onChangeAge] = React.useState("");
  const [text, setText] = useState("Update Profile");
  const [imageUrl, setImageUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  // console.log("input", job, age);
  // console.log("image", selectedImage);

  const incompleteForm = !selectedImage || !job || !age;
  const {
    MemoValue: { userInfo, loading, setLoading },
  } = useAuth();

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      // console.log(result);

      setSelectedImage(result.assets[0].uri);
    } else {
      alert("You did not select any image.");
    }
  };

  const uploadImage = async () => {
    if (selectedImage && job && age) {
      // Upload file and metadata to the object 'images/mountains.jpg'
      console.log("...uploading");
      setText("Uploading...");
      //blob for pushing image to fire base cause of directory form mobile device
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", selectedImage, true);
        xhr.send(null);
      });

      const storageRef = ref(storage, `images/${"akbar" + randomUUID()} `);
      const uploadTask = uploadBytesResumable(storageRef, blob);
      setLoading(true);
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");

          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;

            // ...

            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            setImageUrl(downloadURL);
            console.log(imageUrl);

            console.log("for Upload", imageUrl);
            setTimeout(uploadProfile(downloadURL), 6000);
            setLoading(false);
          });
        }
      );
      // console.log(`image has been uploaded `);
    } else {
      setText("Upload");
      // setFields(true);
      // setTimeout(() => setFields(false), 2000);
      errorRef.current.scrollIntoView({ behavior: "smooth" });
      console.log(` profile Failed to be updated  `);
    }
  };

  function uploadProfile(downloadURL) {
    try {
      const docRef = setDoc(doc(db, "users", userInfo.uid), {
        id: userInfo.uid,
        displayName: userInfo.displayName,
        photoURL: downloadURL,
        job: job,
        age: age,
        timestamp: serverTimestamp(),
      }).then(() => navigation.navigate("Home"));
      setText("Upload");
    } catch (e) {
      console.error("Error adding document: ", e);
      alert(e);
    }
  }

  return (
    <SafeAreaView className="flex-1 items-center pt-1 relative">
      <Image
        source={{ uri: "https://links.papareact.com/2pf" }}
        className="h-20 w-full"
        resizeMode="contain"
      />
      <Text> welcome, {userInfo?.displayName}</Text>
      <View>
        <Text calssName="text-ceter p-4 font-bold text-rose-400">
          Step 1: The Profile Pic
        </Text>

        <ImageViewer
          placeholderImageSource="https://media.gettyimages.com/id/1343460307/photo/stephen-curry-of-the-golden-state-warriors-poses-for-a-portrait-during-the-golden-state.jpg?s=612x612&w=0&k=20&c=L526y0dgQ8q9_1JxeyVU1jbXB7IZ88mMoM596ZPBkMo="
          selectedImage={selectedImage}
        />
        <TouchableOpacity
          onPress={() => pickImageAsync()}
          className="bg-rose-400 px-6 py-2"
        >
          <Text className="text-black text-center">Upload Photo</Text>
        </TouchableOpacity>
      </View>
      {Platform.OS === "ios" && (
        <View>
          <Text className="text-center p-4 font-bold text-rose-400">
            Step 1.a: Your Display Name
          </Text>
          <TextInput
            onChangeText={onChangeName}
            value={name}
            className="text-center text-xl pb-2"
            placeholder="Enter your DIsplay Name"
            enterKeyHint="next"
          />
        </View>
      )}

      <View>
        <Text className="text-center p-4 font-bold text-rose-400">
          Step 2: Your occupation
        </Text>
        <TextInput
          onChangeText={onChangeJob}
          value={job}
          className="text-center text-xl pb-2"
          placeholder="Enter your Occupation"
          enterKeyHint="next"
        />
      </View>

      <View>
        <Text className="text-center p-4 font-bold text-rose-400">
          Step 3: Your Age
        </Text>
        <TextInput
          keyboardType="numeric"
          onChangeText={onChangeAge}
          value={age}
          maxLength={2}
          className="text-center text-xl pb-2"
          placeholder="Enter your Age"
          enablesReturnKeyAutomatically={true}
          enterKeyHint="done"
        />
      </View>
      <TouchableOpacity
        disabled={incompleteForm}
        onPress={() => uploadImage()}
        className={` p-3 w-64 absolute bottom-10 ${
          incompleteForm ? "bg-gray-200" : "bg-rose-400"
        }`}
      >
        <Text className="text-black text-center">{text}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
