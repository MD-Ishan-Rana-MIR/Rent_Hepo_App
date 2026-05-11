import tw from '@/lib/tailwind';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useUserProfileQuery } from '../redux/api/authApi';

const LandloardProfileUpdate = () => {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const { data, isLoading } = useUserProfileQuery({});

    useEffect(() => {
        if (data?.data?.user) {
            const user = data.data.user;
            setFullName(user?.name);
            setAddress(user?.address);
            setPhone(user?.phone_number);
            setSelectedImage(user?.avatar_url);
        }
    }, [data]);

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

    // ============================= Skeleton UI Component ==============================
    const SkeletonField = () => (
        <View style={tw`mb-5`}>
            <View style={tw`h-4 w-24 bg-zinc-200 rounded mb-2`} />
            <View style={tw`h-14 bg-zinc-100 border border-zinc-200 rounded-xl`} />
        </View>
    );

    return (
        <View style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={tw`px-6 pt-4`}
            >
                {/* HEADER */}
                <View style={tw`flex-row items-center justify-center relative mb-4`}>
                    <TouchableOpacity onPress={() => router.back()} style={tw`absolute left-0`}>
                        <Ionicons name="arrow-back" size={28} color={tw.color('primaryText')} />
                    </TouchableOpacity>
                    <Text style={tw`text-xl font-montserrat-600 text-bodyText`}>Update Profile</Text>
                </View>

                {isLoading ? (
                    // ======================== LOADING SKELETON STATE ========================
                    <View style={tw`mt-8`}>
                        <View style={tw`items-center mb-8`}>
                            <View style={tw`w-32 h-32 rounded-full bg-zinc-200`} />
                            <View style={tw`h-6 w-40 bg-zinc-200 rounded mt-4`} />
                        </View>
                        <SkeletonField />
                        <SkeletonField />
                        <SkeletonField />
                        <View style={tw`h-14 bg-zinc-200 rounded-xl mt-6`} />
                    </View>
                ) : (
                    // ======================== ACTUAL CONTENT STATE ========================
                    <>
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
                            <Text style={tw`text-xl font-montserrat-700 text-bodyText mt-4`}>
                                {data?.data?.user?.name}
                            </Text>
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
                                        style={tw`text-bodyText font-montserrat-400 text-base`}
                                        value={address}
                                        onChangeText={setAddress}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={tw`bg-btnColor h-14 rounded-xl items-center justify-center mt-6 mb-10 shadow-sm`}
                                onPress={() => router.back()}
                            >
                                <Text style={tw`text-white text-lg font-montserrat-600`}>Save Changes</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
};

export default LandloardProfileUpdate;