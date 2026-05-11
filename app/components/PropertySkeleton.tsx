import tw from '@/lib/tailwind';
import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StatusBar, View } from 'react-native';

const PropertySkeleton = () => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <View style={tw`flex-1  bg-blackBg px-5 `} >
            <StatusBar barStyle={"dark-content"} />
            <View style = {tw`mt-10`} >
                <ScrollView showsVerticalScrollIndicator={false} >
                    <Animated.View
                        style={[
                            tw`bg-white border border-zinc-100 rounded-[24px] mb-5 overflow-hidden shadow-sm`,
                            { opacity }
                        ]}
                    >
                        {/* Image Placeholder */}
                        <View style={tw`w-full h-48 bg-zinc-200`} />

                        <View style={tw`px-4 mt-7 pb-6`}>
                            {/* Badges Placeholder */}
                            <View style={tw`flex-row gap-x-2.5 mb-5`}>
                                <View style={tw`bg-zinc-200 h-6 w-20 rounded-[10px]`} />
                                <View style={tw`bg-zinc-200 h-6 w-24 rounded-[10px]`} />
                                <View style={tw`bg-zinc-200 h-6 w-16 rounded-[10px]`} />
                            </View>

                            {/* Title & Status Placeholder */}
                            <View style={tw`flex flex-row items-center justify-between`}>
                                <View style={tw`h-6 bg-zinc-200 rounded-md w-2/3`} />
                                <View style={tw`h-6 bg-zinc-200 rounded-[24px] w-16`} />
                            </View>

                            {/* Location Placeholder */}
                            <View style={tw`h-4 bg-zinc-100 rounded-md w-1/2 mt-2.5`} />

                            {/* Price Placeholder */}
                            <View style={tw`h-7 bg-zinc-200 rounded-md w-1/3 mt-5`} />
                        </View>
                    </Animated.View>
                    <Animated.View
                        style={[
                            tw`bg-white border border-zinc-100 rounded-[24px] mb-5 overflow-hidden shadow-sm`,
                            { opacity }
                        ]}
                    >
                        {/* Image Placeholder */}
                        <View style={tw`w-full h-48 bg-zinc-200`} />

                        <View style={tw`px-4 mt-7 pb-6`}>
                            {/* Badges Placeholder */}
                            <View style={tw`flex-row gap-x-2.5 mb-5`}>
                                <View style={tw`bg-zinc-200 h-6 w-20 rounded-[10px]`} />
                                <View style={tw`bg-zinc-200 h-6 w-24 rounded-[10px]`} />
                                <View style={tw`bg-zinc-200 h-6 w-16 rounded-[10px]`} />
                            </View>

                            {/* Title & Status Placeholder */}
                            <View style={tw`flex flex-row items-center justify-between`}>
                                <View style={tw`h-6 bg-zinc-200 rounded-md w-2/3`} />
                                <View style={tw`h-6 bg-zinc-200 rounded-[24px] w-16`} />
                            </View>

                            {/* Location Placeholder */}
                            <View style={tw`h-4 bg-zinc-100 rounded-md w-1/2 mt-2.5`} />

                            {/* Price Placeholder */}
                            <View style={tw`h-7 bg-zinc-200 rounded-md w-1/3 mt-5`} />
                        </View>
                    </Animated.View>
                    <Animated.View
                        style={[
                            tw`bg-white border border-zinc-100 rounded-[24px] mb-5 overflow-hidden shadow-sm`,
                            { opacity }
                        ]}
                    >
                        {/* Image Placeholder */}
                        <View style={tw`w-full h-48 bg-zinc-200`} />

                        <View style={tw`px-4 mt-7 pb-6`}>
                            {/* Badges Placeholder */}
                            <View style={tw`flex-row gap-x-2.5 mb-5`}>
                                <View style={tw`bg-zinc-200 h-6 w-20 rounded-[10px]`} />
                                <View style={tw`bg-zinc-200 h-6 w-24 rounded-[10px]`} />
                                <View style={tw`bg-zinc-200 h-6 w-16 rounded-[10px]`} />
                            </View>

                            {/* Title & Status Placeholder */}
                            <View style={tw`flex flex-row items-center justify-between`}>
                                <View style={tw`h-6 bg-zinc-200 rounded-md w-2/3`} />
                                <View style={tw`h-6 bg-zinc-200 rounded-[24px] w-16`} />
                            </View>

                            {/* Location Placeholder */}
                            <View style={tw`h-4 bg-zinc-100 rounded-md w-1/2 mt-2.5`} />

                            {/* Price Placeholder */}
                            <View style={tw`h-7 bg-zinc-200 rounded-md w-1/3 mt-5`} />
                        </View>
                    </Animated.View>
                </ScrollView>
            </View>
        </View>
    );
};

export default PropertySkeleton;