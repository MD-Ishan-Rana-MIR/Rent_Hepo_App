import tw from '@/lib/tailwind';
import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

const DashboardSkeleton = () => {
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
        <View style={tw`flex-1 bg-blackBg px-5`}>
            {/* Header Skeleton */}
            <View style={tw`flex-row items-center justify-between mt-2 mb-6`}>
                <Animated.View style={[tw`h-8 w-48 bg-zinc-200 rounded-lg`, { opacity }]} />
                <Animated.View style={[tw`h-10 w-10 bg-zinc-200 rounded-full`, { opacity }]} />
            </View>

            {/* Stats Grid Skeleton */}
            <View style={tw`flex-row flex-wrap justify-between mb-6`}>
                {[1, 2, 3, 4].map((i) => (
                    <Animated.View
                        key={i}
                        style={[
                            tw`bg-white rounded-[12px] p-4 mb-3`,
                            { width: '48%', height: 75, opacity, elevation: 1 }
                        ]}
                    >
                        <View style={tw`h-5 w-12 bg-zinc-200 rounded self-center mb-2`} />
                        <View style={tw`h-3 w-20 bg-zinc-100 rounded self-center`} />
                    </Animated.View>
                ))}
            </View>

            {/* Title Skeleton */}
            <Animated.View style={[tw`h-7 w-44 bg-zinc-200 rounded-md mb-6`, { opacity }]} />

            {/* Property Cards Skeleton List */}
            {[1, 2, 3].map((i) => (
                <View key={i} style={tw`mb-5 bg-white rounded-2xl p-3 border border-zinc-100 shadow-sm`}>
                    <Animated.View style={[tw`h-40 w-full bg-zinc-200 rounded-xl mb-3`, { opacity }]} />
                    <Animated.View style={[tw`h-5 w-3/4 bg-zinc-200 rounded mb-2`, { opacity }]} />
                    <Animated.View style={[tw`h-4 w-1/2 bg-zinc-100 rounded`, { opacity }]} />
                </View>
            ))}
        </View>
    );
};

export default DashboardSkeleton;