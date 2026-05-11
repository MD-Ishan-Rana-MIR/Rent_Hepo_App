import { errorMsg } from '@/lib/errorMsg';
import { successMsg } from '@/lib/successMsg';
import tw from '@/lib/tailwind';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form'; // Controller যোগ করা হয়েছে
import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';
import { useTanentLoginMutation } from '../redux/api/authApi';

const schema = yup.object().shape({
    email: yup.string().required('Email is required').email('Invalid email address'),
    password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

const ProPertyOwnerLogin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [tanentLogin, { isLoading }] = useTanentLoginMutation();

    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { email: '', password: '' }
    });

    const onSubmit = async (formData: any) => {
        try {
            const res = await tanentLogin(formData).unwrap();
            await AsyncStorage.setItem("land-loard-token", res?.data?.token);
            reset();
            router.push("/(property-owner-tab)")
            return successMsg(res?.message)
        } catch (error: any) {
            errorMsg(error?.data?.message);
        }
    };

    return (
        <View style={tw`bg-blackBg px-4 flex-1`}>
            <StatusBar barStyle="dark-content" />

            <View style={tw` z-50`}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={28} color={tw.color('primaryText')} />
                </TouchableOpacity>
            </View>

            <KeyboardAwareScrollView
                enableOnAndroid
                extraScrollHeight={80}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={tw`flex-grow`} 
            >
                <ScrollView
                    contentContainerStyle={tw`flex-grow justify-center`} 
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={tw`py-10`}>
                        <View style={tw`mb-8`}>
                            <Text style={tw`text-primaryText text-3xl font-bold mb-2`}>LandLord Login</Text>
                            <Text style={tw`text-primaryText/60 text-base`}>Access your property dashboard</Text>
                        </View>

                        <View style={tw`gap-y-5`}>
                            {/* Email Input */}
                            <View>
                                <Text style={tw`text-primaryText mb-2 font-medium text-sm`}>Email</Text>
                                <Controller
                                    control={control}
                                    name="email"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <View style={[
                                            tw`flex-row items-center border rounded-2xl px-4 h-15 bg-blackBg`,
                                            errors.email ? tw`border-red-500` : tw`border-primaryBorder`
                                        ]}>
                                            <MaterialCommunityIcons name="email" size={20} color={tw.color('primaryText')} style={tw`mr-3`} />
                                            <TextInput
                                                placeholder="Enter your email"
                                                placeholderTextColor="#555"
                                                style={tw`flex-1 text-primaryText`}
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                                keyboardType="email-address"
                                                autoCapitalize="none"
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
                                        <View style={[
                                            tw`flex-row items-center border rounded-2xl px-4 h-15 bg-blackBg`,
                                            errors.password ? tw`border-red-500` : tw`border-primaryBorder`
                                        ]}>
                                            <MaterialCommunityIcons name="shield-lock-outline" size={20} color={tw.color('primaryText')} style={tw`mr-3`} />
                                            <TextInput
                                                placeholder="••••••••"
                                                placeholderTextColor="#555"
                                                style={tw`flex-1 text-primaryText`}
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                                secureTextEntry={!showPassword}
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
                                style={tw`bg-btnColor h-15 rounded-2xl items-center justify-center mt-2 shadow-sm`}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={tw`text-secondery text-lg font-bold`}>Log In</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={tw`flex-row justify-center mt-8`}>
                            <Text style={tw`text-optinalColor/60`}>New owner? </Text>
                            <TouchableOpacity onPress={() => router.push("/(auth)/landloard-register")}>
                                <Text style={tw`text-primaryText font-bold`}>Create Account</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAwareScrollView>
        </View>
    );
};

export default ProPertyOwnerLogin;