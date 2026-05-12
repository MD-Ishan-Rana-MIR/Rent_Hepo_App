import tw from '@/lib/tailwind';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Linking, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

const HelpAndSupport = () => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "How do I book a property?",
            answer: "Browse the properties on the home screen, select one, and click 'Book Now'. The landlord will then review your request."
        },
        {
            question: "How can I contact a landlord?",
            answer: "Once your booking is accepted, you can find the landlord's contact details in the 'Booking Details' section."
        },
        {
            question: "Is my payment information secure?",
            answer: "Yes, we use industry-standard encryption to ensure your payment details are always safe and never stored on our servers."
        }
    ];

    const contactMethods = [
        
        {
            icon: 'whatsapp',
            label: 'WhatsApp',
            color: '#25D366',
            onPress: () => Linking.openURL('whatsapp://send?phone=+17809946760')
        },
        {
            icon: 'email-outline',
            label: 'Email Support',
            color: '#EF4444',
            onPress: () => Linking.openURL('mailto:info@chapplus.com')
        }
    ];

    return (
        <View style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />

            {/* --- HEADER --- */}
            <View style={tw`flex-row items-center px-4 `}>
                <TouchableOpacity onPress={() => router.back()} style={tw`p-2 rounded-full bg-zinc-50`}>
                    <Ionicons name="arrow-back" size={24} color="#0474DA" />
                </TouchableOpacity>
                <Text style={tw`flex-1 text-center text-xl font-bold text-[#1E293B] mr-10`}>Help & Support</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`p-5 pb-10`}>

                {/* --- CONTACT CARDS --- */}
                <Text style={tw`text-lg font-bold text-[#1E293B] mb-4`}>Contact Us</Text>
                <View style={tw`flex-row justify-between mb-8`}>
                    {contactMethods.map((method, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={method.onPress}
                            style={tw`items-center bg-zinc-50 p-4 rounded-3xl w-[30%] border border-zinc-100`}
                        >
                            <MaterialCommunityIcons name={method.icon as any} size={28} color={method.color} />
                            <Text style={tw`text-[10px] font-bold text-zinc-600 mt-2 text-center`}>{method.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* --- FAQs SECTION --- */}
                <Text style={tw`text-lg font-bold text-[#1E293B] mb-4`}>Frequently Asked Questions</Text>
                {faqs.map((faq, index) => (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.8}
                        onPress={() => setExpandedIndex(expandedIndex === index ? null : index)}
                        style={tw`mb-4 p-4 rounded-2xl border ${expandedIndex === index ? 'border-blue-200 bg-blue-50/30' : 'border-zinc-100 bg-white'}`}
                    >
                        <View style={tw`flex-row justify-between items-center`}>
                            <Text style={tw`flex-1 font-bold text-zinc-700 pr-4`}>{faq.question}</Text>
                            <Ionicons
                                name={expandedIndex === index ? "chevron-up" : "chevron-down"}
                                size={20}
                                color="#94A3B8"
                            />
                        </View>
                        {expandedIndex === index && (
                            <Text style={tw`mt-3 text-zinc-500 leading-5 text-sm`}>{faq.answer}</Text>
                        )}
                    </TouchableOpacity>
                ))}

                {/* --- FOOTER INFO --- */}
                <View style={tw`mt-8 p-5 bg-blueBg rounded-3xl items-center`}>
                    <MaterialCommunityIcons name="clock-outline" size={24} color="#FFFFFF" />
                    <Text style={tw`text-white font-bold mt-2`}>Support Hours</Text>
                    <Text style={tw`text-white mt-1 text-center`}>
                        Monday - Friday: 9:00 AM - 6:00 PM{"\n"}Saturday - Sunday: Closed
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

export default HelpAndSupport;