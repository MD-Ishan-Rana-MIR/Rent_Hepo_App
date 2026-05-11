import tw from '@/lib/tailwind';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

// Define the Props interface for clarity
interface RequestSentAlertProps {
    visible: boolean;
    onClose: () => void;
    propertyTitle: string;
    visitTime: string; // e.g., "Apr 27, 10:00 AM"
}

const RequestSentAlert: React.FC<RequestSentAlertProps> = ({
    visible,
    onClose,
    propertyTitle,
    visitTime
}) => {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={tw`flex-1 justify-center items-center bg-black/50 px-5`}>
                <View style={tw`bg-white w-full p-8 rounded-3xl items-center`}>

                    {/* Blue Checkmark Circle */}
                    <View style={tw`w-20 h-20 bg-[#0474DA] rounded-full items-center justify-center mb-6`}>
                        <MaterialCommunityIcons name="check" size={48} color="white" />
                    </View>

                    {/* Success Header */}
                    <Text style={tw`text-2xl font-bold text-black mb-3`}>
                        Request Sent!
                    </Text>

                    {/* Main Description */}
                    <Text style={tw`text-zinc-500 text-center text-sm leading-5 mb-8 px-2`}>
                        The landlord has been notified. You will receive a confirmation via WhatsApp shortly.
                    </Text>

                    {/* Blue Info Box for Visit Details */}
                    <View style={tw`bg-[#EFF6FF] w-full p-5 rounded-2xl mb-8`}>
                        <Text style={tw`text-[#0474DA] text-xs font-bold mb-1.5`}>
                            VISIT DETAILS
                        </Text>
                        <Text style={tw`text-black text-sm`}>
                            {propertyTitle} • {visitTime}
                        </Text>
                    </View>

                    {/* Close Button */}
                    <TouchableOpacity
                        onPress={onClose}
                        style={tw`border border-[#0474DA] w-full py-4 rounded-xl shadow-sm`}
                    >
                        <Text style={tw`text-[#0474DA] text-center font-bold`}>
                            Close
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
};

export default RequestSentAlert;