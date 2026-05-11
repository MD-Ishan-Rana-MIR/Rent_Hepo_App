
import { errorMsg } from '@/lib/errorMsg';
import { largeViewIcon } from '@/lib/icon';
import { successMsg } from '@/lib/successMsg';
import tw from '@/lib/tailwind';
import { BookingBookingDetails } from '@/lib/type';
import { imageUrl } from '@/lib/url';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    Modal,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import BookingSkeleton from '../components/BookingSkeleton';
import { useBookingAcceptMutation, useBookingRejectMutation, useLandLoardAllBookingQuery } from '../redux/api/landloardBookingApi';

const Bookings = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBooking, setSelectedBooking] = useState<BookingBookingDetails | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // 1. Fetch data
    const { data, isLoading } = useLandLoardAllBookingQuery({});
    // Use optional chaining and default to empty array
    const bookingData: BookingBookingDetails[] = data?.data || [];


    // 2. State for filtered results
    const [filteredData, setFilteredData] = useState<BookingBookingDetails[]>([]);

    // 3. Fix: Sync filteredData whenever bookingData (API) OR searchQuery changes
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredData(bookingData);
        } else {
            const filtered = (bookingData || []).filter(item =>
                // The ?. (Optional Chaining) prevents the crash if track_id is missing
                item?.booking_track_id && item.booking_track_id.includes(searchQuery)
            );
            setFilteredData(filtered);
        }
    }, [searchQuery, bookingData]);

    const [bookingReject] = useBookingRejectMutation();
    const [bookingAccept] = useBookingAcceptMutation();

    const handleOpenDetails = (item: BookingBookingDetails) => {
        setSelectedBooking(item);
        setIsModalVisible(true);
    };

    const handleBookingReject = async (id: number) => {
        Alert.alert(
            "Reject Booking",
            "Are you sure you want to reject this booking request?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Reject",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const res = await bookingReject(id).unwrap();
                            if (res) {
                                setIsModalVisible(false);
                                successMsg(res?.message);
                            }
                        } catch (error: any) {
                            errorMsg(error?.data?.message);
                        }
                    }
                }
            ]
        );
    };

    const handleBookingAccept = async (id: number) => {
        Alert.alert(
            "Accept Booking",
            "Are you sure you want to accept this booking request?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Accept",
                    onPress: async () => {
                        try {
                            const res = await bookingAccept(id).unwrap();
                            if (res) {
                                setIsModalVisible(false);
                                successMsg(res?.message);
                            }
                        } catch (error: any) {
                            errorMsg(error?.data?.message);
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: BookingBookingDetails }) => {
        const getStatusStyle = (status: string) => {
            switch (status) {
                case 'Accepted': return { bg: 'bg-green-100', text: 'text-green-600' };
                case 'Rejected': return { bg: 'bg-red-100', text: 'text-red-600' };
                default: return { bg: 'bg-amber-100', text: 'text-amber-600' };
            }
        };

        const statusStyle = getStatusStyle(item.status);


        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleOpenDetails(item)}
                style={tw`flex-row items-center bg-white border border-zinc-100 rounded-2xl p-4 mb-4 mx-6 shadow-sm`}
            >
                <View style={tw`w-16 h-16 rounded-lg bg-blue-50 overflow-hidden`}>
                    <Image
                        source={{ uri: `${imageUrl}${item?.property?.property_images[0]?.path}` }}
                        style={tw`w-full h-full`}
                        resizeMode="cover"
                    />
                </View>

                <View style={tw`flex-1 ml-4`}>
                    <Text style={tw`text-sm font-bold text-bodyText`}>
                        {item?.property?.title.length > 18 ? `${item?.property?.title.slice(0, 18)}..` : item?.property?.title}
                    </Text>
                    <Text style={tw`text-[11px] text-zinc-500 font-medium mt-0.5`}>
                        {item?.property?.description?.slice(0, 25)}...
                    </Text>
                    <Text style={tw`text-[11px] text-zinc-400 font-medium mt-1`}>Track ID : {item.booking_track_id}</Text>
                    <Text style={tw`text-[9px] text-primaryText font-semibold mt-1`}>
                        {item.booking_time} • {item?.booking_date}
                    </Text>
                </View>

                <View style={tw`items-end justify-between`}>
                    <View style={tw`${statusStyle.bg} px-2.5 py-0.5 rounded-full`}>
                        <Text style={tw`${statusStyle.text} text-[10px] font-bold`}>{item.status}</Text>
                    </View>

                    <View style={tw`flex-row items-center gap-x-2.5 mt-2`}>
                        <TouchableOpacity onPress={() => handleOpenDetails(item)}>
                            <SvgXml xml={largeViewIcon} width="20" height="20" />
                        </TouchableOpacity>
                        {/* <TouchableOpacity onPress={() => handleBookingAccept(item?.id)}>
                            <SvgXml xml={verifyButton} width="20" height="20" />
                        </TouchableOpacity> */}
                        {/* <TouchableOpacity onPress={() => handleBookingReject(item?.id)}>
                            <SvgXml xml={deleteIcon} width="20" height="20" />
                        </TouchableOpacity> */}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    if (isLoading) return <BookingSkeleton />;

    return (
        <View style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />

            <View style={tw`px-6 pt-2`}>
                <Text style={tw`text-textLg font-bold text-bodyText mb-4`}>Booking Requests</Text>
                <View style={tw`flex-row items-center bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-1.5 mb-6`}>
                    <Ionicons name="search-outline" size={20} color="#A1A1AA" />
                    <TextInput
                        placeholder="Search by Track ID..."
                        placeholderTextColor="#A1A1AA"
                        style={tw`flex-1 ml-3 text-bodyText font-medium text-base`}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={18} color="#A1A1AA" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={tw`pb-10`}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View style={tw`items-center mt-20 px-10`}>
                        <Ionicons name="search-outline" size={48} color="#E4E4E7" />
                        <Text style={tw`text-zinc-400 font-medium text-center mt-4`}>
                            {searchQuery ? `No requests found with Track ID ${searchQuery}` : "No booking requests available"}
                        </Text>
                    </View>
                )}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={tw`flex-1 justify-end bg-black/50`}>
                    <View style={tw`bg-white rounded-t-3xl h-4/5 p-6`}>
                        <View style={tw`items-center mb-4`}>
                            <View style={tw`w-12 h-1.5 bg-zinc-200 rounded-full`} />
                        </View>

                        <View style={tw`flex-row justify-between items-center mb-6`}>
                            <Text style={tw`text-xl font-bold text-bodyText`}>Details</Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                <Ionicons name="close-circle" size={28} color="#A1A1AA" />
                            </TouchableOpacity>
                        </View>

                        {selectedBooking && (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Image
                                    source={{ uri: `${imageUrl}${selectedBooking?.property?.property_images[0]?.path}` }}
                                    style={tw`w-full h-48 rounded-2xl mb-4`}
                                    resizeMode="cover"
                                />

                                <View style={tw`mb-6`}>
                                    <Text style={tw`text-lg font-bold text-bodyText`}>{selectedBooking.property.title}</Text>
                                    <Text style={tw`text-zinc-500 mt-2 leading-5`}>{selectedBooking.property.description}</Text>
                                </View>

                                <View style={tw`bg-zinc-50 rounded-2xl p-4 gap-y-4 mb-6`}>
                                    <DetailRow label="Track ID" value={selectedBooking.track_id} />
                                    <DetailRow label="Tenant Name" value={selectedBooking.name} />
                                    <DetailRow label="Phone" value={selectedBooking.phone_number} />
                                    <DetailRow label="Date" value={selectedBooking.booking_date} />
                                    <DetailRow label="Time" value={selectedBooking.booking_time} />
                                    <DetailRow label="Status" value={selectedBooking.status} />
                                </View>

                                <View style={tw`flex-row gap-x-4 mb-10`}>
                                    <TouchableOpacity
                                        onPress={() => handleBookingReject(selectedBooking.id)}
                                        style={tw`flex-1 bg-red-50 py-4 rounded-xl items-center border border-red-100`}
                                    >
                                        <Text style={tw`text-red-600 font-bold text-base`}>Reject</Text>
                                    </TouchableOpacity>
                                    {
                                        selectedBooking?.status === "Accepted" ? "" : <TouchableOpacity
                                            onPress={() => handleBookingAccept(selectedBooking.id)}
                                            style={tw`flex-1 bg-blueBg py-4 rounded-xl items-center`}
                                        >
                                            <Text style={tw`text-white font-bold text-base`}>Accept</Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal >
        </View >
    );
};

const DetailRow = ({ label, value }: { label: string, value: string }) => (
    <View style={tw`flex-row justify-between items-center`}>
        <Text style={tw`text-zinc-500 text-sm`}>{label}</Text>
        <Text style={tw`text-bodyText font-semibold text-sm`}>{value}</Text>
    </View>
);

export default Bookings;