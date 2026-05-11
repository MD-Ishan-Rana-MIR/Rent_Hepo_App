import tw from '@/lib/tailwind';
import { Stack } from "expo-router";
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { Provider } from "react-redux";
import store from './redux/store/store';

// ১. toastConfig কে কম্পোনেন্টের বাইরে ডিফাইন করুন
const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={tw`bg-blueBg border-l-seconderyText h-16 w-11/12 rounded-xl`}
      contentContainerStyle={tw`px-4`}
      text1Style={tw`text-white text-base font-bold`}
      text2Style={tw`text-primaryText/60 text-xs`}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={tw`border-l-8 border-red-600 bg-red-500 h-16 w-11/12 rounded-xl border-l-black `}
      contentContainerStyle={tw`px-4`}
      text1Style={tw`text-white text-[16px] font-bold`}
      text2Style={tw`text-white text-[16px]`}
    />
  ),
};

export default function RootLayout() {
  return (
    <SafeAreaView style = {tw` flex-1 bg-blackBg `}  >
      <Provider store={store}>
        <StatusBar barStyle="dark-content" />

        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade",
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(spalash-screen)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(property-owner-tab)" />
          <Stack.Screen name="(tenant-tab)" />
          <Stack.Screen name="/components/notification/TanentNotification" />
          <Stack.Screen name="/components/notification/LandLoardNotification" />
        </Stack>
      </Provider>

      <Toast config={toastConfig} />
    </SafeAreaView>
  );
}