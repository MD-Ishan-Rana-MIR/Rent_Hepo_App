import { errorMsg } from '@/lib/errorMsg';
import tw from '@/lib/tailwind';
import { imageUrlTwo } from '@/lib/url';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useFindPropertyByAiMutation } from '../redux/api/aiApi';

type Property = {
  currency_symbol: string;
  currency: string;
  id: number;
  title: string;
  location: string;
  price: string;
  property_images: { path: string; name: string }[];
};

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  properties?: Property[];
};

const AIAssistantPage = () => {
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // RTK Query Mutation Hook
  const [findPropertyByAi, { isLoading: isTyping }] = useFindPropertyByAiMutation();

  const handleSend = async () => {
    const trimmedText = inputText.trim();
    if (trimmedText.length === 0 || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: trimmedText,
      sender: 'user',
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    try {
      const response = await findPropertyByAi(trimmedText).unwrap();
      if (response.status) {
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: response.reply,
          properties: response.properties,
        };
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (error) {
      return errorMsg(error);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timeout);
  }, [messages, isTyping]);

  return (
    <View style={tw`flex-1 px-5 bg-white`}>
      <StatusBar barStyle="dark-content" />

      {/* Header: Designed for a Page */}

      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={80}
        keyboardShouldPersistTaps="handled"
        style={tw`flex-1`}
        contentContainerStyle={tw`flex-grow`}
      >
        <View>
          <Text style={tw` text-textLg text-[#0F172A] font-semibold `} >AI Assistant</Text>
        </View>

        {/* Chat History */}
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={tw`px-5 pt-6 pb-10`}
        >
          {/* Welcome Message */}
          {messages.length === 0 && (
            <View style={tw`items-center my-10 px-10`}>
              <View style={tw`bg-blue-50 p-4 rounded-full mb-4`}>
                <Ionicons name="sparkles" size={32} color="#0474DA" />
              </View>

            </View>
          )}

          {messages.map((item) => (
            <View key={item.id} style={tw`mb-6`}>
              {item.sender === 'user' ? (
                <View style={tw`bg-[#0474DA] self-end p-4 rounded-2xl rounded-tr-none max-w-[85%]`}>
                  <Text style={tw`text-white leading-5 font-medium`}>{item.text}</Text>
                </View>
              ) : (
                <View style={tw`bg-[#F8FAFC] p-5 rounded-3xl border border-zinc-100`}>
                  <View style={tw`flex-row items-center mb-3`}>
                    <View style={tw`bg-blue-600 w-6 h-6 rounded-lg items-center justify-center mr-2`}>
                      <Ionicons name="flash" size={14} color="white" />
                    </View>
                    <Text style={tw`text-[#1E293B] font-bold text-sm`}>AI Suggestion</Text>
                  </View>

                  <Text style={tw`text-[#475569] leading-5 mb-2`}>{item.text}</Text>

                  {item.properties?.map((prop) => (
                    <View key={prop.id} style={tw`mt-4 pt-4 border-t border-zinc-200`}>
                      <View style={tw`flex-row justify-between mb-3`}>
                        <View style={tw`flex-1 mr-2`}>
                          <Text style={tw`text-black font-extrabold text-sm`}>{prop.title}</Text>
                          <View style={tw`flex-row items-center mt-1`}>
                            <Ionicons name="location-outline" size={12} color="#94A3B8" />
                            <Text style={tw`text-zinc-500 text-[10px] ml-1`}>{prop.location}</Text>
                          </View>
                        </View>
                        <Text style={tw`text-[#0474DA] font-bold text-sm`}>{prop.currency_symbol} {prop.price}</Text>
                      </View>

                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`flex-row mb-4`}>
                        {prop.property_images.map((img, idx) => (
                          <Image
                            key={idx}
                            source={{ uri: `${imageUrlTwo}${img.path}` }}
                            style={tw`w-40 h-24 rounded-xl mr-3 bg-zinc-200`}
                          />
                        ))}
                      </ScrollView>

                      <TouchableOpacity
                        onPress={() => {
                          router.navigate({
                            pathname: '/(tenant-tab)/details/[id]',
                            params: { id: prop.id }
                          });
                        }}
                        style={tw`bg-[#0474DA] w-full py-3 rounded-xl shadow-sm active:opacity-90`}
                      >
                        <Text style={tw`text-white text-center font-bold text-xs`}>View Details</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}

          {isTyping && (
            <View style={tw`flex-row items-center mb-6`}>
              <View style={tw`bg-zinc-100 px-4 py-3 rounded-2xl rounded-tl-none`}>
                <ActivityIndicator size="small" color="#0474DA" />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={tw` py-4 bg-white border-t border-zinc-100`}>
          <View style={tw`flex-row items-center`}>
            <TextInput
              style={tw`flex-1 bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 mr-3 text-black text-sm`}
              placeholder="Type your message..."
              placeholderTextColor="#94A3B8"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
              editable={!isTyping}
              multiline={false}
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={inputText.trim().length === 0 || isTyping}
              style={tw`w-14 h-14 rounded-2xl items-center justify-center ${inputText.trim().length > 0 && !isTyping ? 'bg-[#0474DA]' : 'bg-zinc-200'
                }`}
            >
              <Ionicons name="send" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>

    </View>
  );
};

export default AIAssistantPage;