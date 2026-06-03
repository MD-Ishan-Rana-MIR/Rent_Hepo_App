import { errorMsg } from '@/lib/errorMsg';
import tw from '@/lib/tailwind';
import { LandlordProperty } from '@/lib/type';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { NotificationData } from '../(tenant-tab)';
import LandLoadrdCard from '../components/LandLoadrdCard';
import PropertySkeleton from '../components/PropertySkeleton';
import { useAllLandloardPropertyQuery } from '../redux/api/landloardPropertyApi';
import { useGetNotificationsQuery } from '../redux/api/notificationApi';

const BusinessDashboard = () => {


    const cardShadow = {
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    };




    const { data, isLoading, refetch } = useAllLandloardPropertyQuery(undefined);



    const propertyData: LandlordProperty[] = data?.data?.properties || []

    const [refreshing, setRefreshing] = React.useState(false);




    // all notification length 

    const { data: notificationData } = useGetNotificationsQuery(1);


    const unReadNotification: NotificationData[] = notificationData?.data?.data || [];


    if (isLoading) {
        return (
            <PropertySkeleton />
        )
    }

    const onRefresh = async () => {
        setRefreshing(true);

        try {
            await refetch();
        } catch (error) {
            return errorMsg(error)
        } finally {
            setRefreshing(false);
        }
    };

    // demo app 


    return (
        <View style={tw`flex-1 bg-blackBg`}>
            <StatusBar barStyle="dark-content" />

            {/* --- FIXED SECTION --- */}
            <View style={tw`px-5 mt-1.5 `}>
                {/* Header */}
                <View style={tw`flex-row items-center justify-between mb-3`}>
                    <Text style={tw`text-textTwoXl font-montserrat-700 text-bodyText`}>
                        Business Dashboard
                    </Text>

                    {/* Notification Button */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => router.push("components/notification/LandLoardNotification")}
                        style={tw`p-2.5 bg-white border border-zinc-100 rounded-full shadow-sm relative`}
                    >
                        <Ionicons name="notifications-outline" size={24} color="#333333" />

                        {/* Notification Length Indicator */}
                        {unReadNotification?.filter(item => item.read_at == null).length > 0 && (
                            <View
                                style={[
                                    tw`absolute -top-1 -right-1 min-w-5 h-5 bg-red-500 rounded-full border-2 border-white items-center justify-center px-1`,
                                    { zIndex: 10 }
                                ]}
                            >
                                <Text style={tw`text-white text-[10px] font-bold text-center`}>
                                    {unReadNotification.filter(item => item.read_at == null).length}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* stats card  */}
                        
                <View style={tw`flex-row flex-wrap justify-between`}>

                    <View
                        style={[
                            tw`bg-white rounded-[12px] p-2 mb-2`,
                            { width: '48%', ...cardShadow }
                        ]}
                    >
                        <Text style={tw`text-center text-textLg font-montserrat-700 text-primaryText mb-1`}>
                            {data?.data?.total_property ? data?.data?.total_property : 0}
                        </Text>
                        <Text style={tw`text-center text-zinc-500 font-montserrat-500 text-xs`}>
                            Total Properties
                        </Text>
                    </View>

                    <View
                        style={[
                            tw`bg-white rounded-[12px] p-2 mb-2`,
                            { width: '48%', ...cardShadow }
                        ]}
                    >
                        <Text style={tw`text-center text-textLg font-montserrat-700 text-primaryText mb-1`}>
                            {data?.data?.total_booking ? data?.data?.total_booking : 0}
                        </Text>
                        <Text style={tw`text-center text-zinc-500 font-montserrat-500 text-xs`}>
                            Total Booking
                        </Text>
                    </View>

                    <View
                        style={[
                            tw`bg-white rounded-[12px] p-2 mb-2`,
                            { width: '48%', ...cardShadow }
                        ]}
                    >
                        <Text style={tw`text-center text-textLg font-montserrat-700 text-primaryText mb-1`}>
                            {data?.data?.total_pending ? data?.data?.total_pending : 0}
                        </Text>
                        <Text style={tw`text-center text-zinc-500 font-montserrat-500 text-xs`}>
                            Total Pending
                        </Text>
                    </View>

                    <View
                        style={[
                            tw`bg-white rounded-[12px] p-2 mb-2`,
                            { width: '48%', ...cardShadow }
                        ]}
                    >
                        <Text style={tw`text-center text-textLg font-montserrat-700 text-primaryText mb-1`}>
                            {data?.data?.total_approved ? data?.data?.total_approved : 0}
                        </Text>
                        <Text style={tw`text-center text-zinc-500 font-montserrat-500 text-xs`}>
                            Total Approved
                        </Text>
                    </View>

                </View>

                {/* List Title */}
                <View style={tw`mb-4`}>
                    <Text style={tw`text-textTwoXl font-montserrat-600 text-bodyText`}>
                        Managed Properties
                    </Text>
                </View>
            </View>

            {/* --- SCROLLABLE SECTION --- */}
            <FlatList
                data={propertyData}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={
                    <View style={tw`flex-1 items-center justify-center mt-20`}>
                        <Text style={tw`text-zinc-400 text-base font-medium`}>
                            No properties found 😕
                        </Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={tw`px-5`}>
                        <LandLoadrdCard {...item} />
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={tw`pb-10`} // Extra space at bottom
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        </View>
    );
};

export default BusinessDashboard;