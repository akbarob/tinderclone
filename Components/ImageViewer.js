import { Image } from "react-native";
export default function ImageViewer({ placeholderImageSource, selectedImage }) {
  const imageSource =
    selectedImage !== null
      ? { uri: selectedImage }
      : { uri: placeholderImageSource };
  //   console.log(selectedImage);
  return (
    <Image
      source={imageSource}
      className="w-44 h-44 bg-gray-400 rounded-sm"
      resizeMode="cover"
    />
  );
}
