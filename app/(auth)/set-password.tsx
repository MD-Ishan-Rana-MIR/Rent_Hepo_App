import { successMsg } from '@/lib/successMsg';
import tw from '@/lib/tailwind';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';
import Button from '../components/Button';
import { usePasswordChangeMutation } from '../redux/api/authApi';
import { errorMsg } from './../../lib/errorMsg';

// Form interface
interface ResetPasswordState {
    password: string;
    password_confirmation: string;
}

const SetNewPassword = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    // Yup Schema
    const schema = yup.object().shape({
        password: yup.string()
            .required('Password is required')
            .max(20, 'Password cannot be more than 6 digits'),
        password_confirmation: yup.string()
            .required('Confirmed password is required')
            .max(20, 'Password cannot be more than 8 digits')
            .oneOf([yup.ref('password')], 'Passwords do not match'),
    });

    const { control, handleSubmit, reset, formState: { errors } } = useForm<ResetPasswordState>({
        resolver: yupResolver(schema),
        defaultValues: { password: '', password_confirmation: '' }
    });

    const [passwordChange, { isLoading }] = usePasswordChangeMutation();

    const handleUpdatePassword = async (data: ResetPasswordState) => {
        try {
            const res = await passwordChange(data).unwrap();
            if (res) {
                successMsg(res?.message || "Password changed successfully");
                await AsyncStorage.removeItem("forgetToken");
                reset();
                router.replace("/(auth)");
            }
        } catch (error: any) {
            errorMsg(error?.data?.message || "Something went wrong");
        }
    };

    return (
        <View style={tw`flex-1 bg-blackBg px-4`}>
            <StatusBar barStyle="dark-content" />

            <KeyboardAwareScrollView
                enableOnAndroid
                extraScrollHeight={80}
                keyboardShouldPersistTaps="handled"
                style={tw`flex-1`}
                contentContainerStyle={tw`flex-grow`}
            >
                <ScrollView
                    contentContainerStyle={tw`flex-grow`}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* --- HEADER --- */}
                    <View style={tw`pt-2`}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={28} color={tw.color('primaryText')} />
                        </TouchableOpacity>
                    </View>

                    {/* --- MAIN CARD --- */}
                    <View style={tw`flex-1 justify-center`}>
                        <View style={tw`p-4 px-3 rounded-[32px] w-full`}>

                            <View style={tw`items-center mb-8`}>
                                <View style={tw`w-20 h-20 bg-primaryBorder/10 rounded-full items-center justify-center mb-4`}>
                                    <MaterialCommunityIcons name="shield-key" size={40} color={tw.color('primaryText')} />
                                </View>
                                <Text style={tw`text-primaryText text-2xl font-montserrat-700 text-center`}>Set New Password</Text>
                                <Text style={tw`text-zinc-500 text-base text-center mt-2 font-montserrat-400`}>
                                    Your identity is verified. Now, create a secure new password.
                                </Text>
                            </View>

                            <View style={tw`gap-y-4`}>
                                {/* New Password Field */}
                                <View>
                                    <Text style={tw`text-primaryText mb-2 font-montserrat-600 text-sm ml-1`}>New Password</Text>
                                    <Controller
                                        control={control}
                                        name="password"
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <View style={tw`flex-row items-center border ${errors.password ? 'border-red-500' : 'border-primaryBorder'} rounded-2xl px-4 h-15 bg-white`}>
                                                <MaterialCommunityIcons name="lock-outline" size={20} color={tw.color('primaryText')} style={tw`mr-3`} />
                                                <TextInput
                                                    placeholder="••••••"
                                                    placeholderTextColor="#999"
                                                    secureTextEntry={!showPassword}
                                                    style={tw`flex-1 text-black font-montserrat-500`}
                                                    onBlur={onBlur}
                                                    onChangeText={onChange}
                                                    value={value}
                                                // maxLength={}
                                                />
                                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                                    <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#999" />
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    />
                                    {errors.password && <Text style={tw`text-red-500 text-xs mt-1 ml-1`}>{errors.password.message}</Text>}
                                </View>

                                {/* Confirm Password Field */}
                                <View>
                                    <Text style={tw`text-primaryText mb-2 font-montserrat-600 text-sm ml-1`}>Confirm Password</Text>
                                    <Controller
                                        control={control}
                                        name="password_confirmation"
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <View style={tw`flex-row items-center border ${errors.password_confirmation ? 'border-red-500' : 'border-primaryBorder'} rounded-2xl px-4 h-15 bg-white`}>
                                                <MaterialCommunityIcons name="lock-check-outline" size={20} color={tw.color('primaryText')} style={tw`mr-3`} />
                                                <TextInput
                                                    placeholder="••••••"
                                                    placeholderTextColor="#999"
                                                    secureTextEntry={!showConfirmPassword}
                                                    style={tw`flex-1 text-black font-montserrat-500`}
                                                    onBlur={onBlur}
                                                    onChangeText={onChange}
                                                    value={value}
                                                // maxLength=7{6}
                                                />
                                                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                    <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#999" />
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    />
                                    {errors.password_confirmation && <Text style={tw`text-red-500 text-xs mt-1 ml-1`}>{errors.password_confirmation.message}</Text>}
                                </View>

                                <Button
                                    text={"Verify Now"}
                                    handleContinueToDetails={handleSubmit(handleUpdatePassword)}
                                    color={"#0474DA"}
                                    width={"full"}
                                    font={"bold"}
                                    paddingTopBottom={16}
                                    rounded={"xl"}
                                    isLoading={isLoading}
                                    textSize={"14px"}
                                />
                            </View>
                        </View>

                        <View style={tw`mt-8 items-center px-6`}>
                            <Text style={tw`text-zinc-400 text-xs text-center font-montserrat-400`}>
                                Tip: Use a mix of letters, numbers, and symbols for a stronger password.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAwareScrollView>
        </View>
    );
};

export default SetNewPassword;