import tw from '@/lib/tailwind';
import { imageUrlTwo } from '@/lib/url';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Modal,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFindPropertyByAiMutation } from '../redux/api/aiApi';

type Property = {
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

interface AiModalProps {
    openAiModal: boolean;
    setOpenAiModal: (val: boolean) => void;
}

const AiModal = ({ openAiModal, setOpenAiModal }: AiModalProps) => {
    const [inputText, setInputText] = useState('');
    const scrollViewRef = useRef<ScrollView>(null);
    const [messages, setMessages] = useState<Message[]>([]);

    // RTK Query Mutation Hook
    const [findPropertyByAi, { isLoading: isTyping }] = useFindPropertyByAiMutation();

    const handleSend = async () => {
        const trimmedText = inputText.trim();
        if (trimmedText.length === 0 || isTyping) return;

        // 1. Add User Message to UI
        const userMsg: Message = {
            id: Date.now().toString(),
            text: trimmedText,
            sender: 'user',
        };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');

        try {
            const response = await findPropertyByAi(trimmedText).unwrap();

            // 2. Add AI Response to UI
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
            console.error("AI Chat Error:", error);
        }
    };

    useEffect(() => {
        // Short delay to ensure content has rendered before scrolling
        const timeout = setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
        return () => clearTimeout(timeout);
    }, [messages, isTyping]);

    return (
        <Modal visible={openAiModal} transparent animationType="slide">
            <KeyboardAwareScrollView
                enableOnAndroid
                extraScrollHeight={80}
                keyboardShouldPersistTaps="handled"
                style={tw`flex-1`}
                contentContainerStyle={tw`flex-grow`}
            >
                <View style={tw`flex-1 bg-black/50`}>
                    {/* Backdrop closer */}
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => setOpenAiModal(false)}
                        style={tw`h-1/6`}
                    />

                    <SafeAreaView style={tw`flex-1 bg-white rounded-t-3xl overflow-hidden`}>
                        <StatusBar barStyle="dark-content" />


                        <View style={tw`flex-1 px-5 pt-4`}>
                            {/* Header */}
                            <View style={tw`flex-row justify-between items-center mb-4`}>
                                <Text style={tw`text-2xl font-bold text-[#1E293B]`}>AI Assistant</Text>
                                <TouchableOpacity onPress={() => setOpenAiModal(false)}>
                                    <Ionicons name="close-circle" size={28} color="#94A3B8" />
                                </TouchableOpacity>
                            </View>

                            {/* Chat History */}
                            <ScrollView
                                ref={scrollViewRef}
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                                contentContainerStyle={tw`pb-10`}
                            >
                                {messages.map((item) => (
                                    <View key={item.id} style={tw`mb-6`}>
                                        {item.sender === 'user' ? (
                                            <View style={tw`bg-[#F1F5F9] self-end p-4 rounded-2xl rounded-tr-none max-w-[85%]`}>
                                                <Text style={tw`text-[#475569] leading-5`}>{item.text}</Text>
                                            </View>
                                        ) : (
                                            <View style={tw`bg-[#EFF6FF] p-5 rounded-3xl border border-blue-50`}>
                                                <Text style={tw`text-[#1E293B] font-bold mb-2 leading-5`}>{item.text}</Text>

                                                {item.properties?.map((prop) => (
                                                    <View key={prop.id} style={tw`mt-4 pt-4 border-t border-blue-100`}>
                                                        <View style={tw`flex-row justify-between mb-3`}>
                                                            <View style={tw`flex-1 mr-2`}>
                                                                <Text style={tw`text-black font-extrabold text-sm`}>{prop.title}</Text>
                                                                <Text style={tw`text-zinc-500 text-[10px]`}>{prop.location}</Text>
                                                            </View>
                                                            <Text style={tw`text-[#0474DA] font-bold text-sm`}>${prop.price}</Text>
                                                        </View>

                                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`flex-row mb-4`}>
                                                            {prop.property_images.map((img, idx) => (
                                                                <Image
                                                                    key={idx}
                                                                    source={{ uri: `${imageUrlTwo}${img.path}` }}
                                                                    style={tw`w-32 h-20 rounded-xl mr-2 bg-zinc-200`}
                                                                />
                                                            ))}
                                                        </ScrollView>

                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setOpenAiModal(false);
                                                                router.navigate({
                                                                    pathname: '/(tenant-tab)/details/[id]',
                                                                    params: { id: prop.id }
                                                                });
                                                            }}
                                                            style={tw`bg-[#0474DA] w-full py-3 rounded-xl active:opacity-80`}
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
                                    <View style={tw`flex-row items-center ml-2`}>
                                        <ActivityIndicator size="small" color="#0474DA" />
                                        <Text style={tw`text-zinc-400 text-xs ml-2`}>AI is searching properties...</Text>
                                    </View>
                                )}
                            </ScrollView>

                            {/* Fixed Input Area (Not Absolute) */}
                            <View style={tw`flex-row items-center bg-white py-4 border-t border-zinc-100`}>
                                <TextInput
                                    style={tw`flex-1 bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 mr-3 text-black`}
                                    placeholder="Ask about properties"
                                    placeholderTextColor="#94A3B8"
                                    value={inputText}
                                    onChangeText={setInputText}
                                    onSubmitEditing={handleSend}
                                    editable={!isTyping}
                                />
                                <TouchableOpacity
                                    onPress={handleSend}
                                    disabled={inputText.trim().length === 0 || isTyping}
                                    style={tw`w-12 h-12 rounded-full items-center justify-center ${inputText.trim().length > 0 && !isTyping ? 'bg-[#0474DA]' : 'bg-zinc-300'}`}
                                >
                                    <Ionicons name="send" size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SafeAreaView>
                </View>
            </KeyboardAwareScrollView>

        </Modal>
    );
};

export default AiModal;