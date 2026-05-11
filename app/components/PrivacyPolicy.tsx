import tw from '@/lib/tailwind';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, StatusBar, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html'; // 1. Import RenderHtml
import { useGetStaticPageQuery } from '../redux/api/staticPage';

const PrivacyPolicy = () => {
    const { width } = useWindowDimensions(); // 2. Get width for HTML rendering
    const { data, isLoading } = useGetStaticPageQuery("privacy-policy");

    // 3. Define styles for HTML tags to match your UI
    const tagsStyles = {
        p: tw`text-zinc-600 leading-6 text-base mb-4`,
        strong: tw`text-[#1E293B] font-bold`,
        i: tw`italic`,
        li: tw`text-zinc-600 leading-6 mb-2`,
        ol: tw`mb-4`,
        ul: tw`mb-4`,
    };

    return (
        <View style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />

            {/* --- CUSTOM HEADER --- */}
            <View style={tw`flex-row items-center px-4 pt-2`}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={tw`p-2 rounded-full bg-zinc-50`}
                >
                    <Ionicons name="arrow-back" size={24} color="#0474DA" />
                </TouchableOpacity>
                <Text style={tw`flex-1 text-center text-xl font-bold text-[#1E293B] mr-10`}>
                    {"Privacy Policy"}
                </Text>
            </View>

            {isLoading ? (
                <View style={tw`flex-1 justify-center items-center`}>
                    <ActivityIndicator size="large" color="#0474DA" />
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={tw`p-6 pb-12`}
                >
                    {/* --- DYNAMIC HTML CONTENT --- */}
                    <View style={tw`mb-4`}>
                        <RenderHtml
                            contentWidth={width}
                            source={{ html: data?.data?.content || "" }}
                            tagsStyles={tagsStyles}
                            // Ensuring default list markers appear correctly
                            systemFonts={['System']}
                        />
                    </View>

                    {/* --- CONTACT FOOTER --- */}
                    <View style={tw`mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100`}>
                        <Text style={tw`text-[#0474DA] font-bold mb-1`}>Questions about our Policy?</Text>
                        <Text style={tw`text-zinc-600 text-sm`}>
                            Contact our support team at support@yourapp.com
                        </Text>
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

export default PrivacyPolicy;