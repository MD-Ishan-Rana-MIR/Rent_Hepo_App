import tw from '@/lib/tailwind';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, ScrollView, StatusBar, View } from 'react-native';

const { width } = Dimensions.get('window');

const PropertyDetailsSkeleton = () => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <View style = {tw` flex-1 bg-blackBg  `} >
            <StatusBar barStyle={"dark-content"} />
            <View style={tw`flex-1 bg-white mt-10 `}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-32`}>

                    {/* 1. Header Image Skeleton */}
                    <Animated.View style={[tw`w-full h-80 bg-zinc-200`, { opacity }]} />

                    <View style={tw`px-5 pt-6`}>
                        {/* 2. Title & Price Row */}
                        <View style={tw`flex-row justify-between items-start`}>
                            <View style={tw`flex-1`}>
                                <Animated.View style={[tw`h-8 bg-zinc-200 rounded-md w-3/4`, { opacity }]} />
                                <View style={tw`flex-row items-center mt-3 gap-x-1`}>
                                    <View style={tw`w-4 h-4 bg-zinc-100 rounded-full`} />
                                    <Animated.View style={[tw`h-4 bg-zinc-100 rounded-md w-32`, { opacity }]} />
                                </View>
                            </View>
                            <View style={tw`items-end`}>
                                <Animated.View style={[tw`h-8 bg-zinc-200 rounded-md w-24`, { opacity }]} />
                                <Animated.View style={[tw`h-4 bg-zinc-100 rounded-md w-16 mt-2`, { opacity }]} />
                            </View>
                        </View>

                        {/* 3. Owner Section */}
                        <View style={tw`flex-row items-center mt-6 gap-x-2.5`}>
                            <Animated.View style={[tw`w-11 h-11 rounded-full bg-zinc-200`, { opacity }]} />
                            <View>
                                <Animated.View style={[tw`h-4 bg-zinc-200 rounded-md w-24`, { opacity }]} />
                                <Animated.View style={[tw`h-3 bg-zinc-100 rounded-md w-32 mt-1`, { opacity }]} />
                            </View>
                        </View>

                        {/* 4. Tags Section */}
                        <View style={tw`flex-row gap-x-2.5 mt-5`}>
                            {[1, 2, 3].map((i) => (
                                <Animated.View key={i} style={[tw`h-6 w-20 bg-zinc-100 rounded-[10px]`, { opacity }]} />
                            ))}
                        </View>

                        {/* 5. About Section */}
                        <Animated.View style={[tw`h-6 bg-zinc-200 rounded-md w-40 mt-6 mb-2.5`, { opacity }]} />
                        <Animated.View style={[tw`h-4 bg-zinc-100 rounded-md w-full mb-2`, { opacity }]} />
                        <Animated.View style={[tw`h-4 bg-zinc-100 rounded-md w-full mb-2`, { opacity }]} />
                        <Animated.View style={[tw`h-4 bg-zinc-100 rounded-md w-2/3`, { opacity }]} />

                        {/* 6. Amenities Section */}
                        <Animated.View style={[tw`h-6 bg-zinc-200 rounded-md w-32 mt-6 mb-5`, { opacity }]} />
                        <View style={tw`flex-row flex-wrap gap-3`}>
                            {[1, 2, 3, 4].map((i) => (
                                <Animated.View key={i} style={[tw`h-10 w-32 bg-zinc-50 border border-zinc-100 rounded-xl`, { opacity }]} />
                            ))}
                        </View>
                    </View>
                </ScrollView>

                {/* 7. Fixed Footer Skeleton */}
                <View style={tw`absolute bottom-0 w-full bg-white border-t-2 border-zinc-100 px-5 py-6 flex-row gap-x-3`}>
                    <Animated.View style={[tw`flex-1 h-12 bg-zinc-100 rounded-xl`, { opacity }]} />
                    <Animated.View style={[tw`flex-1 h-12 bg-zinc-100 rounded-xl`, { opacity }]} />
                    <Animated.View style={[tw`flex-1 h-12 bg-zinc-200 rounded-xl`, { opacity }]} />
                </View>
            </View>
        </View>
    );
};

export default PropertyDetailsSkeleton;