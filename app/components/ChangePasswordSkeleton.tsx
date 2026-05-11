import tw from '@/lib/tailwind';
import React from 'react';
import { Animated, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SkeletonItem = ({ style }: { style: any }) => {
    const opacity = React.useRef(new Animated.Value(0.3)).current;

    React.useEffect(() => {
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
    }, [opacity]);

    return <Animated.View style={[style, tw`bg-zinc-200`, { opacity }]} />;
};

const ChangePasswordSkeleton = () => {
    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <ScrollView contentContainerStyle={tw`px-6 pb-10`}>

                {/* HEADER SKELETON */}
                <View style={tw`flex-row items-center justify-center relative mb-4`}>
                    <SkeletonItem style={tw`w-8 h-8 rounded-full absolute left-0`} />
                    <SkeletonItem style={tw`w-40 h-6 rounded-md`} />
                </View>

                {/* PROFILE INFO SKELETON */}
                <View style={tw`items-center mt-8 mb-6`}>
                    <SkeletonItem style={tw`w-24 h-24 rounded-full p-1`} />
                    <SkeletonItem style={tw`w-32 h-6 rounded-md mt-4`} />
                </View>

                <View style={tw`h-px bg-zinc-100 w-full mb-6`} />

                {/* FORM FIELDS SKELETON */}
                <View style={tw`gap-y-6`}>
                    {[1, 2, 3].map((item) => (
                        <View key={item}>
                            <SkeletonItem style={tw`w-32 h-5 rounded-md mb-2`} />
                            <SkeletonItem style={tw`w-full h-14 rounded-xl`} />
                        </View>
                    ))}

                    {/* BUTTON SKELETON */}
                    <SkeletonItem style={tw`w-full h-14 rounded-xl mt-6`} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ChangePasswordSkeleton;