import tw from '@/lib/tailwind';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type NotificationItem = {
  id: string;
  type: 'approval' | 'match' | 'payment';
  title: string;
  description: string;
  time: string;
  isRead: boolean;
};

const LandloardNotification = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'approval',
      title: 'Booking Approved',
      description: 'Your visit to Skyline Modern Villa has been approved for tomorrow, 10:00 AM.',
      time: '15 mins ago',
      isRead: false,
    },
    {
      id: '2',
      type: 'match',
      title: 'New Property Match',
      description: 'A new 3-BHK Apartment in Gulshan 2 just matched your saved search criteria.',
      time: '4 hours ago',
      isRead: true,
    },
    {
      id: '3',
      type: 'payment',
      title: 'Payment Reminder',
      description: 'Your monthly rent for Dhanmondi Loft is due in 3 days. Total: $1,200.',
      time: '2 days ago',
      isRead: true,
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return (
          <View style={tw`w-12 h-12 bg-blue-50 rounded-xl items-center justify-center`}>
            <MaterialCommunityIcons name="check-decagram" size={24} color="#0474DA" />
          </View>
        );
      case 'match':
        return (
          <View style={tw`w-12 h-12 bg-blue-50 rounded-xl items-center justify-center`}>
            <MaterialCommunityIcons name="office-building" size={24} color="#0474DA" />
          </View>
        );
      case 'payment':
        return (
          <View style={tw`w-12 h-12 bg-blue-50 rounded-xl items-center justify-center`}>
            <Ionicons name="card" size={24} color="#0474DA" />
          </View>
        );
    }
  };

  const NotificationCard = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity
      onPress={() => markAsRead(item.id)}
      activeOpacity={0.7}
      style={tw`flex-row p-4 mb-4 rounded-2xl border ${!item.isRead ? 'bg-blue-50/30 border-blue-100' : 'bg-white border-zinc-100'}`}
    >
      {renderIcon(item.type)}
      <View style={tw`flex-1 ml-4`}>
        <Text style={tw`text-lg font-bold text-[#1E293B] mb-1`}>{item.title}</Text>
        <Text style={tw`text-zinc-500 text-sm leading-5 mb-2`}>{item.description}</Text>
        <Text style={tw`text-zinc-400 text-xs`}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <StatusBar barStyle="dark-content" />

      {/* Fixed Header Layout */}
      <View style={tw`px-5`}>
        <View style={tw`flex-row items-center mb-6`}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={tw`mr-4 `}
          >
            <Ionicons name="arrow-back" size={28} color="#0474DA" />
          </TouchableOpacity>
          <Text style={tw`text-2xl font-bold text-bodyText`}>Notification</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-10`}>
          {/* Today Section */}
          <Text style={tw`text-sm text-zinc-400 mb-4 font-medium`}>Today</Text>
          {notifications.filter(n => n.time.includes('min') || n.time.includes('hour')).map(item => (
            <NotificationCard key={item.id} item={item} />
          ))}

          {/* Earlier Section */}
          <Text style={tw`text-sm text-zinc-400 mt-4 mb-4 font-medium`}>Earlier</Text>
          {notifications.filter(n => n.time.includes('day')).map(item => (
            <NotificationCard key={item.id} item={item} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default LandloardNotification;