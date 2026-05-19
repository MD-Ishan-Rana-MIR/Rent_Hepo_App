import { useGetNotificationsQuery, useReadAllNotificationMutation, useSingleNotificationReadMutation } from '@/app/redux/api/notificationApi';
import { errorMsg } from '@/lib/errorMsg';
import { successMsg } from '@/lib/successMsg';
import tw from '@/lib/tailwind';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';


dayjs.extend(relativeTime);

const LandLoardNotification = () => {
    const [page, setPage] = useState(1);
    const [allNotifications, setAllNotifications] = useState();

    // API Hooks
    const { data, isLoading, isFetching } = useGetNotificationsQuery(page);
    const [singleNotificationRead] = useSingleNotificationReadMutation();
    const [readAllNotification] = useReadAllNotificationMutation();

    useEffect(() => {
        if (data?.data?.data) {
            if (page === 1) {
                setAllNotifications(data.data.data);
            } else {
                setAllNotifications(prev => [...prev, ...data.data.data]);
            }
        }
    }, [data, page]);

    const handleLoadMore = () => {
        if (data?.data?.next_page_url && !isFetching) {
            setPage(prev => prev + 1);
        }
    };

    const handleReadOne = async (id: string, isRead: boolean) => {
        if (!isRead) {
            try {
                const res = await await singleNotificationRead(id).unwrap();
                if (res) {
                    return successMsg(res?.message)
                }
            } catch (error) {
                return errorMsg(error);
            }
        }
    };

    // সব নোটিফিকেশন রিড করা
    const handleReadAll = async () => {
        try {
            const res = await await readAllNotification({}).unwrap();
            successMsg(res?.message)
            Alert.alert("Success", "All notifications marked as read");
        } catch (error) {
            return errorMsg(error);
        }
    };

    const renderIcon = (notifType: string) => {
        const isReject = notifType.includes('Reject');
        return (
            <View style={tw`w-12 h-12 ${isReject ? 'bg-red-50' : 'bg-blue-50'} rounded-xl items-center justify-center`}>
                <MaterialCommunityIcons
                    name={isReject ? "calendar-remove" : "calendar-check"}
                    size={24}
                    color={isReject ? "#EF4444" : "#0474DA"}
                />
            </View>
        );
    };

    const NotificationCard = ({ item }: { item }) => (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleReadOne(item.id, !!item.read_at)}
            style={tw`flex-row p-4 mb-4 rounded-2xl border ${!item.read_at ? 'bg-blue-50/30 border-blue-100' : 'bg-white border-zinc-100'}`}
        >
            {renderIcon(item.type)}
            <View style={tw`flex-1 ml-4`}>
                <View style={tw`flex-row justify-between items-start`}>
                    <Text style={tw`text-base font-bold text-[#1E293B] mb-1 flex-1`}>{item.data.title}</Text>
                    {!item.read_at && <View style={tw`w-2 h-2 bg-blue-500 rounded-full mt-2`} />}
                </View>
                <Text style={tw`text-zinc-500 text-sm leading-5 mb-2`}>{item.data.body}</Text>
                <Text style={tw`text-zinc-400 text-[10px]`}>{dayjs(item.created_at).fromNow()}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={tw`flex-1 bg-white`}>
            <StatusBar barStyle="dark-content" />

            {/* --- CUSTOM HEADER --- */}
            <View style={tw`flex-row items-center justify-between px-5  pb-4 border-b border-zinc-50`}>
                <TouchableOpacity onPress={() => router.back()} style={tw`p-1`}>
                    <Ionicons name="arrow-back" size={28} color="#1E293B" />
                </TouchableOpacity>

                <Text style={tw`text-xl font-bold text-[#1E293B]`}>Notifications</Text>

                <TouchableOpacity onPress={handleReadAll}>
                    <Text style={tw`text-blue-600 font-semibold text-sm`}>Read All</Text>
                </TouchableOpacity>
            </View>

            <View style={tw`flex-1 px-5`}>
                <FlatList
                    data={allNotifications}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <NotificationCard item={item} />}
                    contentContainerStyle={tw`pt-5`}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={() => (
                        isFetching ? <ActivityIndicator size="small" color="#0474DA" style={tw`py-4`} /> : <View style={tw`h-10`} />
                    )}
                    ListEmptyComponent={() => !isLoading ? (
                        <View style={tw`flex-1 items-center justify-center mt-20`}>
                            <MaterialCommunityIcons name="bell-off-outline" size={60} color="#E2E8F0" />
                            <Text style={tw`text-zinc-400 mt-4 text-base`}>No notifications found</Text>
                        </View>
                    ) : null}
                />
            </View>
        </View>
    );
};

export default LandLoardNotification;