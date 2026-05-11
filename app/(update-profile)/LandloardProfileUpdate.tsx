import { errorMsg } from '@/lib/errorMsg';
import { successMsg } from '@/lib/successMsg';
import tw from '@/lib/tailwind';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useProfileUpdateMutation, useUserProfileQuery } from '../redux/api/authApi';

const LandloardProfileUpdate = () => {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // ============================= API Hooks ===========================================
    const [profileUpdate, { isLoading: updateLoading }] = useProfileUpdateMutation();
    const { data, isLoading, refetch } = useUserProfileQuery({});

    // Populate existing data
    useEffect(() => {
        if (data?.data?.user) {
            const user = data.data.user;
            setFullName(user?.name || '');
            setAddress(user?.address || '');
            setPhone(user?.phone_number || '');
            setSelectedImage(user?.avatar_url || null);
        }
    }, [data]);

    // ============================= Image Picker Logic ===================================
    const pickImage = async () => {

        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permissionResult.granted) {
                Alert.alert('Permission required', 'Permission to access the media library is required.');
                return;
            }

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images', 'videos'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.canceled) {
                setSelectedImage(result.assets[0].uri);
            }
        } catch (error) {
            return errorMsg(error)
        }
    };

    // ============================= Handle Update ========================================
    const handleUpdateProfile = async () => {
        Alert.alert(
            "Update Profile",
            "Are you sure you want to save these changes?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Yes, Update",
                    onPress: async () => {
                        // ২. ইউজার 'Yes' প্রেস করলে অরিজিনাল লজিক রান করবে
                        try {
                            const formData = new FormData();
                            formData.append('name', fullName);
                            formData.append('phone_number', phone);
                            formData.append('address', address);

                            // নতুন ইমেজ সিলেক্ট করা হলে তা যোগ করা
                            if (selectedImage && !selectedImage.startsWith('http')) {
                                const filename = selectedImage.split('/').pop();
                                const match = /\.(\w+)$/.exec(filename || '');
                                const type = match ? `image/${match[1]}` : `image`;

                                formData.append('avatar', {
                                    uri: selectedImage,
                                    name: filename,
                                    type,
                                } as any);
                            }

                            const res = await profileUpdate(formData).unwrap();
                            successMsg(res?.message || "Profile updated successfully");
                            refetch();
                            router.back();
                        } catch (error: any) {
                            errorMsg(error?.data?.message || "Something went wrong during update");
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    // ============================= Skeleton Loader UI ===================================
    const SkeletonField = () => (
        <View style={tw`mb-5`}>
            <View style={tw`h-4 w-24 bg-zinc-200 rounded mb-2`} />
            <View style={tw`h-14 bg-zinc-100 border border-zinc-200 rounded-xl`} />
        </View>
    );

    if (isLoading) {
        return (
            <View style={tw`flex-1 bg-white px-6 pt-12`}>
                <View style={tw`items-center mb-8`}>
                    <View style={tw`w-32 h-32 rounded-full bg-zinc-100`} />
                    <View style={tw`h-6 w-40 bg-zinc-100 rounded mt-4`} />
                </View>
                <SkeletonField />
                <SkeletonField />
                <SkeletonField />
                <View style={tw`h-14 bg-zinc-100 rounded-xl mt-6`} />
            </View>
        );
    }

    return (
        <View style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={tw`px-6 pt-4`}
            >
                {/* HEADER */}
                <View style={tw`flex-row items-center justify-center relative `}>
                    <TouchableOpacity onPress={() => router.back()} style={tw`absolute -left-1`}>
                        <Ionicons name="arrow-back" size={28} color={tw.color('primaryText')} />
                    </TouchableOpacity>
                    <Text style={tw`text-xl font-montserrat-600 text-bodyText`}>Change Password</Text>
                </View>

                {/* AVATAR SECTION */}
                <View style={tw`items-center mt-8 mb-4`}>
                    <TouchableOpacity onPress={pickImage} style={tw`relative`}>
                        <View style={tw`w-32 h-32 rounded-full border-2 border-primaryText p-1`}>
                            <Image
                                source={{ uri: selectedImage ?? 'https://via.placeholder.com/150' }}
                                style={tw`w-full h-full rounded-full`}
                            />
                        </View>
                        <View style={tw`absolute bottom-0 right-0 bg-primaryText w-9 h-9 rounded-full items-center justify-center border-4 border-white`}>
                            <Ionicons name="camera" size={18} color="white" />
                        </View>
                    </TouchableOpacity>
                    <Text style={tw`text-xl font-montserrat-700 text-bodyText mt-4`}>
                        {data?.data?.user?.name}
                    </Text>
                </View>

                {/* FORM SECTION */}
                <View style={tw`mt-6 gap-y-5`}>
                    <View>
                        <Text style={tw`text-base font-montserrat-600 text-black mb-2`}>Full Name</Text>
                        <View style={tw`h-14 border border-zinc-200 rounded-xl px-4 justify-center bg-white`}>
                            <TextInput
                                placeholder="Enter your full name"
                                style={tw`text-bodyText font-montserrat-400 text-base`}
                                value={fullName}
                                onChangeText={setFullName}
                            />
                        </View>
                    </View>

                    <View>
                        <Text style={tw`text-base font-montserrat-600 text-black mb-2`}>Phone Number</Text>
                        <View style={tw`h-14 border border-zinc-200 rounded-xl px-4 justify-center bg-white`}>
                            <TextInput
                                placeholder="Enter your phone number"
                                keyboardType="phone-pad"
                                style={tw`text-bodyText font-montserrat-400 text-base`}
                                value={phone}
                                onChangeText={setPhone}
                            />
                        </View>
                    </View>

                    <View>
                        <Text style={tw`text-base font-montserrat-600 text-black mb-2`}>Address</Text>
                        <View style={tw`h-14 border border-zinc-200 rounded-xl px-4 justify-center bg-white`}>
                            <TextInput
                                placeholder="Enter your address"
                                style={tw`text-bodyText font-montserrat-400 text-base`}
                                value={address}
                                onChangeText={setAddress}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[
                            tw`bg-btnColor h-14 rounded-xl items-center justify-center mt-6 mb-10 shadow-sm`,
                            updateLoading && tw`opacity-70`
                        ]}
                        onPress={handleUpdateProfile}
                        disabled={updateLoading}
                    >
                        {updateLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={tw`text-white text-lg font-montserrat-600`}>Save Changes</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export default LandloardProfileUpdate;