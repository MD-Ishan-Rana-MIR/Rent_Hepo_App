import tw from '@/lib/tailwind';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';

const LoginSelection = () => {
  return (
    <View style={tw`flex-1 bg-blackBg px-4 `}>
      <StatusBar barStyle={"dark-content"} />
      {/* --- HEADER --- */}
      <View style={tw` flex-row items-center`}>
        <TouchableOpacity
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={28} color={tw.color('primaryText')} />
        </TouchableOpacity>
      </View>

      {/* --- CONTENT CONTAINER --- */}
      <View style={tw`flex-1 justify-center `}>
        <Text style={tw`text-primaryText text-3xl font-bold mb-2 text-center `}>Welcome Back</Text>
        <Text style={tw`text-primaryText text-lg mb-8 text-center `}>Select your account type to continue</Text>

        {/* --- OWNER CARD --- */}
        <TouchableOpacity
          onPress={() => { router.push("/property-owner-login") }}
          activeOpacity={0.8}
          style={tw`bg-blueBg border border-primaryText p-6 rounded-[24px] mb-4 flex-row items-center`}
        >
          <View style={tw`w-14 h-14 bg-secondery/5 rounded-2xl items-center justify-center mr-4`}>
            <MaterialCommunityIcons name="home-city" size={32} style={tw` font-bold `} color="#E6F4FE" />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-secondery text-xl font-bold`}>LandLord</Text>
            <Text style={tw`text-secondery text-sm mt-1`}>Manage your portfolio, track return on investment (ROI) and oversee maintenance.</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" style={tw` font-bold `} size={34} color="#fff" />
        </TouchableOpacity>

        {/* --- TENANT CARD --- */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => { router.push("/tenant-login") }}
          style={tw`bg-blueBg border border-primaryText p-6 rounded-[24px] flex-row items-center`}
        >
          <View style={tw`w-14 h-14 bg-secondery/5 rounded-2xl items-center justify-center mr-4`}>
            <MaterialCommunityIcons name="key-variant" size={34} color="#E6F4FE" />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-secondery text-xl font-bold`}>Tenant</Text>
            <Text style={tw`text-secondery text-sm mt-1`}>Pay rent, request repairs, and view your lease agreements.</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={34} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginSelection;