import Toast from "react-native-toast-message";

export const errorMsg = (error: any) => {
  Toast.show({
    type: "error",
    text2: error,
    position: "top",
    topOffset: 60,
    visibilityTime: 3000,
  });
};
