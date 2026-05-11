import { Stack } from "expo-router";


export default function SpalashLayout() {
  return (
    <>
      
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      >
        <Stack.Screen name="index" />

        <Stack.Screen name="tanent-register"/>
        <Stack.Screen name="landloard-register"/>

        <Stack.Screen name="tenant-login"/>
        <Stack.Screen name="tenant-property-owner-login"/>


        <Stack.Screen name="email-verify"/>
        <Stack.Screen name="otp-verify"/>
        <Stack.Screen name="set-password"/>
        


      </Stack>
    </>
  );
}
