import { errorMsg } from '@/lib/errorMsg';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import tw from '@/lib/tailwind';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
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

import { successMsg } from '@/lib/successMsg';
import Button from '../components/Button';
import { useForgetPasswordMutation } from '../redux/api/authApi';

// ভ্যালিডেশন স্কিমা তৈরি
const schema = yup.object().shape({
    email: yup.string().required('Email is required').email('Invalid email address'),
});

// টাইপ ডিফাইন করা

type ForgotPasswordFormValues = {
    email: string;
};

const ForgotPassword = () => {
    // React Hook Form কনফিগারেশন
    const { control, handleSubmit, reset, formState: { errors } } = useForm<ForgotPasswordFormValues>({
        resolver: yupResolver(schema),
        defaultValues: { email: '', }
    });

    const [forgetPassword, { isLoading }] = useForgetPasswordMutation();

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        try {
            const res = await forgetPassword(data).unwrap();
            if (res) {

                if (res) {
                    router.push({
                        pathname: "/otp-verify",
                        params: { email: data.email }
                    });
                    reset();
                    return successMsg(res?.message)
                }
            }
        } catch (error: any) {
            return errorMsg(error?.data?.message);
        }
    };

    return (
        <View style={tw`flex-1 bg-blackBg px-4`}>
            <StatusBar barStyle="dark-content" />

            <View style={tw`mb-6`}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={28} color={tw.color('primaryText')} />
                </TouchableOpacity>
            </View>

            <KeyboardAwareScrollView
                enableOnAndroid
                extraScrollHeight={80}
                keyboardShouldPersistTaps="handled"
                style={tw`flex-1`}
                contentContainerStyle={tw`flex-grow`}
            >
                <ScrollView
                    contentContainerStyle={tw`flex-grow justify-center`}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={tw`px-3 rounded-[32px] w-full`}>

                        <View style={tw`items-center mb-8`}>
                            <View style={tw`w-20 h-20 rounded-full items-center justify-center mb-4`}>
                                <MaterialCommunityIcons name="lock-reset" size={40} color={tw.color('primaryText')} />
                            </View>
                            <Text style={tw`text-primaryText text-2xl font-montserrat-700 text-center`}>Forgot Password?</Text>
                            <Text style={tw`text-zinc-500 text-base text-center mt-2 leading-5`}>
                                Enter your email address and we’ll send you a link to reset your password
                            </Text>
                        </View>

                        {/* --- INPUT SECTION --- */}
                        <View style={tw`gap-y-6`}>
                            <View>
                                <Text style={tw`text-primaryText mb-2 font-montserrat-600 text-sm ml-1`}>Email Address</Text>

                                {/* Controller ব্যবহার করে TextInput কানেক্ট করা */}
                                <Controller
                                    control={control}
                                    name="email"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <View style={tw`flex-row items-center border ${errors.email ? 'border-red-500' : 'border-primaryBorder'} rounded-2xl px-4 h-15 bg-white`}>
                                            <MaterialCommunityIcons name="email-outline" size={20} color={tw.color('primaryText')} style={tw`mr-3`} />
                                            <TextInput
                                                placeholder="Enter your email"
                                                placeholderTextColor="#999"
                                                style={tw`flex-1 text-black font-montserrat-500`}
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                            />
                                        </View>
                                    )}
                                />
                                {errors.email && (
                                    <Text style={tw`text-red-500 text-xs mt-1 ml-1`}>{errors.email.message}</Text>
                                )}
                            </View>

                            {/* handleSubmit(onSubmit) ব্যবহার করা হয়েছে */}
                            <Button
                                text={"Submit"}
                                handleContinueToDetails={handleSubmit(onSubmit)}
                                color={"#0474DA"}
                                width={"full"}
                                font={"bold"}
                                paddingTopBottom={16}
                                rounded={"xl"}
                                isLoading={isLoading}
                                textSize={"14px"}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={tw`mt-8 flex-row justify-center items-center`}
                        >
                            <Text style={tw`text-zinc-500 font-montserrat-500`}>Remember password? </Text>
                            <Text style={tw`text-primaryText font-montserrat-700`}>Log In</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAwareScrollView>
        </View>
    );
};

export default ForgotPassword;