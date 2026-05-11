import { errorMsg } from '@/lib/errorMsg';
import { viewIcon } from '@/lib/icon';
import { successMsg } from '@/lib/successMsg';
import tw from '@/lib/tailwind';
import { LandlordProperty } from '@/lib/type';
import { imageUrl } from '@/lib/url';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { usePropertyDeleteMutation } from '../redux/api/landloardPropertyApi';

// 1. Export the interface so your Dashboard can see it



// 2. Change the component to accept 'props'
const LandLoadrdCard = (item: LandlordProperty) => {

    const [propertyDelete] = usePropertyDeleteMutation()


    const handlePropertyDelete = async (id: number) => {
        Alert.alert(
            "Update Profile",
            "Are you sure you want to save these changes?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Yes, Delete",
                    onPress: async () => {
                        try {
                            const res = await propertyDelete(id).unwrap();
                            if(res){
                                return successMsg(res?.message)
                            }
                        } catch (error:any) {
                            return errorMsg(error)
                        }

                    },
                },
            ],
            { cancelable: true }
        );

    }
    return (
        <View style={tw`bg-white rounded-[20px] overflow-hidden border border-zinc-100 mb-6 shadow-sm`}>
            {/* Image Section */}
            <Image
                source={{ uri: `${imageUrl}${item?.property_images[0].path}` }}
                style={tw`w-full h-48`}
                resizeMode="cover"
            />

            <View style={tw`px-5 mt-8`}>
                {/* Badge */}
                <View style={tw`bg-[#E6F1FB] self-start px-2.5 py-1.5 rounded mb-3`}>
                    <Text style={tw`text-primaryText text-small uppercase font-medium`}>
                        {item.property_category} • {item.status}
                    </Text>
                </View>

                {/* Title & Location */}
                <Text style={tw`mt-2 mb-2 font-medium text-textLg`}>
                    {item.title}
                </Text>
                <Text style={tw`text-small font-normal text-[#00000033] mb-4`}>
                    {item.location}
                </Text>

                {/* Price */}
                <Text style={tw`text-primaryText text-textLg font-medium mb-1`}>
                    ${item.price}
                </Text>

                {/* Divider */}
                <View style={tw`h-[1px] bg-zinc-100 w-full mb-4`} />

                {/* Action Buttons */}
                <View style={tw`flex-row items-center gap-x-3 mb-5`}>
                    <TouchableOpacity
                        onPress={() =>
                            router.navigate({
                                pathname: '/(property-owner-tab)/details/[id]',
                                params: { id: item.id }
                            })
                        }
                        style={tw`flex-1 flex-row items-center justify-center border border-seconderBoder py-3 rounded-[5px]`}
                    >
                        <SvgXml xml={viewIcon} />
                        <Text style={tw`text-primaryText font-montserrat-600 ml-2`}>View</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() =>
                            router.navigate({
                                pathname: '/(property-owner-tab)/update/[id]',
                                params: { id: item.id }
                            })
                        }
                        style={tw`flex-1 flex-row items-center justify-center border border-seconderBoder py-3 rounded-[5px]`}
                    >
                        <Feather name="edit-3" size={16} color={tw.color('primaryText')} />
                        <Text style={tw`text-primaryText font-montserrat-600 ml-2`}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => { handlePropertyDelete(item?.id) }}
                        style={tw`flex-1 flex-row items-center justify-center  border border-[#D21E1E] py-3 rounded-[5px]`}
                    >
                        <Feather name="trash-2" size={16} color="#EF4444" />
                        <Text style={tw`text-red-500 font-montserrat-600 ml-2`}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default LandLoadrdCard;