import { password, profile } from '@/lib/icon';
import tw from '@/lib/tailwind';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, RefreshControl, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import Toast from 'react-native-toast-message';
import ProfileSkeleton from '../components/ProfileSkeleton';
import { useDeleteAccountMutation, useUserLogoutMutation, useUserProfileQuery } from '../redux/api/authApi';

const Profile = () => {

  // Enhanced MenuItem for consistency
  const MenuItem = ({ icon, title, onPress, isLast = false }: any) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={tw`flex-row items-center justify-between py-4 ${!isLast ? 'border-b border-zinc-100' : ''}`}
    >
      <View style={tw`flex-row items-center flex-1`}>
        <View style={tw`w-9 h-9 bg-[#E8EDF5] rounded-[10px] items-center justify-center mr-3`}>
          {icon}
        </View>
        <Text style={tw`text-bodyText text-base font-montserrat-500`}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#1A4B9B" />
    </TouchableOpacity>
  );



  // ============================= Landloard Profile Api ===========================================

  const queryArg = useMemo(() => ({}), []);

  const { data, isLoading, refetch } = useUserProfileQuery(queryArg);



  // ==================================== Logout Api ===========================================


  const [userLogout, { isLoading: logoutLoading }] = useUserLogoutMutation();



  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {

            try {
              const res = await userLogout({}).unwrap();

              if (res) {
                await AsyncStorage.removeItem("token");
                await AsyncStorage.removeItem("land-loard-token");

                Toast.show({
                  type: 'success',
                  text1: 'Logged out successfully',
                });
                return router.replace("/(auth)");
              }

            } catch (error: any) {
              Toast.show({
                type: 'error',
                text1: 'Logout failed',
                text2: error?.data?.message,
              });
            }
          }
        }
      ]
    );
  };


  const [deleteAccount] = useDeleteAccountMutation();

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Logout",
      "Are you sure delete you account?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {

            try {
              const res = await deleteAccount({}).unwrap();

              if (res) {
                await AsyncStorage.removeItem("token");
                await AsyncStorage.removeItem("land-loard-token");

                Toast.show({
                  type: 'success',
                  text1: res?.message,
                });
                return router.replace("/(spalash-screen)");
              }

            } catch (error: any) {
              Toast.show({
                type: 'error',
                text1: 'Logout failed',
                text2: error?.data?.message,
              });
            }
          }
        }
      ]
    );
  }


  const [user, setUser] = useState({});


  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      await refetch();
    } catch (error) {
      // console.log(error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setUser(data);
  }, [data]);





  if (isLoading) {
    return (
      <ProfileSkeleton />
    )
  }




  return (
    <SafeAreaView style={tw`flex-1 bg-blackBg`}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`px-5 pb-10`}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {/* --- HEADER --- */}
        <View style={tw`mb-8`}>
          <Text style={tw`text-center text-2xl font-montserrat-600 text-profileTextColor`}>
            Profile
          </Text>
        </View>

        {/* --- AVATAR SECTION --- */}
        <View style={tw`items-center mb-8`}>
          <View style={tw`relative`}>
            <View style={tw`w-32 h-32 rounded-full border-4 border-primaryBorder p-1`}>
              <Image
                source={
                  data?.data?.user?.avatar_url
                    ? { uri: data?.data?.user?.avatar_url }
                    : require('../../assets/images/user.png')
                }
                style={tw`w-full h-full rounded-full`}
              />
            </View>
            {/* Optional: Add back the Edit icon if you need image uploads */}
            <View
              style={tw`absolute bottom-4 right-2 bg-primaryText w-4 h-4 rounded-full items-center justify-center border-2 border-white`}
            >
            </View>
          </View>
          <Text style={tw`text-xl text-profileTextColor font-montserrat-700 mt-3`}>{data?.data?.user?.name}</Text>
          <Text style={tw`mt-1 text-zinc-500 font-montserrat-400 text-sm`}>
            {data?.data?.user?.email}
          </Text>
        </View>

        {/* --- GENERAL SECTION --- */}
        <View style={tw`mb-3`}>
          <Text style={tw`font-montserrat-600 text-base text-bodyText px-1`}>General</Text>
        </View>

        <View style={tw`bg-white border border-primaryBorder/10 rounded-[24px] px-5 shadow-sm mb-6`}>
          <MenuItem
            icon={<SvgXml xml={profile} width="18" height="18" />}
            title="Update Profile"
            onPress={() => router.push("/(update-profile)/LandloardProfileUpdate")}
          />

          <MenuItem
            icon={<SvgXml xml={password} width="18" height="18" />}
            title="Change Password"
            onPress={() => router.push("/(password-update)/LandloardPasswordChange")}
            isLast={true}
          />
          <MenuItem
            icon={<SvgXml xml={profile} width="18" height="18" />}
            title="Delete Account"
            onPress={() => handleDeleteAccount()}
            isLast={true}
          />
        </View>


        <View style={tw`bg-white border border-primaryBorder/10 rounded-[24px] px-5 shadow-sm`}>
          <MenuItem
            icon={<MaterialCommunityIcons name="shield-check-outline" size={20} color="#1A4B9B" />}
            title="Privacy Policy"
            onPress={() => router.push("/components/PrivacyPolicy")}

          />
          <MenuItem
            icon={<MaterialCommunityIcons name="text-box-check-outline" size={20} color="#1A4B9B" />}
            title="Terms & Condiction"
            onPress={() => router.push("/components/TermsAndConditions")}
          />
          <MenuItem
            icon={<MaterialCommunityIcons name="help-circle-outline" size={20} color="#1A4B9B" />}
            title="Help & Support"
            isLast={true}
            onPress={() => router.push("/components/HelpAndSupport")}
          />
        </View>



        {/* --- LOGOUT BUTTON --- */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={tw`mt-10 flex-row items-center justify-center bg-[#E50000] py-4 rounded-2xl border border-red-100`}
          onPress={() => handleLogout()}
        >
          {logoutLoading ? (
            <View style={tw`flex-row items-center`}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={tw`text-white font-bold ml-2`}>Processing...</Text>
            </View>
          ) : (
            <View style={tw`flex-row items-center`}>
              <MaterialCommunityIcons name="logout" size={20} color="#fff" style={tw`mr-2`} />
              <Text style={tw`text-white font-montserrat-700 text-base`}>Log Out</Text>
            </View>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;