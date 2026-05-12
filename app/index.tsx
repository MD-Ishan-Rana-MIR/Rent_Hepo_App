import tw from '@/lib/tailwind';
import { router, SplashScreen } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Image, StatusBar, View } from 'react-native';
import { useUserProfileQuery } from './redux/api/authApi';

// Prevent the native splash screen from hiding until we are ready
SplashScreen.preventAutoHideAsync();

const Index = () => {
  const { data, isLoading, isError, isFetching } = useUserProfileQuery({});
  const userRole = data?.data?.user?.role;

  // console.log("userrole",userRole)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const handleNavigation = async () => {
      // Navigate if data is loaded or if an error occurred (to show login/splash)
      if (!isLoading && !isFetching) {
        timeout = setTimeout(async () => {
          await SplashScreen.hideAsync();

          if (data && userRole === "TENANT") {
            router.replace("/(tenant-tab)");
          } else if (data && userRole === "LANDLORD") {
            router.replace("/(property-owner-tab)");
          } else {
            // This covers isError cases or unauthenticated users
            router.replace("/(spalash-screen)");
          }
        }, 1500);
      }
    };

    handleNavigation();

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isLoading, isFetching, userRole, data, isError]);

  return (
    <View style={tw`bg-blackBg flex-1`}>
      <StatusBar barStyle="dark-content" />

      <View style={tw`flex-1 px-4 justify-between py-10`}>

        {/* Top Loading Indicator */}
        <View style={tw`items-center`}>
          {(isLoading || isFetching) && (
            <ActivityIndicator size="large" color={tw.color('btnColor')} />
          )}
        </View>

        {/* Center Logo */}
        <View style={tw`items-center justify-center flex-1`}>
          <Image
            source={require('../assets/images/app.logo.png')}
            style={tw`w-48 h-48`}
            resizeMode="contain"
          />
        </View>

        {/* Bottom Spacer to keep logo centered */}
        <View style={tw`h-20`} />

      </View>
    </View>
  );
};

export default Index;