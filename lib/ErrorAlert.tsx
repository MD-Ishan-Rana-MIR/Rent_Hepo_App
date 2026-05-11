import tw from '@/lib/tailwind';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

interface TopErrorAlertProps {
  message: string;
  visible: boolean;
  onHide: () => void;
}

const TopErrorAlert: React.FC<TopErrorAlertProps> = ({ message, visible, onHide }) => {
  const slideAnim = useRef(new Animated.Value(-100)).current; // স্ক্রিনের বাইরে থেকে শুরু হবে

  useEffect(() => {
    if (visible) {
      // স্লাইড ইন এনিমেশন
      Animated.spring(slideAnim, {
        toValue: 50, // স্ট্যাটাস বারের নিচে পজিশন
        useNativeDriver: true,
        bounciness: 10,
      }).start();

      // ৪ সেকেন্ড পর অটো হাইড
      const timer = setTimeout(() => {
        hideAlert();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [visible, slideAnim]);

  const hideAlert = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onHide());
  };

  if (!visible && slideAnim === new Animated.Value(-100)) return null;

  return (
    <Animated.View
      style={[
        tw`absolute left-0 right-0 items-center z-50`,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={tw` bg-[#0474DA] flex-row items-center px-4 py-5 rounded-2xl  w-11/12 `}>
        <MaterialCommunityIcons name="alert-circle-outline" size={22} color="white" />
        <Text style={tw`text-white ml-2 font-semibold text-sm flex-1`} numberOfLines={2}>
          {message}
        </Text>
        <MaterialCommunityIcons
          name="close"
          size={18}
          color="white"
          onPress={hideAlert}
          style={tw`ml-2`}
        />
      </View>
    </Animated.View>
  );
};

export default TopErrorAlert;