import { useLandLoardPropertyUpdateMutation, useSingleLandloardPropertyDetailsQuery } from '@/app/redux/api/landloardPropertyApi';
import { errorMsg } from '@/lib/errorMsg';
import { successMsg } from '@/lib/successMsg';
import tw from '@/lib/tailwind';
import { imageUrl } from '@/lib/url';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LocationData } from '../post';

const PropertyUpdate = () => {
    const { id } = useLocalSearchParams();

    // ================= API =================
    const { data, isLoading } = useSingleLandloardPropertyDetailsQuery(id);

    // ================= State =================
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [area, setArea] = useState("");
    const [location, setLocation] = useState("");

    const [amenities, setAmenities] = useState<{ id: string; name: string }[]>([]);
    const [amenityInput, setAmenityInput] = useState("");

    const [mediaItems, setMediaItems] = useState<any[]>([]);

    const [availability, setAvailability] = useState("Available");
    const [purpose, setPurpose] = useState("Sale");
    const [category, setCategory] = useState("Residential");

    const [modalVisible, setModalVisible] = useState(false);
    const [activeSelection, setActiveSelection] = useState<{ type: string, options: string[] }>({ type: '', options: [] });

    // ================= Set Default Values =================
    useEffect(() => {
        const propertyData = data?.data;

        if (propertyData) {
            setTitle(propertyData?.title || "");
            setDescription(propertyData?.description || "");
            setPrice(propertyData?.price?.toString() || "");
            setArea(propertyData?.total_area?.toString() || "");
            setLocation(propertyData?.location || "");

            // ✅ amenities object support
            setAmenities(
                propertyData?.amenities?.map((item: any) => ({
                    id: item.id?.toString() || Date.now().toString(),
                    name: item.name || item,
                })) || []
            );

            setMediaItems(
                propertyData?.property_images?.map((item: any, index: number) => ({
                    id: index.toString(),
                    uri: item.path
                        ? `${imageUrl}${item.path}` // ⚠️ important base URL
                        : "",
                    name: item.name || "Image",
                })) || []
            );
            setAvailability(propertyData?.availability || "Available");
            setPurpose(propertyData?.purpose || "Sale");
            setCategory(propertyData?.category || "Residential");
        }
    }, [data]);

    // ================= Helpers =================

    const addAmenity = () => {
        if (!amenityInput.trim()) return;

        const newAmenity = {
            id: Date.now().toString(),
            name: amenityInput
        };

        setAmenities([...amenities, newAmenity]);
        setAmenityInput("");
    };

    const removeAmenity = (id: string) => {
        setAmenities(amenities.filter(a => a.id !== id));
    };

    const addMedia = () => {
        const newItem = {
            id: Date.now().toString(),
            name: 'New Image',
            uri: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400'
        };
        setMediaItems([...mediaItems, newItem]);
    };

    const openDropdown = (type: string, options: string[]) => {
        setActiveSelection({ type, options });
        setModalVisible(true);
    };

    const handleSelect = (option: string) => {
        if (activeSelection.type === 'Availability') setAvailability(option);
        if (activeSelection.type === 'Purpose') setPurpose(option);
        if (activeSelection.type === 'Category') setCategory(option);
        setModalVisible(false);
    };



    const [lat, setLat] = useState<number | null>(null);
    const [long, setLong] = useState<number | null>(null);
    const [userLocation, setUserLoc] = useState<LocationData | null>(null);

    const [suggestions, setSuggestions] = useState<any[]>([]);

    const timeoutRef = useRef<any>(null);

    useEffect(() => {
        if (userLocation) {
            setLat(userLocation.geometry.location.lat);
            setLong(userLocation.geometry.location.lng);
        }
    }, [userLocation]);

    const handleLatLong = (query: string) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(async () => {
            if (!query || query.length < 2) {
                setSuggestions([]);
                return;
            }

            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/place/textsearch/json`,
                {
                    params: {
                        query,
                        key: "AIzaSyDpXUCYWUfawKwLO0KlT0V9Y1t2DTBNx-A",
                    },
                }
            );

            setSuggestions(response?.data?.results || []);
        }, 400);
    };

    useEffect(() => {
        if (userLocation) {
            setLat(userLocation.geometry.location.lat);
            setLong(userLocation.geometry.location.lng);
        }
    }, [userLocation]);


    const addMediaField = () => {
        setMediaItems([
            ...mediaItems,
            {
                id: Date.now().toString(),
                uri: "",
                name: "",
            },
        ]);
    };
    const pickImageForItem = async (id: string) => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            alert("Permission required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;

            const updated = mediaItems.map((item) =>
                item.id === id ? { ...item, uri } : item
            );

            setMediaItems(updated);
        }
    };



    // =============================== Landloard Property Update Api =======================================

    const [landLoardPropertyUpdate, { isLoading: updateLoading }] = useLandLoardPropertyUpdateMutation();






    const handleUpdate = async () => {
        const formData = new FormData();

        formData.append("title", title);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("total_area", area);
        formData.append("location", location);

        if (lat !== null && long !== null) {
            formData.append('lat', String(lat));
            formData.append('long', String(long));
        }

        formData.append("availability", availability);
        formData.append("purpose", purpose);
        formData.append("category", category);

        // ✅ amenities
        amenities.forEach((a, index) => {
            formData.append(`amenities[${index}]`, a.name);
        });

        // ✅ images (important for upload)
        mediaItems.forEach((item, index) => {

            if (item.uri && !item.uri.startsWith('http')) {

                const filename =
                    item.uri.split('/').pop() || `image_${index}.jpg`;

                const match = /\.(\w+)$/.exec(filename);

                const ext = match?.[1];

                const mimeType =
                    ext === 'png'
                        ? 'image/png'
                        : ext === 'webp'
                            ? 'image/webp'
                            : 'image/jpeg';

                formData.append(
                    `property_images[${index}][images_name]`,
                    item.name
                );

                formData.append(
                    `property_images[${index}][images]`,
                    {
                        uri: item.uri,
                        type: mimeType,
                        name: filename,
                    } as any
                );
            }
        });


        Alert.alert(
            "Update Profile",
            "Are you sure you want to update?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Yes, Update",
                    onPress: async () => {
                        try {
                            const res = await landLoardPropertyUpdate({ id, formData }).unwrap();
                            if (res) {

                                return successMsg(res?.message);

                            }

                        } catch (error: any) {
                            return errorMsg(error?.data?.message)
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };





















    // ================= Loader =================
    if (isLoading) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <ActivityIndicator size="large" color="#0474DA" />
            </View>
        );
    }

    return (
        <View style={tw`flex-1 bg-white px-4`}>
            {/* Header */}
            <View style={tw`flex-row items-center mt-4 mb-2`}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={28} color={tw.color('primaryText')} />
                </TouchableOpacity>
                <Text style={tw`flex-1 text-xl font-bold text-center mr-7`}>
                    Update Property
                </Text>
            </View>
            <KeyboardAwareScrollView
                enableOnAndroid
                extraScrollHeight={80}
                keyboardShouldPersistTaps="handled"
                style={tw`flex-1`}
                contentContainerStyle={tw`flex-grow`}
                showsVerticalScrollIndicator={false}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-10`}>

                    {/* Title */}
                    <View style={tw`mb-5`}>
                        <Text style={tw`text-zinc-500 mb-2`}>Property Title</Text>
                        <TextInput
                            value={title}
                            onChangeText={setTitle}
                            style={tw`border border-zinc-200 rounded-xl px-4 py-3`}
                        />
                    </View>

                    {/* Description */}
                    <View style={tw`mb-5`}>
                        <Text style={tw`text-zinc-500 mb-2`}>Description</Text>
                        <TextInput
                            multiline
                            value={description}
                            onChangeText={setDescription}
                            style={tw`border border-zinc-200 rounded-xl px-4 py-3 h-28`}
                        />
                    </View>

                    {/* Amenities Input */}
                    <Text style={tw`text-lg font-bold mb-3`}>Amenities</Text>

                    <View style={tw`flex-row mb-3`}>
                        <TextInput
                            value={amenityInput}
                            onChangeText={setAmenityInput}
                            placeholder="Add amenity"
                            style={tw`flex-1 border border-zinc-200 rounded-xl px-4 py-3`}
                        />
                        <TouchableOpacity
                            onPress={addAmenity}
                            style={tw`ml-2 bg-blue-500 px-4 justify-center rounded-xl`}
                        >
                            <Text style={tw`text-white`}>Add</Text>
                        </TouchableOpacity>
                    </View>

                    {/* amenities */}

                    <View style={tw`flex-row flex-wrap gap-2 mb-5`}>
                        {amenities.map((item) => (
                            <View
                                key={item.id}
                                style={tw`bg-zinc-50 border px-3 py-2 rounded-lg flex-row items-center`}
                            >
                                <Text>{item.name}</Text>
                                <TouchableOpacity onPress={() => removeAmenity(item.id)}>
                                    <Ionicons name="close-circle" size={16} style={tw`ml-2`} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>

                    {/* Area */}
                    <View style={tw`mb-5`}>
                        <Text style={tw`mb-2`} >Total Area</Text>
                        <TextInput
                            value={area}
                            onChangeText={setArea}
                            keyboardType="numeric"
                            style={tw`border border-zinc-200 rounded-xl px-4 py-3`}
                        />
                    </View>

                    {/* Dropdowns */}
                    {/* Availability */}
                    <View style={tw`mb-5`}>
                        <Text style={tw`text-zinc-500 mb-2 font-montserrat-500`}>
                            Availability
                        </Text>

                        <TouchableOpacity
                            onPress={() => openDropdown('Availability', ['Available', 'Sold', 'Rented'])}
                            style={tw`border border-zinc-200 rounded-xl px-4 py-3.5`}
                        >
                            <Text style={tw`text-black`}>{availability}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={tw`flex-row items-center gap-x-5`}>

                        {/* Purpose */}
                        <View style={tw`flex-1 mb-5`}>
                            <Text style={tw`text-zinc-500 mb-2 font-montserrat-500`}>
                                Purpose
                            </Text>

                            <TouchableOpacity
                                onPress={() => openDropdown('Purpose', ['Sale', 'Rent'])}
                                style={tw`border border-zinc-200 rounded-xl px-4 py-3.5`}
                            >
                                <Text style={tw`text-black`}>{purpose}</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Category */}
                        <View style={tw`flex-1 mb-5`}>
                            <Text style={tw`text-zinc-500 mb-2 font-montserrat-500`}>
                                Property Category
                            </Text>

                            <TouchableOpacity
                                onPress={() => openDropdown('Category', ['Residential', 'Commercial'])}
                                style={tw`border border-zinc-200 rounded-xl px-4 py-3.5`}
                            >
                                <Text style={tw`text-black`}>{category}</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                    <View style={tw`flex-row gap-x-4 `}>

                        {/* Price Field */}
                        <View style={tw`flex-1`}>
                            <Text style={tw`text-zinc-500 mb-2`}>Price ($)</Text>

                            <View
                                style={tw`h-12 border border-zinc-200 rounded-lg px-4 bg-white justify-center`}
                            >
                                <TextInput
                                    value={price}
                                    onChangeText={setPrice}
                                    placeholder="Enter Amount"
                                    placeholderTextColor="#A1A1AA"
                                    keyboardType="numeric"
                                    style={tw`font-montserrat-400 text-sm text-black`}
                                />
                            </View>
                        </View>

                        {/* Location Field */}
                        <View style={tw`flex-1`}>
                            <Text style={tw`text-zinc-500 mb-2`}>Location</Text>

                            <View
                                style={tw`h-12 border border-zinc-200 rounded-lg px-4 bg-white flex-row items-center`}
                            >
                                <TextInput
                                    value={location}
                                    onChangeText={(text) => {
                                        setLocation(text);
                                        handleLatLong(text);
                                    }}
                                    placeholder="City, Area"
                                    placeholderTextColor="#A1A1AA"
                                    style={tw`flex-1 font-montserrat-400 text-sm text-black`}
                                />

                                <Ionicons name="location-sharp" size={18} color="black" />
                            </View>
                        </View>

                    </View>


                    <View>
                        {suggestions && suggestions.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    const formattedAddress = item.formatted_address;
                                    const latitude = item.geometry.location.lat;
                                    const longitude = item.geometry.location.lng;


                                    setLocation(formattedAddress);


                                    // setValue('location', formattedAddress, { shouldValidate: true });


                                    setLat(latitude);
                                    setLong(longitude);
                                    setUserLoc(item);


                                    setSuggestions([]);

                                }}
                                style={tw`p-3 border-b border-gray-100 bg-white`}
                            >
                                <Text style={tw`text-sm text-zinc-700`}>{item.formatted_address}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>


                    {/* Media upload  */}

                    <Text style={tw`text-lg font-bold mb-3`}>Media</Text>
                    {mediaItems.map((item) => (
                        <View
                            key={item.id}
                            style={tw`border border-zinc-200 rounded-xl p-3 mb-4`}
                        >
                            {/* Upload Button */}
                            <Text style={tw`text-zinc-500 mb-1`}>Upload Image</Text>

                            <TouchableOpacity
                                onPress={() => pickImageForItem(item.id)}
                                style={tw`border border-dashed border-zinc-300 rounded-lg h-40 justify-center items-center mb-3`}
                            >
                                {item.uri ? (
                                    <Image
                                        source={{ uri: item.uri }}
                                        style={tw`w-full h-full rounded-lg`}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <Text style={tw`text-zinc-400`}>
                                        Tap to upload image
                                    </Text>
                                )}
                            </TouchableOpacity>

                            {/* Image Name */}
                            <Text style={tw`text-zinc-500 mb-1`}>Image Name</Text>
                            <TextInput
                                value={item.name}
                                onChangeText={(text) => {
                                    const updated = mediaItems.map((m) =>
                                        m.id === item.id ? { ...m, name: text } : m
                                    );
                                    setMediaItems(updated);
                                }}
                                placeholder="Enter image name"
                                style={tw`border border-zinc-200 rounded-lg px-3 py-2 mb-3`}
                            />

                            {/* Remove */}
                            <TouchableOpacity
                                onPress={() =>
                                    setMediaItems(mediaItems.filter((m) => m.id !== item.id))
                                }
                                style={tw`items-end`}
                            >
                                <Text style={tw`text-red-500 font-semibold`}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    ))}

                    {/* Add New Media */}
                    <TouchableOpacity
                        onPress={addMediaField}
                        style={tw`bg-blue-500 py-3 rounded-xl items-center mb-6`}
                    >
                        <Text style={tw`text-white font-bold`}>+ Add Media</Text>
                    </TouchableOpacity>





                    {/* Submit */}
                    <TouchableOpacity
                        onPress={handleUpdate}
                        style={tw`bg-blue-600 py-4 rounded-xl`}
                    >
                        <Text style={tw`text-white text-center font-bold`}>
                            Submit Changes
                        </Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAwareScrollView>



            {/* Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                statusBarTranslucent
            >
                <View style={tw`flex-1 bg-black/40 justify-end mb-6 `}>

                    {/* Click outside */}
                    <TouchableOpacity
                        style={tw`flex-1`}
                        onPress={() => setModalVisible(false)}
                    />

                    {/* Bottom Sheet */}
                    <View style={tw`bg-white rounded-t-3xl p-5 max-h-[60%]`}>

                        <Text style={tw`text-lg font-bold mb-4`}>
                            Select {activeSelection.type}
                        </Text>

                        {/* ✅ Scroll added */}
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {activeSelection.options.map(opt => (
                                <TouchableOpacity
                                    key={opt}
                                    onPress={() => handleSelect(opt)}
                                    style={tw`py-4 border-b border-zinc-100`}
                                >
                                    <Text style={tw`text-base`}>{opt}</Text>
                                </TouchableOpacity>
                            ))}

                            {/* ✅ Cancel now visible */}
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={tw`mt-4 items-center pb-4`}
                            >
                                <Text style={tw`text-red-500 font-bold`}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default PropertyUpdate;