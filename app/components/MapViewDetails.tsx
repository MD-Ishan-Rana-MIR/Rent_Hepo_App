import { usePropertyMapBoxDetailsQuery } from '@/app/redux/api/tanentDiscoverApi';
import tw from '@/lib/tailwind';
import { imageUrl } from '@/lib/url';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { errorMsg } from './../../lib/errorMsg';

const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY';

const MapViewDetails = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);

    const [mapLat, setMapLat] = useState<number>(23.8103);
    const [mapLng, setMapLng] = useState<number>(90.4125);

    // Selected Property
    const [selectedProperty, setSelectedProperty] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Property API
    const { data } = usePropertyMapBoxDetailsQuery({
        latitude: mapLat,
        longitude: mapLng,
    });

    // Search Location
    const handleSearch = async (query: string) => {
        setSearchQuery(query);

        if (!query) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/place/textsearch/json`,
                {
                    params: {
                        query,
                        key: GOOGLE_API_KEY,
                    },
                }
            );

            setSuggestions(response?.data?.results || []);
        } catch (error) {
            return errorMsg(error);
        }
    };

    const properties = data?.data || [];

    const region = {
        latitude: mapLat,
        longitude: mapLng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };

    return (
        <View style={tw`flex-1 bg-blackBg`}>

            {/* Header */}
            <View style={tw`absolute top-3 left-0 right-0 z-20 px-4`}>
                <View style={tw`flex-row items-center`}>

                    {/* Back Button */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={tw`bg-white p-2 rounded-full shadow-md`}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color="black"
                        />
                    </TouchableOpacity>

                    {/* Search Box */}
                    <View style={tw`flex-1 ml-3`}>
                        <View
                            style={tw`flex-row items-center bg-white border border-zinc-200 h-13 rounded-2xl px-4`}
                        >
                            <Ionicons
                                name="search-outline"
                                size={20}
                                color="#999"
                            />

                            <TextInput
                                placeholder="Search location..."
                                placeholderTextColor="#999"
                                value={searchQuery}
                                onChangeText={handleSearch}
                                style={tw`flex-1 ml-3 text-black`}
                            />
                        </View>
                    </View>
                </View>
            </View>

            {/* Suggestions */}
            {suggestions.length > 0 && (
                <View
                    style={tw`absolute top-24 left-4 right-4 z-30 bg-white rounded-xl overflow-hidden`}
                >
                    {suggestions.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                setMapLat(item.geometry.location.lat);
                                setMapLng(item.geometry.location.lng);

                                setSearchQuery(
                                    item.formatted_address
                                );

                                setSuggestions([]);
                            }}
                            style={tw`p-3 border-b border-zinc-100`}
                        >
                            <Text style={tw`text-black`}>
                                {item.formatted_address}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Map */}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={region}
            >

                {/* Default Markers */}
                {properties.map((item: any, index: number) => (
                    item.lat &&
                    item.long && (
                        <Marker
                            key={index}
                            coordinate={{
                                latitude: parseFloat(item.lat),
                                longitude: parseFloat(item.long),
                            }}
                            title={item?.title || 'Property'}
                            description={`${item?.symbol || '$'}${item?.price || 'N/A'}`}
                            onPress={() => {
                                setSelectedProperty(item);
                                setModalVisible(true);
                            }}
                        />
                    )
                ))}
            </MapView>

            {/* Property Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={tw`flex-1 justify-end`}>

                    {/* Backdrop */}
                    <TouchableOpacity
                        style={tw`absolute inset-0 `}
                        onPress={() => setModalVisible(false)}
                    />

                    {/* Modal Content */}
                    <View style={tw`bg-white rounded-t-3xl px-4 py-10`}>

                        {/* Close Button */}
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={tw`absolute top-4  bg-btnColor  rounded-full right-4 z-10`}
                        >
                            <Ionicons
                                name="close-circle"
                                size={28}
                                color="white"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() =>
                                router.navigate({
                                    pathname: '/(tenant-tab)/details/[id]',
                                    params: { id: selectedProperty?.id }
                                })
                            }
                            activeOpacity={0.9}
                            style={tw`bg-white border border-zinc-100 rounded-[24px] mb-5 overflow-hidden shadow-sm`}
                        >
                            <Image
                                source={{ uri: `${imageUrl}${selectedProperty?.property_images[0]?.path}` }}
                                style={tw`w-full h-48`}
                                resizeMode="cover"
                            />
                            <View style={tw`px-4 mt-7 pb-6`}>
                                <View style={tw`flex-row gap-x-2.5 mb-5`}>
                                    <View style={tw`bg-[#24D7001A] py-1 px-3 flex-row items-center gap-x-3 rounded-[10px]`}>
                                        <Text style={tw`w-2 h-2 bg-[#24D700] rounded-full`} />
                                        <Text style={tw`text-[#24D700] font-medium text-xs`}>{selectedProperty?.availability}</Text>
                                    </View>
                                    <View style={tw`bg-[#E6F1FB] py-1 px-3 flex-row items-center gap-x-3 rounded-[10px]`}>
                                        <Text style={tw`text-primaryText font-medium text-xs`}>For {selectedProperty?.purpose}</Text>
                                    </View>
                                    <View style={tw`bg-[#E8E8E8] py-1 px-3 flex-row items-center gap-x-3 rounded-[10px]`}>
                                        <Text style={tw`text-[#6B6B6B] font-medium text-xs`}>{selectedProperty?.property_category}</Text>
                                    </View>
                                </View>
                                <View style={tw`flex flex-row items-center justify-between`}>
                                    <Text style={tw`flex-1 text-textLg font-medium text-[#333] mr-2`} numberOfLines={1}>
                                        {selectedProperty?.title}
                                    </Text>
                                    <View style={tw`bg-btnColor rounded-[24px] px-2.5 py-1.5`}>
                                        <Text style={tw`text-white text-xs`}>Available</Text>
                                    </View>
                                </View>
                                <Text style={tw`text-zinkText text-small mt-2.5`}>{selectedProperty?.location}</Text>
                                <Text style={tw`text-primaryText font-semibold text-textLg mt-5`}>{selectedProperty?.currency_symbol}{selectedProperty?.price?.toLocaleString()}</Text>
                            </View>
                        </TouchableOpacity>

                        {/* View Details */}
                        <TouchableOpacity
                            onPress={() => {
                                setModalVisible(false);

                                router.push(
                                    `/(tenant-tab)/details/${selectedProperty?.id}`
                                );
                            }}
                            style={tw`bg-btnColor py-3 rounded-xl items-center`}
                        >
                            <Text
                                style={tw`text-white font-semibold`}
                            >
                                View Details
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
});

export default MapViewDetails;