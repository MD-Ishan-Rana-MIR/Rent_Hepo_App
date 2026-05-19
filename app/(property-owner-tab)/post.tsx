import { errorMsg } from '@/lib/errorMsg';
import { successMsg } from '@/lib/successMsg';
import tw from '@/lib/tailwind';
import { Currency } from '@/lib/type';
import { Feather, Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import {
    ActivityIndicator,
    Image,
    Modal,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SelectDropdown from 'react-native-select-dropdown';
import * as z from 'zod';
import { useGetAllCurrenciesQuery } from '../redux/api/aiApi';
import { useTanentPropertyPostMutation } from '../redux/api/landloardBookingApi';



const propertySchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Please provide a more detailed description"),
    amenities: z.array(z.string()).min(1, "At least one amenity is required"),
    total_area: z.string().refine((val) => !isNaN(Number(val)), "Area must be a number"),
    price: z.string().min(1, "Price is required"),
    location: z.string().min(3, "Location is required"),
    availability: z.string(),
    purpose: z.string(),
    property_category: z.string(),
    city: z.string(),
    // code: z.string().min(1, "Currency code is required"),
    // symbol: z.string().min(1, "Currency symbol is required"),
    property_images: z.array(
        z.object({
            images_name: z.string().min(1),
            images: z.string().min(1),
        })
    )
});

export interface LocationData {
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
    };
}


const AddProperty = () => {
    const [location, setLocation] = useState<string>('');

    type PropertyFormData = z.infer<typeof propertySchema>;
    // 2. Initialize Hook Form
    const { control, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm<PropertyFormData>({
        resolver: zodResolver(propertySchema),
        defaultValues: {
            title: '',
            description: '',
            property_images: [{ images_name: '', images: '' }],
            amenities: [],
            total_area: '',
            price: '',
            location: '',
            availability: '',
            purpose: '',
            property_category: '',
            city: '',

        }
    });



    // --- State Management ---
    const [amenities, setAmenities] = useState<string[]>([]);

    const [isAddingAmenity, setIsAddingAmenity] = useState(false);
    const [newAmenity, setNewAmenity] = useState('');

    // Dropdown States
    const [availability, setAvailability] = useState("Available");
    const [purpose, setPurpose] = useState("Sale");
    const [category, setCategory] = useState("Residential");

    // Modal UI Control
    const [modalVisible, setModalVisible] = useState(false);

    const { fields, append, remove, update } = useFieldArray({ // এখানে 'update' যোগ করুন
        control,
        name: "property_images"
    });

    // --- Media Logic ---
    const pickImage = async (index: number) => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                const selectedUri = result.assets[0].uri;
                const currentData = getValues(`property_images.${index}`);

                update(index, {
                    ...currentData,
                    images: selectedUri
                });
            }
        } catch (error) {
            return errorMsg(error)
        }
    };

    useEffect(() => {
        setValue('amenities', amenities);
    }, [amenities, setValue]);

    const [activeSelection, setActiveSelection] = useState({
        type: '',
        options: [] as string[],
        onSelect: (val: string) => { }
    });

    const openDropdown = (type: string, options: string[], onSelect: (val: string) => void) => {
        setActiveSelection({
            type,
            options,
            onSelect
        });
        setModalVisible(true);
    };

    const handleSelectAvailability = (val: string) => {
        activeSelection.onSelect(val);

        if (activeSelection.type === 'Availability') setAvailability(val);
        if (activeSelection.type === 'Purpose') setPurpose(val);
        if (activeSelection.type === 'Category') setCategory(val);

        setModalVisible(false);
    };



    // --- Amenities Logic ---
    const handleAddAmenity = () => {
        if (newAmenity.trim()) {
            setAmenities([...amenities, newAmenity.trim()]);
            setNewAmenity('');
            setIsAddingAmenity(false);
        }
    };













    const [lat, setLat] = useState<number | null>(null);
    const [long, setLong] = useState<number | null>(null);
    const [userLocation, setUserLoc] = useState<LocationData | null>(null);

    const [suggestions, setSuggestions] = useState<any[]>([]);

    const handleLatLong = async (query: string) => {
        if (!query) return;

        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=AIzaSyDpXUCYWUfawKwLO0KlT0V9Y1t2DTBNx-A`
            );



            setSuggestions(response?.data?.results);
        } catch (error: any) {
            return errorMsg(error?.data?.message)
        }
    };

    useEffect(() => {
        if (userLocation) {
            setLat(userLocation.geometry.location.lat);
            setLong(userLocation.geometry.location.lng);
        }
    }, [userLocation]);



    //============================================== Currency Dropdown Logic=======================================================

    // const { data: currencies = [] } = useGetAllCurrenciesQuery();
    //     { label: "USD", value: "USD", symbol: "$" },
    //     { label: "EUR", value: "EUR", symbol: "€" },
    //     { label: "CAD", value: "CAD", symbol: "C$" },
    // ];

    const { data } = useGetAllCurrenciesQuery({});


    const allCurrencies: Currency[] = data?.data || [];


    const [code, setCode] = useState("USD");
    const [symbol, setSymbol] = useState("$");

    const [open, setOpen] = useState(false);








    const [tanentPropertyPost, { isLoading }] = useTanentPropertyPostMutation()


    const onPostProperty = async (data: PropertyFormData) => {

        const formData = new FormData();


        try {

           

            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('total_area', data.total_area);
            formData.append('availability', data.availability);
            formData.append('purpose', data.purpose);
            formData.append('property_category', data.property_category);

            formData.append('price', data.price);

            formData.append('currency', code);
            formData.append('currency_symbol', symbol);
            formData.append('location', data.location);
            formData.append('city', data.city);

            amenities.forEach((item, index) => {
                formData.append(`amenities[${index}]`, item);
            });

            if (lat !== null && long !== null) {
                formData.append('lat', String(lat));
                formData.append('long', String(long));
            }

            const images = getValues('property_images');

            images.forEach((item) => {
                if (!item?.images) return;

                formData.append('images_name[]', item.images_name || '');

                const uri = item.images;
                const filename = uri.split('/').pop() || 'photo.jpg';

                formData.append('images[]', {
                    uri,
                    name: filename,
                    type: 'image/jpeg',
                } as any);
            });

            const res = await tanentPropertyPost(formData).unwrap();

            if (res) {
                successMsg(res?.message);
                reset();
            }

        } catch (error: any) {
            
            return errorMsg(error?.data?.message);
        }
    };

    const Label = ({ children }: { children: string }) => (
        <Text style={tw`text-small font-medium text-[#545454] mb-4`}>{children}</Text>
    );


    return (
        <View style={tw` bg-white flex-1 `}>
            <StatusBar barStyle="dark-content" />
            <KeyboardAwareScrollView
                enableOnAndroid
                extraScrollHeight={80}
                keyboardShouldPersistTaps="handled"
                style={tw`flex-1`}
                contentContainerStyle={tw`flex-grow`}
                showsVerticalScrollIndicator={false}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`px-5`}>

                    <Text style={tw`text-textLg font-semibold text-bodyText mb-6`}>Basic Information</Text>

                    <Label>Property Title</Label>
                    <Controller
                        control={control}
                        name="title"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={tw`h-12 border ${errors.title ? 'border-red-500' : 'border-zinc-200'} rounded-lg px-4 bg-white mb-1 justify-center`}>
                                <TextInput
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="e.g. Modern Villa"
                                    style={tw`font-montserrat-400 text-sm`}
                                />
                            </View>
                        )}
                    />
                    {errors.title && <Text style={tw`text-red-500 text-xs mb-4`}>{errors.title.message}</Text>}

                    <Label>Description</Label>
                    <Controller
                        control={control}
                        name="description"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={tw`h-32 border ${errors.description ? 'border-red-500' : 'border-zinc-200'} rounded-lg px-4 py-3 bg-white mb-1`}>
                                <TextInput
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    multiline
                                    textAlignVertical="top"
                                    placeholder="Enter details..."
                                    style={tw`flex-1 font-montserrat-400 text-sm`}
                                />
                            </View>
                        )}
                    />
                    {errors.description && (
                        <Text style={tw`text-red-500 text-xs mb-6 mt-1`}>
                            {errors.description.message}
                        </Text>
                    )}

                    {/* SECTION: AMENITIES */}
                    <Text style={tw`text-bodyText text-textLg font-semibold mb-4`}>Amenities</Text>
                    <View style={tw`flex-row flex-wrap gap-2 mb-6`}>
                        {amenities.map((item, index) => (
                            <View
                                key={index}
                                style={tw`flex-row items-center border border-zinc-200 px-3 py-2 rounded-lg bg-zinc-50`}
                            >
                                <Text style={tw`text-xs font-montserrat-500 text-zinc-600 mr-2`}>{item}</Text>

                                {/* ক্লোজ বাটন */}
                                <TouchableOpacity
                                    onPress={() => setAmenities(amenities.filter((_, i) => i !== index))}
                                    style={tw`bg-zinc-200 rounded-full p-0.5`}
                                >
                                    <Ionicons name="close" size={14} color="#71717A" />
                                </TouchableOpacity>
                            </View>
                        ))}

                        {isAddingAmenity ? (
                            <View style={tw`flex-row items-center border border-blue-400 rounded-lg px-2 h-9`}>
                                <TextInput
                                    autoFocus
                                    value={newAmenity}
                                    onChangeText={setNewAmenity}
                                    onSubmitEditing={handleAddAmenity}
                                    placeholder="Add..."
                                    style={tw`text-xs w-20 text-black`}
                                />
                                <View style={tw`flex-row items-center gap-x-1`}>
                                    <TouchableOpacity onPress={handleAddAmenity}>
                                        <Ionicons name="checkmark-sharp" size={18} color="green" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setIsAddingAmenity(false)}>
                                        <Ionicons name="close-sharp" size={18} color="red" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <TouchableOpacity
                                onPress={() => setIsAddingAmenity(true)}
                                style={tw`w-9 h-9 items-center justify-center border border-zinc-200 rounded-lg bg-white`}
                            >
                                <Ionicons name="add" size={20} color="#71717A" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {errors.amenities && (
                        <Text style={tw`text-red-500 text-xs mt-1 mb-4`}>
                            {errors.amenities.message}
                        </Text>
                    )}

                    {/* Total Area Size (SqFt) */}

                    <Label>Total Area Size (SqFt)</Label>
                    <Controller
                        control={control}
                        name="total_area" // Zod schema-r sathe mil rekhe
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={tw`h-12 border ${errors.total_area ? 'border-red-500' : 'border-zinc-200'} rounded-lg px-4 bg-white mb-1 justify-center`}>
                                <TextInput
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    keyboardType="numeric"
                                    placeholder="e.g. 1200"
                                    style={tw`font-montserrat-400 text-sm`}
                                />
                            </View>
                        )}
                    />
                    {errors.total_area && (
                        <Text style={tw`text-red-500 text-xs mb-5 mt-1`}>
                            {errors.total_area.message}
                        </Text>
                    )}
                    {/* DROPDOWNS */}
                    {/* Availability */}
                    <View style={tw`mb-5`}>
                        <Label>Availability</Label>
                        <Controller
                            control={control}
                            name="availability"
                            render={({ field: { onChange, value } }) => (
                                <SelectDropdown
                                    data={['Available', 'NotAvailable']}
                                    onSelect={(selectedItem) => {
                                        onChange(selectedItem);
                                    }}
                                    defaultValue={value}
                                    renderButton={(selectedItem, isOpened) => (
                                        <View style={tw`h-12 border ${errors.availability ? 'border-red-500' : 'border-zinc-200'} rounded-lg px-4 flex-row items-center justify-between bg-white`}>
                                            <Text style={tw`font-montserrat-400 text-zinc-800`}>
                                                {selectedItem || "Select Availability"}
                                            </Text>
                                            <Ionicons
                                                name={isOpened ? 'chevron-up' : 'chevron-down'}
                                                size={18}
                                                color="gray"
                                            />
                                        </View>
                                    )}
                                    renderItem={(item, index, isSelected) => (
                                        <View style={tw`px-4 py-3 border-b border-zinc-100 ${isSelected ? 'bg-zinc-100' : ''}`}>
                                            <Text style={tw`text-base font-montserrat-400 text-zinc-800`}>{item}</Text>
                                        </View>
                                    )}
                                    dropdownStyle={tw`bg-white rounded-lg shadow-lg`}
                                />
                            )}
                        />
                        {errors.availability && (
                            <Text style={tw`text-red-500 text-xs mt-1`}>{errors.availability.message}</Text>
                        )}
                    </View>
                    <View style={tw`flex-row gap-x-4`}>
                        {/* Purpose */}
                        <View style={tw`flex-1`}>
                            <Label>Purpose</Label>
                            <Controller
                                control={control}
                                name="purpose"
                                render={({ field: { onChange, value } }) => (
                                    <View>
                                        <TouchableOpacity
                                            onPress={() => openDropdown('Purpose', ['Sale', 'Rent'], (val) => onChange(val))}
                                            style={tw`h-12 border ${errors.purpose ? 'border-red-500' : 'border-zinc-200'} rounded-lg px-4 flex-row items-center justify-between mb-1`}
                                        >
                                            <Text style={tw`font-montserrat-400 text-xs text-zinc-800`}>
                                                {value || "Select"}
                                            </Text>
                                            <Ionicons name="chevron-down" size={14} color="gray" />
                                        </TouchableOpacity>
                                        {errors.purpose && <Text style={tw`text-red-500 text-[10px] mb-4`}>{errors.purpose.message}</Text>}
                                    </View>
                                )}
                            />
                        </View>

                        {/* Property Category */}
                        <View style={tw`flex-1`}>
                            <Label>Property Category</Label>
                            <Controller
                                control={control}
                                name="property_category"
                                render={({ field: { onChange, value } }) => (
                                    <View>
                                        <TouchableOpacity
                                            onPress={() => openDropdown('Category', ['Residential', 'Commercial', 'Land'], (val) => onChange(val))}
                                            style={tw`h-12 border ${errors.property_category ? 'border-red-500' : 'border-zinc-200'} rounded-lg px-4 flex-row items-center justify-between mb-1`}
                                        >
                                            <Text style={tw`font-montserrat-400 text-xs text-zinc-800`}>
                                                {value || "Select"}
                                            </Text>
                                            <Ionicons name="chevron-down" size={14} color="gray" />
                                        </TouchableOpacity>
                                        {errors.property_category && <Text style={tw`text-red-500 text-[10px] mb-4`}>{errors.property_category.message}</Text>}
                                    </View>
                                )}
                            />
                        </View>
                    </View>


                    {/* City */}
                    <View style={tw`flex-1 mt-1 `}>
                        <Label>City</Label>

                        <Controller
                            control={control}
                            name="city"
                            render={({ field: { onChange, value } }) => (
                                <View>
                                    <TextInput
                                        placeholder="Enter city"
                                        value={value}
                                        onChangeText={onChange}
                                        style={tw`h-12 border ${errors.city ? "border-red-500" : "border-zinc-200"
                                            } rounded-lg px-4 mb-1 font-montserrat-400 text-xs text-zinc-800`}
                                        placeholderTextColor="gray"
                                    />

                                    {errors.city && (
                                        <Text style={tw`text-red-500 text-[10px] mb-4`}>
                                            {errors.city.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />
                    </View>

                    <View style={tw` mt-1`}>
                        {/* Price Field */}
                        <View style={tw`flex-1`}>
                            <Text style={tw`text-zinc-500 mb-2`}>Price {code} </Text>

                            <Controller
                                control={control}
                                name="price"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View>
                                        <View
                                            style={tw`flex-row items-center h-12 border ${errors.price ? "border-red-500" : "border-zinc-200"
                                                } rounded-lg bg-white px-3`}
                                        >
                                            {/* Price Input */}
                                            <TextInput
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                                placeholder="Enter Amount"
                                                placeholderTextColor="#A1A1AA"
                                                keyboardType="numeric"
                                                style={tw`flex-1 text-black`}
                                            />

                                            {/* Currency Button */}
                                            <TouchableOpacity
                                                onPress={() => setOpen(!open)}
                                                style={tw`flex-row items-center ml-2 px-2 py-1 bg-zinc-100 rounded-md`}
                                            >
                                                <Text style={tw`text-black font-medium`}>
                                                    {code}
                                                </Text>
                                                <Ionicons
                                                    name="chevron-down"
                                                    size={16}
                                                    color="black"
                                                />
                                            </TouchableOpacity>
                                        </View>

                                        {/* Error */}
                                        {errors.price && (
                                            <Text style={tw`text-red-500 text-[10px] mt-1`}>
                                                {errors.price.message}
                                            </Text>
                                        )}

                                        {/* Dropdown */}
                                        {open && (
                                            <View
                                                style={tw`absolute right-0 top-14 bg-white border border-zinc-200 rounded-lg shadow-md w-24 z-50`}
                                            >
                                                {allCurrencies.map((item) => (
                                                    <TouchableOpacity
                                                        key={item.code}
                                                        onPress={() => {
                                                            setCode(item.code);
                                                            setSymbol(item.symbol);
                                                            setOpen(false);
                                                        }}
                                                        style={tw`p-2 border-b border-zinc-100`}
                                                    >
                                                        <Text style={tw`text-black text-center`}>
                                                            {item.code}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                )}
                            />
                        </View>

                        {/* Location  */}

                        <View style={tw`flex-1 mt-3 `}>
                            <Label>Location</Label>
                            <Controller
                                control={control}
                                name="location"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View>
                                        <View style={tw`h-12 border ${errors.location ? 'border-red-500' : 'border-zinc-200'} rounded-lg px-4 bg-white mb-1 flex-row items-center justify-between`}>
                                            <TextInput
                                                onBlur={onBlur}
                                                onChangeText={(text) => {
                                                    onChange(text);
                                                    setLocation(text);
                                                    handleLatLong(text)
                                                }}
                                                value={location}
                                                placeholder="City, Area"
                                                placeholderTextColor="#A1A1AA"
                                                style={tw`flex-1 font-montserrat-400 text-sm text-black`}
                                            />
                                            <Ionicons name="location-sharp" size={18} color="black" />
                                        </View>
                                        {errors.location && (
                                            <Text style={tw`text-red-500 text-[10px] mb-4`}>
                                                {errors.location.message}
                                            </Text>
                                        )}
                                    </View>
                                )}
                            />
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


                                    setValue('location', formattedAddress, { shouldValidate: true });


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
                    {/* SECTION: MEDIA UPLOAD */}

                    <Text style={tw`text-textLg text-bodyText font-semibold mb-4`}>Media Upload</Text>

                    {fields.map((field, index) => (
                        <View key={field.id} style={tw`flex-row border ${errors.property_images?.[index] ? 'border-red-500' : 'border-zinc-200'} rounded-xl overflow-hidden mb-4 bg-white h-28`}>

                            {/* Media Name Input */}
                            <View style={tw`flex-1 p-4 justify-center`}>
                                <Text style={tw`text-[10px] font-bold text-blue-400 mb-2`}>MEDIA NAME</Text>
                                <Controller
                                    control={control}
                                    name={`property_images.${index}.images_name`}
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            placeholder="e.g. Front View"
                                            style={tw`h-9 border border-zinc-200 rounded-md px-2 text-xs`}
                                            value={value}
                                            onChangeText={onChange}
                                        />
                                    )}
                                />
                            </View>

                            {/* Image Picker Section */}
                            <TouchableOpacity
                                onPress={() => pickImage(index)}
                                style={tw`flex-1 bg-zinc-50 items-center justify-center border-l border-zinc-200`}
                            >
                                <Controller
                                    control={control}
                                    name={`property_images.${index}.images`}
                                    render={({ field: { value } }) => (
                                        value ? (
                                            <Image source={{ uri: value }} style={tw`w-full h-full`} resizeMode="cover" />
                                        ) : (
                                            <View style={tw`items-center`}>
                                                <Feather name="image" size={24} color="#A1A1AA" />
                                                <Text style={tw`text-[10px] text-zinc-400 mt-1`}>Select Image</Text>
                                            </View>
                                        )
                                    )}
                                />
                            </TouchableOpacity>

                            {/* Delete Button */}
                            {fields.length > 1 && (
                                <TouchableOpacity
                                    onPress={() => remove(index)}
                                    style={tw`absolute top-2 right-2 bg-red-500 rounded-full p-1 z-10`}
                                >
                                    <Ionicons name="close" size={14} color="white" />
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}

                    {/* Add Media Button */}
                    <TouchableOpacity
                        onPress={() => append({ images: '', images_name: '', })}
                        style={tw`items-center mb-8`}
                    >
                        <Ionicons name="add-circle-outline" size={32} color="#71717A" />
                    </TouchableOpacity>

                    <View style={tw`mb-10`} >

                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[
                                tw`bg-btnColor h-14 rounded-xl items-center justify-center mt-6 mb-10 shadow-sm`,
                                isLoading && tw`opacity-70`
                            ]}
                            onPress={handleSubmit(onPostProperty)}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={tw`text-white text-lg font-montserrat-600`}>Submit Property</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAwareScrollView>

            {/* Reusable Dropdown Modal */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={tw`flex-1 justify-end bg-black/40`}>
                    <View style={tw`bg-white rounded-t-3xl p-6`}>
                        <Text style={tw`text-lg font-montserrat-700 mb-4`}>Select {activeSelection.type}</Text>
                        {activeSelection.options.map((opt) => (
                            <TouchableOpacity
                                key={opt}
                                onPress={() => handleSelectAvailability(opt)}
                                style={tw`py-4 border-b border-zinc-100`}
                            >
                                <Text style={tw`text-base font-montserrat-400`}>{opt}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={tw`mt-5 items-center`}>
                            <Text style={tw`text-red-500 font-montserrat-600`}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default AddProperty;