import { errorMsg } from '@/lib/errorMsg';
import { successMsg } from '@/lib/successMsg';
import tw from '@/lib/tailwind';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
import * as z from 'zod';
import { useLandLoardRegistrationMutation } from '../redux/api/authApi';

// --- VALIDATION SCHEMA ---
const registerSchema = z.object({
  name: z.string().min(2, 'Name is too short').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone_number: z.string().min(6, 'Phone number must be at least 6 digits'),
  password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const LandLoadRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [landLoardRegistration, { isLoading }] = useLandLoardRegistrationMutation();


  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      phone_number: ''
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const payload = {
      ...data,
      role: "LANDLORD"
    }
    try {
      const res = await landLoardRegistration(payload).unwrap();
      if (res) {
        reset()
        router.push({
          pathname: "/(auth)/otp-verify",
          params: { email: data.email, pageName: "register" }
        });
        return successMsg(res?.message)
      }
    } catch (error: any) {
      return errorMsg(error?.data?.message)
    }
  };

  return (
    <View style={tw`flex-1 bg-blackBg px-4`}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={80}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}

        style={tw`flex-1`}
        contentContainerStyle={tw`flex-grow`}
      >
        <ScrollView
          contentContainerStyle={tw`flex-grow`}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* --- HEADER --- */}
          <View style={tw``}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={28} color={tw.color('primaryText')} />
            </TouchableOpacity>
          </View>

          <View style={tw`flex-1 justify-center py-6`}>
            <View style={tw`mb-8`}>
              <Text style={tw`text-primaryText text-3xl font-bold mb-2`}>Create Account</Text>
              <Text style={tw`text-primaryText/60 text-base`}>Join as a Property Owner</Text>
            </View>

            {/* --- FORM SECTION --- */}
            <View style={tw`gap-y-4`}>

              {/* Full Name Input */}
              <View>
                <Text style={tw`text-primaryText mb-2 font-medium text-sm`}>Full Name</Text>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={tw`flex-row items-center border ${errors.name ? 'border-red-500' : 'border-primaryBorder'} rounded-2xl px-4 h-15 bg-blackBg`}>
                      <MaterialCommunityIcons name="account-outline" size={20} color={tw.color('primaryText')} style={tw`mr-3`} />
                      <TextInput
                        placeholder="Enter name"
                        placeholderTextColor="#555"
                        style={tw`flex-1 text-primaryText`}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    </View>
                  )}
                />
                {errors.name && <Text style={tw`text-red-500 text-xs mt-1 ml-1`}>{errors.name.message}</Text>}
              </View>

              {/* Email Input */}
              <View>
                <Text style={tw`text-primaryText mb-2 font-medium text-sm`}>Email Address</Text>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={tw`flex-row items-center border ${errors.email ? 'border-red-500' : 'border-primaryBorder'} rounded-2xl px-4 h-15 bg-blackBg`}>
                      <MaterialCommunityIcons name="email-outline" size={20} color={tw.color('primaryText')} style={tw`mr-3`} />
                      <TextInput
                        placeholder="Enter email address"
                        placeholderTextColor="#555"
                        style={tw`flex-1 text-primaryText`}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    </View>
                  )}
                />
                {errors.email && <Text style={tw`text-red-500 text-xs mt-1 ml-1`}>{errors.email.message}</Text>}
              </View>

              {/* Phone number */}
              <View>
                <Text style={tw`text-primaryText mb-2 font-medium text-sm`}>Phone Number</Text>
                <Controller
                  control={control}
                  name="phone_number"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={tw`flex-row items-center border ${errors.phone_number ? 'border-red-500' : 'border-primaryBorder'} rounded-2xl px-4 h-15 bg-blackBg`}>
                      <MaterialCommunityIcons name="phone" size={20} color={tw.color('primaryText')} style={tw`mr-3`} />
                      <TextInput
                        placeholder="Enter phone number"
                        placeholderTextColor="#555"
                        style={tw`flex-1 text-primaryText`}
                        keyboardType="numeric"
                        autoCapitalize="none"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    </View>
                  )}
                />
                {errors.phone_number && <Text style={tw`text-red-500 text-xs mt-1 ml-1`}>{errors.phone_number.message}</Text>}
              </View>













              {/* Password Input */}
              <View>
                <Text style={tw`text-primaryText mb-2 font-medium text-sm`}>Password</Text>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={tw`flex-row items-center border ${errors.password ? 'border-red-500' : 'border-primaryBorder'} rounded-2xl px-4 h-15 bg-blackBg`}>
                      <MaterialCommunityIcons name="shield-lock-outline" size={20} color={tw.color('primaryText')} style={tw`mr-3`} />
                      <TextInput
                        placeholder="••••••••"
                        placeholderTextColor="#555"
                        style={tw`flex-1 text-primaryText`}
                        secureTextEntry={!showPassword}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
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
                {errors.password && <Text style={tw`text-red-500 text-xs mt-1 ml-1`}>{errors.password.message}</Text>}
              </View>

              {/* Confirm Password Input */}
              <View>
                <Text style={tw`text-primaryText mb-2 font-medium text-sm`}>Confirm Password</Text>
                <Controller
                  control={control}
                  name="password_confirmation"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={tw`flex-row items-center border ${errors.password_confirmation ? 'border-red-500' : 'border-primaryBorder'} rounded-2xl px-4 h-15 bg-blackBg`}>
                      <MaterialCommunityIcons name="shield-check-outline" size={20} color={tw.color('primaryText')} style={tw`mr-3`} />
                      <TextInput
                        placeholder="••••••••"
                        placeholderTextColor="#555"
                        style={tw`flex-1 text-primaryText`}
                        secureTextEntry={!showConfirmPassword}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                      <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={tw`p-2`}>
                        <Ionicons
                          name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                          size={20}
                          color={tw.color('primaryText')}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                />
                {errors.password_confirmation && <Text style={tw`text-red-500 text-xs mt-1 ml-1`}>{errors.password_confirmation.message}</Text>}
              </View>

              {/* Register Button */}
              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                activeOpacity={0.8}
                style={tw` bg-btnColor h-15 rounded-2xl items-center justify-center mt-4 shadow-sm`}
              >
                {isLoading ? (
                  <View style={tw`flex-row items-center`}>
                    <ActivityIndicator size="small" color={tw.color('secondery')} />
                    {/* <Text style={tw`text-secondery text-lg font-bold ml-2`}>Processing...</Text> */}
                  </View>
                ) : (
                  <Text style={tw`text-secondery text-lg font-bold`}>Registration</Text>
                )}
              </TouchableOpacity>

            </View>
          </View>

          {/* --- FOOTER --- */}
          <View style={tw`flex-row justify-center mt-8 pb-10`}>
            <Text style={tw`text-optinalColor/60`}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/property-owner-login")}>
              <Text style={tw`text-primaryText font-bold`}>Log In</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAwareScrollView>


    </View>
  );
};

export default LandLoadRegister;