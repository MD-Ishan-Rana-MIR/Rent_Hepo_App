import { errorMsg } from '@/lib/errorMsg';
import { successMsg } from '@/lib/successMsg';
import tw from '@/lib/tailwind';
import { formatDate, formatTime } from '@/lib/timeFormater';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Alert, Modal, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { usePropertyBookingMutation } from '../redux/api/tanentBookingApi';
import Button from './Button';

interface BookingModalProps {
    showTimeModal: boolean;
    id: number;
    onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ id, showTimeModal, onClose, singleProperty }) => {
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState<'date' | 'time'>('date');
    const [showPicker, setShowPicker] = useState(false);

    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const [name, setName] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');

    const onPickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShowPicker(Platform.OS === 'ios');
        setDate(currentDate);
    };



    const togglePicker = (currentMode: 'date' | 'time') => {
        setMode(currentMode);
        setShowPicker(true);
    };

    // Transition: Time -> Details
    const handleContinueToDetails = () => {
        onClose();
        setTimeout(() => setShowDetailsModal(true), 300);
    };
    const formattedDates = formatDate(date);
    const formattedTimes = formatTime(date);


    // ===============================// Booking api  ===============================


    const [propertyBooking, { isLoading }] = usePropertyBookingMutation()




    const handleRequestConfirmation = () => {
        if (!name || !phoneNumber) {
            return errorMsg("Please provide both name and phone number");
        }

        const payload = {
            property_id: id,
            name: name,
            phone_number: phoneNumber,
            booking_date: formattedDates,
            booking_time: formattedTimes
        };

        Alert.alert(
            "Booking Confirmation",
            "Are you sure you want to confirm this booking?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "OK",
                    onPress: async () => {
                        try {

                            const res = await propertyBooking(payload).unwrap();

                            if (res) {
                                setPhoneNumber("");
                                setName("");
                                setShowDetailsModal(false);
                                setTimeout(() => setShowSuccessModal(true), 300);
                                successMsg(res?.message || "Booking Successful!");
                            }
                        } catch (error: any) {
                            errorMsg(error?.data?.message || error?.message || "Something went wrong");
                        }
                    }
                }
            ]
        );
    };





    return (
        <>
            {/* MODAL 1: Select Visit Time */}
            <Modal visible={showTimeModal} transparent animationType="fade">
                <View style={tw`flex-1 justify-center items-center bg-black/50 px-5`}>
                    <View style={tw`bg-white w-full p-6 rounded-3xl`}>
                        <View style={tw`mb-5 flex-row items-center justify-between`}>
                            <Text style={tw`text-lg font-bold text-black`}>Select Visit Time</Text>
                            <TouchableOpacity onPress={onClose}>
                                <Ionicons name="close" size={24} color="black" />
                            </TouchableOpacity>
                        </View>

                        <View style={tw`flex-row gap-x-3 mb-6`}>
                            {/* Date Input */}
                            <View style={tw`flex-1`}>
                                <Text style={tw`text-sm font-bold text-black mb-2`}>Date</Text>
                                <TouchableOpacity
                                    onPress={() => togglePicker('date')}
                                    style={tw`flex-row items-center border border-zinc-200 rounded-xl px-3 py-3`}
                                >
                                    <Text style={tw`flex-1 text-zinc-500`}>{formattedDate}</Text>
                                    <Ionicons name="calendar-outline" size={20} color="black" />
                                </TouchableOpacity>
                            </View>

                            {/* Time Input */}
                            <View style={tw`flex-1`}>
                                <Text style={tw`text-sm font-bold text-black mb-2`}>Time</Text>
                                <TouchableOpacity
                                    onPress={() => togglePicker('time')}
                                    style={tw`flex-row items-center border border-zinc-200 rounded-xl px-3 py-3`}
                                >
                                    <Text style={tw`flex-1 text-zinc-500`}>{formattedTime}</Text>
                                    <Ionicons name="time-outline" size={20} color="black" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {showPicker && (
                            <DateTimePicker
                                value={date}
                                mode={mode}
                                is24Hour={false}
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={onPickerChange}
                            />
                        )}

                        <Button text={"Continue to Details"} handleContinueToDetails={handleContinueToDetails} color={"#0474DA"} />
                    </View>
                </View>
            </Modal>

            {/* MODAL 2: Request Visit Confirmation (Details) */}
            <Modal visible={showDetailsModal} transparent animationType="fade">
                <View style={tw`flex-1 justify-center items-center bg-black/50 px-5`}>
                    <View style={tw`bg-white w-full p-6 rounded-3xl`}>
                        <View style={tw`mb-5 flex-row items-center justify-between`}>
                            <Text style={tw`text-lg font-bold text-black`}>Select Visit Time</Text>
                            <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
                                <Ionicons name="close" size={24} color="black" />
                            </TouchableOpacity>
                        </View>

                        <Text style={tw`text-sm font-bold text-black mb-2`}>Full Name</Text>
                        <TextInput
                            style={tw`border border-zinc-200 rounded-xl px-4 py-3 mb-4 text-black`}
                            placeholder="Enter your name"
                            placeholderTextColor="#A1A1AA"
                            value={name}
                            onChangeText={(text) => setName(text)}
                        />

                        <Text style={tw`text-sm font-bold text-black mb-2`}>Phone Number</Text>
                        <TextInput
                            style={tw`border border-zinc-200 rounded-xl px-4 py-3 mb-6 text-black`}
                            placeholder="+880 1XXX XXXXXX"
                            placeholderTextColor="#A1A1AA"
                            keyboardType="phone-pad"
                            value={phoneNumber}
                            onChangeText={(text) => setPhoneNumber(text)} />


                        <Button text={"Request Visit Confirmation"} handleContinueToDetails={handleRequestConfirmation} color={"#0474DA"} width={"full"} font={"bold"} paddingTopBottom={16} rounded={"xl"} isLoading={isLoading} />
                    </View>
                </View>
            </Modal>

            {/* MODAL 3: Success Alert */}
            <Modal visible={showSuccessModal} transparent animationType="fade">
                <View style={tw`flex-1 justify-center items-center bg-black/50 px-5`}>
                    <View style={tw`bg-white w-full p-8 rounded-3xl items-center`}>
                        <View style={tw`w-16 h-16 bg-[#0474DA] rounded-full items-center justify-center mb-4`}>
                            <MaterialCommunityIcons name="check" size={40} color="white" />
                        </View>

                        <Text style={tw`text-xl font-bold text-black mb-2`}>Request Sent!</Text>
                        <Text style={tw`text-zinc-500 text-center text-sm mb-6 px-4`}>
                            The landlord has been notified. You will receive a confirmation via WhatsApp shortly.
                        </Text>

                        <View style={tw`bg-blue-50 w-full p-4 rounded-2xl mb-6`}>
                            <Text style={tw`text-[#0474DA] text-xs font-bold mb-1`}>VISIT DETAILS</Text>
                            <Text style={tw`text-black text-sm`}>{singleProperty?.title} • {formattedDate}, {formattedTime}</Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => setShowSuccessModal(false)}
                            style={tw`border border-[#0474DA] w-full py-3.5 rounded-xl`}
                        >
                            <Text style={tw`text-[#0474DA] text-center font-bold`}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default BookingModal;