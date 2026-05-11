import { Stack } from "expo-router";
import { StatusBar } from "react-native";


export default function AuthLayout() {
  return (
    <>
      <StatusBar barStyle="dark-content" translucent />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      >
        <Stack.Screen name="index" />
        


      </Stack>
    </>
  );
}
