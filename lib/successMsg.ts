import Toast from "react-native-toast-message";

export const successMsg = (msg: string) => {
  Toast.show({
    type: "success",
    text1: msg,
    position: "top",
    visibilityTime: 3000,
  });
};
