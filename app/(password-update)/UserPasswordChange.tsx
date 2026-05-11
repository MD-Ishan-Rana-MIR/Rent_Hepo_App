import tw from '@/lib/tailwind';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
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
import Toast from 'react-native-toast-message';
import { useUpdatePasswordMutation, useUserProfileQuery } from '../redux/api/authApi';

// 1. MOVE THIS OUTSIDE THE MAIN COMPONENT
const PasswordInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    isSecure,
    toggleSecure
}: any) => (
    <View>
        <Text style={tw`text-base font-montserrat-600 text-black mb-2`}>{label}</Text>
        <View style={tw`h-14 border border-zinc-200 rounded-xl px-4 flex-row items-center bg-white`}>
            <TextInput
                placeholder={placeholder}
                secureTextEntry={!isSecure}
                style={tw`flex-1 text-bodyText font-montserrat-400 text-base`}
                value={value}
                onChangeText={onChangeText}
                autoCapitalize="none"
            />
            <TouchableOpacity onPress={toggleSecure} style={tw`ml-2`}>
                <Ionicons
                    name={isSecure ? "eye-outline" : "eye-off-outline"}
                    size={22}
                    color={tw.color('zinc-400')}
                />
            </TouchableOpacity>
        </View>
    </View>
);

const UserPasswordChange = () => {
    // --- Form States ---
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // --- Visibility States ---
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // --- API Hooks ---
    const { data: profileData } = useUserProfileQuery({});
    const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

    const handleUpdatePassword = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }
        if (newPassword.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters long');
            return;
        }

        Alert.alert(
            "Change Password",
            "Are you sure you want to update your password?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "OK",
                    onPress: async () => {
                        try {
                            const payload = {
                                current_password: currentPassword,
                                password: newPassword,
                                password_confirmation: confirmPassword
                            };
                            const res = await updatePassword(payload).unwrap();
                            if (res) {
                                Toast.show({
                                    type: 'success',
                                    text1: res?.message || 'Password changed successfully',
                                });
                                setCurrentPassword('');
                                setNewPassword('');
                                setConfirmPassword('');
                                router.back();
                            }
                        } catch (error: any) {
                            Toast.show({
                                type: 'error',
                                text1: 'Update failed',
                                text2: error?.data?.message || 'Current password might be incorrect',
                            });
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />
            <KeyboardAwareScrollView
                enableOnAndroid
                extraScrollHeight={100} // Increased for better clearance
                keyboardShouldPersistTaps="handled"
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={tw`px-6 pb-10`}
                    keyboardShouldPersistTaps="handled" // Important for nested ScrollViews
                >
                    {/* HEADER */}
                    <View style={tw`flex-row items-center justify-center relative `}>
                        <TouchableOpacity onPress={() => router.back()} style={tw`absolute -left-1`}>
                            <Ionicons name="arrow-back" size={28} color={tw.color('primaryText')} />
                        </TouchableOpacity>
                        <Text style={tw`text-xl font-montserrat-600 text-bodyText`}>Change Password</Text>
                    </View>

                    {/* USER PROFILE SUMMARY */}
                    <View style={tw`items-center mt-8 mb-6`}>
                        <View style={tw`w-24 h-24 rounded-full border-2 border-primaryText p-1`}>
                            <Image
                                source={{ uri: profileData?.data?.user?.avatar_url || 'https://via.placeholder.com/150' }}
                                style={tw`w-full h-full rounded-full`}
                            />
                        </View>
                        <Text style={tw`text-xl font-montserrat-700 text-bodyText mt-4`}>
                            {profileData?.data?.user?.name}
                        </Text>
                        <Text style={tw`text-sm font-montserrat-400 text-zinc-500`}>
                            {profileData?.data?.user?.email}
                        </Text>
                    </View>

                    <View style={tw`h-px bg-zinc-100 w-full mb-6`} />

                    {/* FORM SECTION */}
                    <View style={tw`gap-y-5`}>
                        <PasswordInput
                            label="Current Password"
                            placeholder="Enter current password"
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            isSecure={showCurrent}
                            toggleSecure={() => setShowCurrent(!showCurrent)}
                        />

                        <PasswordInput
                            label="New Password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            isSecure={showNew}
                            toggleSecure={() => setShowNew(!showNew)}
                        />

                        <PasswordInput
                            label="Confirm New Password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            isSecure={showConfirm}
                            toggleSecure={() => setShowConfirm(!showConfirm)}
                        />

                        <TouchableOpacity
                            activeOpacity={0.8}
                            disabled={isLoading}
                            style={tw`${isLoading ? 'bg-btnColor' : 'bg-btnColor'} h-14 rounded-xl items-center justify-center mt-6 shadow-sm`}
                            onPress={handleUpdatePassword}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <Text style={tw`text-white text-lg font-bold`}>Save Changes</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAwareScrollView>
        </View>
    );
};

export default UserPasswordChange;