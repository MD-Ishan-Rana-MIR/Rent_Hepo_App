import { deleteIcon, largeViewIcon } from '@/lib/icon';
import tw from '@/lib/tailwind';
import { BookingData } from '@/lib/type';
import { imageUrl } from '@/lib/url';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    Modal,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import Toast from 'react-native-toast-message';
import BookingSkeleton from '../components/BookingSkeleton';
import { useTanentAllBookingQuery, useTanentBookingDeleteMutation } from '../redux/api/tanentBookingApi';


const TenantBooking = () => {
    // ======================================== Show All Booking Api ================================

    const { data, isLoading } = useTanentAllBookingQuery({});


    const BOOKING_DATA: BookingData[] = data?.data || []




    const [isViewModalVisible, setIsViewModalVisible] = useState(false);

    const [selectedBooking, setSelectedBooking] = useState<typeof BOOKING_DATA[0] | null>(null);
    const handleOpenDetails = (item: typeof BOOKING_DATA[0]) => {
        setSelectedBooking(item);
        setIsViewModalVisible(true);
    };




    // =================================== Booking Delete Api ================================

    const [tanentBookingDelete] = useTanentBookingDeleteMutation();

    const handleDeleteBooking = async (id: number) => {
        Alert.alert(
            "Logout",
            "Are you sure you want to delete?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: async () => {

                        try {
                            const res = await tanentBookingDelete(id).unwrap();
                            if (res) {

                                Toast.show({
                                    type: 'success',
                                    text1: res?.message,
                                });
                            }

                        } catch (error: any) {
                            Toast.show({
                                type: 'error',
                                text1: 'Logout failed',
                                text2: error?.data?.message,
                            });
                        }
                    }
                }
            ]
        );
    }























    if (isLoading) {
        return (
            <BookingSkeleton />
        )
    }





    const renderItem = ({ item }: { item: typeof BOOKING_DATA[0] }) => (
        <TouchableOpacity
            activeOpacity={0.7}
            style={tw`flex-row items-center bg-white border border-zinc-100 rounded-2xl p-4 mb-4 mx-6 shadow-sm`}
        >
            <View style={tw`w-16 h-16 rounded-lg bg-blue-100 overflow-hidden`}>
                <Image source={{ uri: `${imageUrl}${item?.property?.property_images[0]?.path}` }} style={tw`w-full h-full`} />
            </View>

            <View style={tw`flex-1 ml-4`}>
                <Text style={tw`text-small font-medium text-bodyText`}>{item?.property?.title}</Text>
                <Text style={tw`text-[11px] text-[#6B6B6B] font-medium mt-1.5`}>{item.property?.description.slice(0, 15)}...</Text>
                <Text style={tw`text-[11px] text-[#B0B0B0] font-medium mt-1.5`}>Track ID : {item.booking_track_id}</Text>
                <Text style={tw`text-[8px] text-primaryText font-medium mt-1`}>{item.booking_time}/{item?.booking_date}</Text>
            </View>

            <View style={tw`flex-row items-center gap-x-2`}>
                <TouchableOpacity onPress={() => handleOpenDetails(item)}>
                    <SvgXml xml={largeViewIcon} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { handleDeleteBooking(item?.id) }} >
                    <SvgXml xml={deleteIcon} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={tw`bg-blackBg flex-1 `} >
            <StatusBar barStyle="dark-content" />

            <View style={tw`px-5 flex-row items-center justify-between pb-6  `}>
                <Text style={tw`text-textLg font-semibold text-bodyText`}>Booking Requests</Text>
            </View>

            <FlatList
                data={BOOKING_DATA}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={tw`pb-10 flex-grow`}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={tw`flex-1 justify-center items-center mt-20`}>
                        <Text style={tw`text-zinc-500 font-montserrat-500 text-lg`}>
                            No Booking Found
                        </Text>
                    </View>
                }
            />
            {/* DETAILS MODAL */}
            <Modal visible={isViewModalVisible} transparent animationType="fade">
                <View style={tw`flex-1 justify-center items-center bg-black/50 px-5`}>
                    <View style={tw`bg-white w-full p-8 rounded-3xl`}>
                        {/* <Text style={tw`text-xl font-bold text-black mb-6`}>Request Details</Text> */}
                        <View>
                            <Text style={tw` text-lg text-black `} >User Information</Text>
                            <View style={tw`flex-row items-center gap-x-3 mt-2 mb-3.5 `} >
                                <View>
                                    <Image source={{ uri: selectedBooking?.tenant?.avatar_url }} style={tw` rounded-full w-10 h-10 `} />
                                </View>
                                <View>
                                    <Text style={tw`text-black font-medium text-xs`} >{selectedBooking?.tenant?.name}</Text>
                                    <Text style={tw`text-[#8C8C8C] text-[8px] font-light `} >Verified Identity</Text>
                                </View>
                            </View>
                        </View>

                        <View>
                            <Text style={tw` text-lg text-black `} >Property Information</Text>
                            <View style={tw`flex-row items-center gap-x-3 mt-2 mb-3.5 `} >
                                <View>
                                    <Image source={{ uri: selectedBooking?.property?.landlord?.avatar_url }} style={tw` rounded-full w-10 h-10 `} />
                                </View>
                                <View>
                                    <Text style={tw`text-black font-medium text-xs`} >{selectedBooking?.property?.landlord?.name}</Text>
                                    <Text style={tw`text-[#8C8C8C] text-[8px] font-light `} >{selectedBooking?.property?.location}</Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            <Text style={tw`text-[#000000] text-xs font-normal mb-2 `} >Scheduled Date & Time</Text>
                            <Text style={tw` text-primaryText font-semibold text-xs p-2 py-2 bg-[#E6F1FB] rounded-[8.55px] mb-5 `} >{selectedBooking?.booking_time}/{selectedBooking?.booking_date}</Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => setIsViewModalVisible(false)}
                            style={tw`bg-[#0474DA] w-full py-4 rounded-xl`}
                        >
                            <Text style={tw`text-white text-center font-bold`}>Close Details</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default TenantBooking;