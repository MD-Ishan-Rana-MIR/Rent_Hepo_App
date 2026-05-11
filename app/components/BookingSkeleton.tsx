import tw from "@/lib/tailwind";
import { ScrollView, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BookingSkeleton = () => {
    // Create an array with 10 empty slots
    const skeletonCards = Array.from({ length: 10 });

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <StatusBar barStyle={"dark-content"} />

            {/* Header Skeleton Placeholder */}
            <View style={tw`px-10 pb-6`}>
                <View style={tw`w-40 h-6 bg-zinc-100 rounded-md`} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {skeletonCards.map((_, index) => (
                    <View
                        key={index}
                        style={tw`flex-row items-center bg-white border border-zinc-100 rounded-2xl p-4 mb-4 mx-6 shadow-sm`}
                    >
                        {/* Image Placeholder */}
                        <View style={tw`w-16 h-16 rounded-lg bg-zinc-100`} />

                        {/* Text Details Placeholder */}
                        <View style={tw`flex-1 ml-4`}>
                            <View style={tw`w-24 h-3 bg-zinc-100 rounded-md`} />
                            <View style={tw`w-32 h-2.5 bg-zinc-100 rounded-md mt-2`} />
                            <View style={tw`w-28 h-2 bg-zinc-100 rounded-md mt-2`} />
                            <View style={tw`w-16 h-2 bg-zinc-50 rounded-md mt-2`} />
                        </View>

                        {/* Action Buttons Placeholder */}
                        <View style={tw`flex-row items-center gap-x-2`}>
                            <View style={tw`w-6 h-6 rounded-full bg-zinc-100`} />
                            <View style={tw`w-6 h-6 rounded-full bg-zinc-100`} />
                            <View style={tw`w-6 h-6 rounded-full bg-zinc-100`} />
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

export default BookingSkeleton;