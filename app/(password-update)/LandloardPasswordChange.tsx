import { errorMsg } from '@/lib/errorMsg';
import { successMsg } from '@/lib/successMsg';
import tw from '@/lib/tailwind';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';
import ChangePasswordSkeleton from '../components/ChangePasswordSkeleton';
import { useUpdatePasswordMutation, useUserProfileQuery } from '../redux/api/authApi';

// ১. ভ্যালিডেশন স্কিমা
const schema = yup.object().shape({
    old_password: yup.string().required('Current password is required'),
    new_password: yup
        .string()
        .required('New password is required')
        .min(6, 'Password must be at least 6 characters'),
    confirm_password: yup
        .string()
        .oneOf([yup.ref('new_password')], 'Passwords must match')
        .required('Please confirm your password'),
});

const LandloardPasswordChange = () => {
    const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
    const { data: profileData, isLoading: profileLoading } = useUserProfileQuery({});

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const isMounted = React.useRef(true);

    React.useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false; // স্ক্রিন আনমাউন্ট হলে এটি false হবে
        };
    }, []);

    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            old_password: '',
            new_password: '',
            confirm_password: '',
        }
    });

    const onSubmit = async (formData: any) => {
        Alert.alert(
            "Change Password",
            "Are you sure you want to update your password?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Update",
                    onPress: async () => {
                        try {
                            const payload = {
                                current_password: formData.old_password,
                                password: formData.new_password,
                                password_confirmation: formData.confirm_password
                            };

                            const res = await updatePassword(payload).unwrap();

                            // শুধুমাত্র স্ক্রিন মাউন্ট থাকলে অ্যালার্ট বা মেসেজ দেখান
                            if (isMounted.current) {
                                successMsg(res?.message || "Password updated!");
                                reset();
                                router.back();
                            }
                        } catch (error: any) {
                            if (isMounted.current) {
                                errorMsg(error?.data?.message || "Update failed");
                            }
                        }
                    }
                }
            ]
        );
    };

    if (profileLoading) {
        return <ChangePasswordSkeleton />;
    }

    const user = profileData?.data?.user;

    return (
        <View style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />
            <KeyboardAwareScrollView
                enableOnAndroid
                extraScrollHeight={80}
                keyboardShouldPersistTaps="handled"
                style={tw`flex-1`}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`px-6 pb-10`}>

                    {/* HEADER */}
                    <View style={tw`flex-row items-center justify-center relative `}>
                        <TouchableOpacity onPress={() => router.back()} style={tw`absolute -left-1`}>
                            <Ionicons name="arrow-back" size={28} color={tw.color('primaryText')} />
                        </TouchableOpacity>
                        <Text style={tw`text-xl font-montserrat-600 text-bodyText`}>Change Password</Text>
                    </View>

                    {/* USER INFO */}
                    <View style={tw`items-center mt-8 mb-6`}>
                        <View style={tw`w-24 h-24 rounded-full border-2 border-primaryText p-1`}>
                            <Image
                                source={{ uri: user?.avatar_url || 'https://via.placeholder.com/150' }}
                                style={tw`w-full h-full rounded-full`}
                            />
                        </View>
                        <Text style={tw`text-xl font-montserrat-700 text-bodyText mt-4`}>
                            {user?.name || "User Name"}
                        </Text>
                    </View>

                    <View style={tw`h-px bg-zinc-100 w-full mb-6`} />

                    {/* FORM */}
                    <View style={tw`gap-y-5`}>

                        <PasswordField
                            control={control}
                            name="old_password"
                            label="Current Password"
                            placeholder="Enter current password"
                            isSecure={showOld}
                            toggleSecure={() => setShowOld(!showOld)}
                            error={errors.old_password?.message}
                        />

                        <PasswordField
                            control={control}
                            name="new_password"
                            label="New Password"
                            placeholder="Enter new password"
                            isSecure={showNew}
                            toggleSecure={() => setShowNew(!showNew)}
                            error={errors.new_password?.message}
                        />

                        <PasswordField
                            control={control}
                            name="confirm_password"
                            label="Confirm New Password"
                            placeholder="Confirm your password"
                            isSecure={showConfirm}
                            toggleSecure={() => setShowConfirm(!showConfirm)}
                            error={errors.confirm_password?.message}
                        />

                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[
                                tw`bg-btnColor h-14 rounded-xl items-center justify-center mt-6 shadow-sm`,
                                isLoading && tw`opacity-70`
                            ]}
                            onPress={handleSubmit(onSubmit)}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={tw`text-white text-lg font-montserrat-600`}>Save Changes</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAwareScrollView>
        </View>
    );
};

// পাসওয়ার্ড ফিল্ড কম্পোনেন্ট
const PasswordField = ({ control, name, label, placeholder, isSecure, toggleSecure, error }: any) => (
    <View>
        <Text style={tw`text-base font-montserrat-600 text-black mb-2`}>{label}</Text>
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value } }) => (
                <View style={tw`h-14 border ${error ? 'border-red-500' : 'border-zinc-200'} rounded-xl px-4 flex-row items-center bg-white`}>
                    <TextInput
                        placeholder={placeholder}
                        secureTextEntry={!isSecure}
                        style={tw`flex-1 text-bodyText font-montserrat-400 text-base`}
                        value={value}
                        onChangeText={onChange}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={toggleSecure} style={tw`p-1`}>
                        <Ionicons
                            name={isSecure ? "eye-outline" : "eye-off-outline"}
                            size={22}
                            color={tw.color('zinc-400')}
                        />
                    </TouchableOpacity>
                </View>
            )}
        />
        {error && <Text style={tw`text-red-500 text-xs mt-1 ml-1`}>{error}</Text>}
    </View>
);

export default LandloardPasswordChange;