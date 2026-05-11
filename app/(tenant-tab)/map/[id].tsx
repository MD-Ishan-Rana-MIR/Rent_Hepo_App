import { useSingleTenentPropertyQuery } from '@/app/redux/api/tanentDiscoverApi';
import tw from '@/lib/tailwind';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const MapDetails = () => {
    const { id } = useLocalSearchParams();
    const { data, isLoading } = useSingleTenentPropertyQuery(id);

    if (isLoading || !data?.data?.lat) {
        return <View style={tw`flex-1 bg-zinc-50`} />;
    }

    const lat = parseFloat(data.data.lat);
    const lng = parseFloat(data.data.long);

    const region = {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    };

    return (
        <View style={tw`flex-1 bg-blackBg`}>
            <TouchableOpacity
                onPress={() => router.back()}
                style={[tw`absolute top-3 left-3 z-10 bg-white p-2 rounded-full shadow-md`]}
            >
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={region}
            >
                <Marker coordinate={{ latitude: lat, longitude: lng }} />
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    map: {
        // width: '100%',
        height: "100%"

    },
});

export default MapDetails;