import { errorMsg } from '@/lib/errorMsg';
import { successMsg } from '@/lib/successMsg';
import tw from '@/lib/tailwind';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    NativeSyntheticEvent,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TextInputKeyPressEventData,
    TouchableOpacity,
    View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import Button from '../components/Button';
import { useForgetPasswordMutation, useOtpVerifyMutation } from '../redux/api/authApi';

const OTPVerify = () => {
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const otpLength = otp.length;
    const { email, pageName } = useLocalSearchParams();
    const inputs = useRef<TextInput[]>([]);


    // API Mutations
    const [otpVerify, { isLoading: isVerifying }] = useOtpVerifyMutation();
    const [forgetPassword, { isLoading: isResending }] = useForgetPasswordMutation();

    const handleChange = (text: string, index: number) => {
        const numericText = text.replace(/[^0-9]/g, '');
        const newOtp = [...otp];
        newOtp[index] = numericText.slice(-1);
        setOtp(newOtp);

        if (numericText && index < otpLength - 1) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const handleVerify = async () => {
        const fullCode = otp.join('');

        if (fullCode.length !== otpLength) {
            return errorMsg("Please enter the full 6-digit code");
        }

        try {
            const payload = {
                email: email as string,
                otp: fullCode
            };

            const res = await otpVerify(payload).unwrap();

            if (res && pageName === "register") {
                await AsyncStorage.setItem("land-loard-token", res?.data?.token);
                router.push("/(property-owner-tab)")
            } else if (res && pageName === "tanent-register") {
                await AsyncStorage.setItem("token", res?.data?.token);
                // reset();
                Toast.show({
                    type: 'success',
                    text1: res?.message,
                    position: 'top',
                    visibilityTime: 3000,
                });
                return router.push("/(tenant-tab)");
            }
            else {
                successMsg(res?.message || "OTP Verified Successfully");
                await AsyncStorage.setItem("f-token", res?.data?.token);
                router.push({
                    pathname: "/(auth)/set-password",
                    params: { email: email, token: res?.data?.token }
                });
            }
        } catch (error: any) {
            errorMsg(error?.data?.message || "Invalid OTP");
        }
    };

    const handleResendOtp = async () => {
        try {
            const res = await forgetPassword({ email }).unwrap();
            if (res) {
                successMsg(res?.message || "OTP resent to your email");
            }
        } catch (error: any) {
            errorMsg(error?.data?.message || "Failed to resend OTP");
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
                    <View style={tw``}>
                        <TouchableOpacity onPress={() => router.back()} style={tw`w-10 h-10 items-center  justify-center`}>
                            <Ionicons name="arrow-back" size={28} color={tw.color('primaryText')} />
                        </TouchableOpacity>
                    </View>

                    <View style={tw`flex-1 justify-center`}>
                        <View style={tw`p-4 px-3 rounded-[32px] w-full items-center`}>
                            <Text style={tw`text-primaryText text-2xl font-montserrat-700 text-center`}>
                                Verify OTP
                            </Text>
                            <Text style={tw`text-zinc-500 text-base text-center mt-2 font-montserrat-400 leading-5`}>
                                We&apos;ve sent a {otpLength}-digit verification code to your email address: {"\n"}
                                <Text style={tw`text-primaryText font-montserrat-600`}>{email}</Text>
                            </Text>

                            <View style={tw`flex-row justify-between w-full mt-10 mb-8`}>
                                {otp.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        ref={(el) => (inputs.current[index] = el as TextInput)}
                                        style={tw`w-12 h-14 border-2 rounded-xl text-center text-xl font-montserrat-700 bg-white ${digit ? 'border-btnColor text-primaryText' : 'border-primaryBorder/30 text-zinc-400'
                                            }`}
                                        maxLength={1}
                                        keyboardType="number-pad"
                                        onChangeText={(text) => handleChange(text, index)}
                                        onKeyPress={(e) => handleKeyPress(e, index)}
                                        value={digit}
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </View>

                            <Button
                                text={"Verify Now"}
                                handleContinueToDetails={handleVerify}
                                color={"#0474DA"}
                                width={"full"}
                                font={"bold"}
                                paddingTopBottom={16}
                                rounded={"xl"}
                                isLoading={isVerifying}
                                textSize={"14px"}
                            />

                            <View style={tw`flex-row mt-8 items-center`}>
                                <Text style={tw`text-zinc-500 font-montserrat-500`}>Didn&apos;t receive code? </Text>
                                <TouchableOpacity
                                    onPress={handleResendOtp}
                                    disabled={isResending}
                                >
                                    <Text style={tw`text-btnColor font-montserrat-700 underline ${isResending ? 'opacity-50' : ''}`}>
                                        {isResending ? 'Sending...' : 'Resend'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAwareScrollView>

        </View>
    );
};

export default OTPVerify;