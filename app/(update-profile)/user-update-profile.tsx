import tw from '@/lib/tailwind';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image, // Imported
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity, // Used to dismiss keyboard on background tap
    View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { useProfileUpdateMutation, useUserProfileQuery } from '../redux/api/authApi';

const UpdateProfile = () => {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const { data, isLoading } = useUserProfileQuery({});

    useEffect(() => {
        setFullName(data?.data?.user?.name);
        setPhone(data?.data?.user?.phone_number);
        setAddress(data?.data?.user?.address);
        setSelectedImage(data?.data?.user?.avatar_url)
    }, [data?.data?.user?.address, data?.data?.user?.avatar_url, data?.data?.user?.name, data?.data?.user?.phone_number])

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need access to your photos to update your profile.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    // ======================================== Profile Update =================================

    const [profileUpdate, { isLoading: updateLoading }] = useProfileUpdateMutation();


    const handleProfileUpdate = async () => {
        Alert.alert(
            "Update Profile",
            "Are you sure you want to update your profile?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "OK",
                    onPress: async () => {
                        try {
                            // 1. Create FormData instance
                            const formData = new FormData();

                            // 2. Append text fields
                            formData.append('name', fullName);
                            formData.append('phone_number', phone);
                            formData.append('address', address);

                            // 3. Append Image if a new one was selected
                            if (selectedImage && !selectedImage.startsWith('http')) {
                                const filename = selectedImage.split('/').pop();
                                const match = /\.(\w+)$/.exec(filename || '');
                                const type = match ? `image/${match[1]}` : `image`;

                                // @ts-ignore
                                formData.append('avatar', {
                                    uri: selectedImage,
                                    name: filename,
                                    type,
                                });
                            }

                            // 4. Send API Request
                            // Pass the formData directly to your mutation
                            const res = await profileUpdate(formData).unwrap();

                            if (res) {
                                Toast.show({
                                    type: 'success',
                                    text1: res?.message || 'Profile updated successfully',
                                });
                                router.back();
                            }

                        } catch (error: any) {
                            Toast.show({
                                type: 'error',
                                text1: 'Update failed',
                                text2: error?.data?.message || 'Something went wrong',
                            });
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={tw`flex-1 bg-white px-4`}>
            <StatusBar barStyle="dark-content" />

            {/* --- KEYBOARD AVOIDING VIEW --- */}
            <KeyboardAwareScrollView
                enableOnAndroid
                extraScrollHeight={80}
                keyboardShouldPersistTaps="handled"
                style={tw`flex-1`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={tw`flex-grow`}
            >
                {/* Dismisses keyboard when clicking outside inputs */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={tw``}
                >
                    {/* HEADER */}
                    <View style={tw`flex-row items-center justify-center relative `}>
                        <TouchableOpacity onPress={() => router.back()} style={tw`absolute -left-1`}>
                            <Ionicons name="arrow-back" size={28} color={tw.color('primaryText')} />
                        </TouchableOpacity>
                        <Text style={tw`text-xl font-montserrat-600 text-bodyText`}>Profile Update</Text>
                    </View>

                    {/* AVATAR */}
                    <View style={tw`items-center mt-8 mb-4`}>
                        <TouchableOpacity onPress={pickImage} style={tw`relative`}>
                            <View style={tw`w-32 h-32 rounded-full border-2 border-primaryText p-1`}>
                                <Image
                                    source={{ uri: selectedImage ?? 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400' }}
                                    style={tw`w-full h-full rounded-full`}
                                />
                            </View>
                            <View style={tw`absolute bottom-0 right-0 bg-primaryText w-9 h-9 rounded-full items-center justify-center border-4 border-white`}>
                                <Ionicons name="camera" size={18} color="white" />
                            </View>
                        </TouchableOpacity>
                        <Text style={tw`text-xl font-montserrat-700 text-bodyText mt-4`}>{data?.data?.user?.name}</Text>
                    </View>

                    {/* FORM */}
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
                                    multiline={false}
                                    style={tw`text-bodyText font-montserrat-400 text-base`}
                                    value={address}
                                    onChangeText={setAddress}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={tw`bg-btnColor h-14 rounded-xl items-center justify-center mt-6 shadow-sm`}
                            onPress={() => handleProfileUpdate()}
                        >
                            {updateLoading ? (
                                <View style={tw`flex-row items-center`}>
                                    <ActivityIndicator size="small" color={tw.color('secondery')} />
                                    {/* <Text style={tw`text-secondery text-lg font-bold ml-2`}>Processing...</Text> */}
                                </View>
                            ) : (
                                <Text style={tw`text-secondery text-lg font-bold`}>Save Changes</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAwareScrollView>
        </View>
    );
};

export default UpdateProfile;