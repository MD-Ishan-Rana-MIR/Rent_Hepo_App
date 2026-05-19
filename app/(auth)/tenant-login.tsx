import tw from '@/lib/tailwind';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    ActivityIndicator,
    Platform,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import * as yup from 'yup';
import { useTanentLoginMutation } from '../redux/api/authApi';

const schema = yup.object().shape({
    email: yup.string().required('Email is required').email('Invalid email address'),
    password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});



const TenantLogin = () => {
    const [tanentLogin, { isLoading }] = useTanentLoginMutation();
    const [showPassword, setShowPassword] = useState(false);

    // এরর স্টেট

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { email: '', password: '' }
    });

    const onSubmit = async (data: any) => {
        try {
            const res = await tanentLogin(data).unwrap();
            if (res) {
                await AsyncStorage.setItem("token", res?.data?.token);
                reset();
                Toast.show({
                    type: 'success',
                    text1: res?.message,
                    position: 'top',
                    visibilityTime: 3000,
                });
                return router.push("/(tenant-tab)");
            }
        } catch (error: any) {
            const errorMsg = error?.data?.message || error?.error || "Something went wrong. Please try again.";
            Toast.show({
                type: 'error',
                text2: errorMsg,
                position: 'top',
                topOffset: 60,
                visibilityTime: 3000,
            });
        }
    };


    return (
        <View style={tw`flex-1 bg-blackBg`}>
            <StatusBar barStyle="dark-content" />



            <KeyboardAwareScrollView
                enableOnAndroid={true}
                extraScrollHeight={Platform.OS === 'ios' ? 50 : 100}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={tw`flex-grow px-4 pb-8`}
                showsVerticalScrollIndicator={false}
            >
                {/* Back Button */}
                <View style={tw`mb-6`}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={28} color={tw.color('primaryText')} />
                    </TouchableOpacity>
                </View>

                {/* Main Content */}
                <View style={tw`flex-1 justify-center`}>
                    <View style={tw`mb-8`}>
                        <Text style={tw`text-primaryText text-3xl font-bold mb-2`}>Tenant Login</Text>
                        <Text style={tw`text-primaryText/60 text-base`}>Sign in to manage your lease</Text>
                    </View>

                    <View style={tw`gap-y-5`}>
                        {/* Email Input */}
                        <View>
                            <Text style={tw`text-primaryText mb-2 font-medium text-sm`}>Email Address</Text>
                            <Controller
                                control={control}
                                name="email"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={tw`flex-row items-center border ${errors.email ? 'border-red-500' : 'border-primaryBorder'} rounded-2xl px-4 h-15 bg-blackBg shadow-sm`}>
                                        <MaterialCommunityIcons name="email-outline" size={20} color={tw.color('primaryText')} style={tw`mr-3`} />
                                        <TextInput
                                            placeholder="Enter your email"
                                            placeholderTextColor="#555"
                                            style={tw`flex-1 text-primaryText`}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            editable={!isLoading}
                                        />
                                    </View>
                                )}
                            />
                            {errors.email && <Text style={tw`text-red-500 text-xs mt-1 ml-2`}>{errors.email.message}</Text>}
                        </View>

                        {/* Password Input */}
                        <View>
                            <Text style={tw`text-primaryText mb-2 font-medium text-sm`}>Password</Text>
                            <Controller
                                control={control}
                                name="password"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={tw`flex-row items-center border ${errors.password ? 'border-red-500' : 'border-primaryBorder'} rounded-2xl px-4 h-15 bg-blackBg shadow-sm`}>
                                        <MaterialCommunityIcons name="lock-outline" size={20} color={tw.color('primaryText')} style={tw`mr-3`} />
                                        <TextInput
                                            placeholder="••••••••"
                                            placeholderTextColor="#555"
                                            style={tw`flex-1 text-primaryText`}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            secureTextEntry={!showPassword}
                                            editable={!isLoading}
                                        />
                                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={tw`p-2`}>
                                            <Ionicons
                                                name={showPassword ? "eye-outline" : "eye-off-outline"}
                                                size={20}
                                                color={tw.color('primaryText')}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                            {errors.password && <Text style={tw`text-red-500 text-xs mt-1 ml-2`}>{errors.password.message}</Text>}
                        </View>

                        <TouchableOpacity onPress={() => router.push("/(auth)/email-verify")} style={tw`self-end`}>
                            <Text style={tw`text-optinalColor/60 font-medium text-sm`}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleSubmit(onSubmit)}
                            disabled={isLoading}
                            style={tw`bg-btnColor h-15 rounded-2xl items-center justify-center mt-2 ${isLoading ? 'opacity-70' : ''}`}
                        >
                            {isLoading ? (
                                <View style={tw`flex-row items-center`}>
                                    <ActivityIndicator size="small" color={tw.color('secondery')} />
                                    {/* <Text style={tw`text-secondery text-lg font-bold ml-2`}>Processing...</Text> */}
                                </View>
                            ) : (
                                <Text style={tw`text-secondery text-lg font-bold`}>Login</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Register Link */}
                <View style={tw`flex-row justify-center mt-8`}>
                    <Text style={tw`text-optinalColor/60`}>Don{"'"}t have an account? </Text>
                    <TouchableOpacity onPress={() => router.push("/(auth)/tanent-register")}>
                        <Text style={tw`text-primaryText font-bold`}>Register</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
};

export default TenantLogin;

