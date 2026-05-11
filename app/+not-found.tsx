import { Link, Stack } from 'expo-router';
import React from 'react';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '../lib/tailwind';

const NotFoundScreen = () => {
    return (
        // bg-[#000000] matches your container style
        <SafeAreaView style={tw`flex-1 bg-blackBg`}>
            <StatusBar barStyle={"dark-content"}  />
            <Stack.Screen options={{ title: 'Oops!', headerShown: false }} />

            <View style={tw`flex-1 items-center justify-center px-10`}>
                {/* iconContainer logic */}
                <View style={tw`mb-5 p-5 rounded-[30px] bg-blueBg border border-primaryText  `}>
                    <Text style={tw`text-6xl font-black text-white tracking-[5px]`}>
                        404
                    </Text>
                </View>

                <Text style={tw`text-2xl font-bold text-primaryText mb-4`}>
                    Lost in Space?
                </Text>

                <Text style={tw`text-base text-primaryText text-center leading-6 mb-10`}>
                    The property or page you are looking for doesn't exist or has been moved to a new location.
                </Text>

                <Link href="/" asChild>
                    <TouchableOpacity
                        style={tw`bg-btnColor py-4 px-10 rounded-xl shadow-sm`}
                        activeOpacity={0.8}
                    >
                        <Text style={tw`text-white text-base font-bold text-center`}>
                            Return to Home
                        </Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </SafeAreaView>
    );
};

export default NotFoundScreen;