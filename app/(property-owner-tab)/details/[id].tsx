import PropertyDetailsSkeleton from '@/app/components/PropertyDetailsSkeleton';
import { useSingleLandloardPropertyDetailsQuery } from '@/app/redux/api/landloardPropertyApi';
import tw from '@/lib/tailwind';
import { LandlordPropertyDetails } from '@/lib/type';
import { imageUrl } from '@/lib/url';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const LandloadPropertyDetails = () => {
    const { id } = useLocalSearchParams();

    


    const { data, isLoading } = useSingleLandloardPropertyDetailsQuery(id);


    const propertyDetails : LandlordPropertyDetails = data?.data


    if (isLoading) {
        return (
            <PropertyDetailsSkeleton />
        )
    }



    return (
        <View style={tw`flex-1 bg-blackBg px-5 `}>
            {/* Header */}
            <View style={tw`flex-row items-center justify-between  `}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={28} color={tw.color('primaryText')} />
                </TouchableOpacity>
                <Text style={tw` text-bodyText font-medium text-textTwoXl `}>{propertyDetails?.title}</Text>
                <View style={tw`w-6`} /> Spacer
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw``}>
                {/* Hero Image */}
                <View style={tw` mt-6.5`}>
                    <Image
                        source={{ uri: `${imageUrl}${propertyDetails?.property_images[0].path}`}}
                        style={tw`w-full h-64 rounded-[20px]`}
                        resizeMode="cover"
                    />
                </View>

                {/* Info Section */}
                <View style={tw` mt-6`}>
                    <View style={tw`flex-row justify-between items-center`}>
                        <Text style={tw` text-bodyText font-medium text-textLg  `}>About This Property</Text>
                        <View>
                            <Text style={tw`font-medium text-textLg text-primaryText`}>${propertyDetails?.price}</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={tw`text-[10px] text-[#00C33A] font-medium text-right`}>Available Now</Text>

                    </View>

                    <Text style={tw` mt-5 text-bodyText  `}>
                        {
                            propertyDetails?.description
                        }
                    </Text>
                </View>

                {/* Amenities Grid */}
                <View style={tw` mt-8`}>
                    <Text style={tw`text-textLg font-medium text-bodyText mb-5`}>Prime Amenities</Text>
                    <View style={tw`flex-row flex-wrap gap-x-2 gap-y-2.5 `}>
                        {propertyDetails?.amenities.map((item, index) => (
                            <View key={index} style={tw`flex-row items-center bg-white border border-[#E8E8E8] px-3 py-2.5 rounded-xl`}>
                                <Feather name="check-circle" size={16} color="#0474DA" />
                                <Text style={tw`ml-2 text-[#6B6B6B] text-xs font-medium`}>{item}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default LandloadPropertyDetails;