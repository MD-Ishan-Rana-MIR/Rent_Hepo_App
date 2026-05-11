import tw from '@/lib/tailwind';
import React from 'react';
import { ScrollView, StatusBar, View } from 'react-native';

const ProfileSkeleton = () => {
    // Helper to render a single skeleton menu item
    const SkeletonMenuItem = ({ isLast = false }: { isLast?: boolean }) => (
        <View style={tw`flex-row items-center justify-between py-4 ${!isLast ? 'border-b border-zinc-100' : ''}`}>
            <View style={tw`flex-row items-center flex-1`}>
                {/* Icon Placeholder */}
                <View style={tw`w-9 h-9 bg-zinc-100 rounded-[10px] mr-3`} />
                {/* Text Placeholder */}
                <View style={tw`w-36 h-4 bg-zinc-100 rounded-md`} />
            </View>
            {/* Chevron Placeholder */}
            <View style={tw`w-5 h-5 bg-zinc-50 rounded-full`} />
        </View>
    );

    // Create an array for the loop (10 items total)
    const items = Array.from({ length: 10 });

    return (
        <View style = {tw`bg-blackBg`}>
            <StatusBar barStyle="dark-content" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`px-5 pb-10`}>

                {/* --- HEADER SKELETON --- */}
                <View style={tw`mb-8 mt-2 items-center`}>
                    <View style={tw`w-24 h-8 bg-zinc-100 rounded-md`} />
                </View>

                {/* --- AVATAR SECTION SKELETON --- */}
                <View style={tw`items-center mb-8`}>
                    <View style={tw`w-32 h-32 rounded-full bg-zinc-100 border-4 border-zinc-50 p-1`} />
                    <View style={tw`w-40 h-6 bg-zinc-100 rounded-md mt-4`} />
                    <View style={tw`w-48 h-4 bg-zinc-50 rounded-md mt-2`} />
                </View>

                {/* --- SECTION 1 (General) --- */}
                <View style={tw`mb-3 px-1`}>
                    <View style={tw`w-20 h-4 bg-zinc-100 rounded-md`} />
                </View>
                <View style={tw`bg-white border border-zinc-100 rounded-[24px] px-5 shadow-sm mb-6`}>
                    {items.map((_, index) => (
                        <SkeletonMenuItem key={`gen-${index}`} isLast={index === items.length - 1} />
                    ))}
                </View>

                {/* --- SECTION 2 (Information) --- */}
                <View style={tw`mb-3 px-1`}>
                    <View style={tw`w-24 h-4 bg-zinc-100 rounded-md`} />
                </View>
                <View style={tw`bg-white border border-zinc-100 rounded-[24px] px-5 shadow-sm`}>
                    {items.map((_, index) => (
                        <SkeletonMenuItem key={`info-${index}`} isLast={index === items.length - 1} />
                    ))}
                </View>

                {/* --- LOGOUT BUTTON SKELETON --- */}
                <View style={tw`mt-10 h-14 bg-zinc-100 rounded-2xl w-full`} />

            </ScrollView>
        </View>
    );
};

export default ProfileSkeleton;