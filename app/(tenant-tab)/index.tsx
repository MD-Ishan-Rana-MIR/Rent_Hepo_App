/* eslint-disable react-hooks/exhaustive-deps */
import { errorMsg } from '@/lib/errorMsg';
import { star, threeMenu } from '@/lib/icon';
import tw from '@/lib/tailwind';
import { CurrencyType, Property } from '@/lib/type';
import { imageUrl } from '@/lib/url';
import { Ionicons } from '@expo/vector-icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

import { Picker } from "@react-native-picker/picker";

import axios from 'axios';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    Modal,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SvgXml } from "react-native-svg";
import { LocationData } from '../(property-owner-tab)/post';
import AiModal from '../components/AiModal';
import PropertySkeleton from '../components/PropertySkeleton';
import { useGetAllCurrenciesQuery } from '../redux/api/aiApi';
import { useGetNotificationsQuery } from '../redux/api/notificationApi';
import { useDiscoverPropertyQuery } from '../redux/api/tanentDiscoverApi';

const { width } = Dimensions.get('window');

export interface NotificationData {
    id: string;
    type: "App\\Notifications\\BookingRejectNotification" | "App\\Notifications\\BookingAcceptNotification";
    data: {
        title: string;
        body: string;
        booking_id: number;
        type: "success" | "danger" | "info" | "warning";
    };
    read_at: string | null;
    created_at: string;
}

const Home = () => {

    // map suggession 
    const [mapLat, setMapLat] = useState<number | null>(null);
    const [mapLng, setMapLng] = useState<number | null>(null);

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



    // get currency api 

    const { data: currencies } = useGetAllCurrenciesQuery(undefined);

    console.log("Currencies: ", currencies?.data);

    const currencyData: CurrencyType[] = currencies?.data || [];

    const [currency, setCurrency] = useState("$");



    // --- FILTER STATE ---
    const [filterLocation, setFilterLocation] = useState('');
    const [activePurpose, setActivePurpose] = useState('');
    const [activeCategory, setActiveCategory] = useState('');
    const [price, setPrice] = useState([0, 1000000]);
    const [area, setArea] = useState([0, 500]);
    const [filterRadius, setFilterRadius] = useState<number | string>(10);

    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [openAiModal, setOpenAiModal] = useState(false);
    const [active, setActive] = useState('All');


    const [appliedFilters, setAppliedFilters] = useState({
        location: '',
        purpose: '',
        property_category: 'All',
        price: [0, 1000000],
        area: [0, 500],
        radius: 10,
        lat: undefined as number | undefined,
        lng: undefined as number | undefined,
    });

    const categories = ['All', 'Residential', 'Commercial', 'Land'];
    const sliderWidth = width - 48;

    // ==================================== API ======================================
    const { data, isLoading } = useDiscoverPropertyQuery({
        search: filterLocation || undefined,
        location: appliedFilters.location || undefined,
        purpose: appliedFilters.purpose || undefined,
        property_category: appliedFilters.property_category !== 'All' ? appliedFilters.property_category : undefined,
        min_price: appliedFilters.price[0] || undefined,
        max_price: appliedFilters.price[1] || undefined,
        min_area: appliedFilters.area[0] || undefined,
        max_area: appliedFilters.area[1] || undefined,
        radius: appliedFilters.radius || appliedFilters?.location || appliedFilters?.lat || appliedFilters?.lng || appliedFilters?.location || undefined,
    });



    const PROPERTIES: Property[] = data?.data || [];

    const { data: notificationData } = useGetNotificationsQuery(1);
    const unReadNotification: NotificationData[] = notificationData?.data?.data || [];

    // Style Helpers
    const getPurposeStyle = (type: 'Sale' | 'Rent') =>
        activePurpose === type ? 'bg-btnColor' : 'bg-white border border-zinc-100';
    const getPurposeTextStyle = (type: 'Sale' | 'Rent') =>
        activePurpose === type ? 'text-white' : 'text-zinc-500';
    const getCategoryStyle = (type: 'Residential' | 'Commercial' | 'Land') =>
        activeCategory === type ? 'bg-btnColor' : 'bg-white border border-zinc-100';
    const getCategoryTextStyle = (type: 'Residential' | 'Commercial' | 'Land') =>
        activeCategory === type ? 'text-white' : 'text-zinc-500';

    // Client-side tab filter (fallback if API doesn't support category param)
    const filteredProperties = useMemo(() => {
        if (!PROPERTIES) return [];
        return PROPERTIES.filter((p) => {
            return active === 'All' || p.property_category === active;
        });
    }, [active, PROPERTIES]);

    // Sync modal state when opening
    useEffect(() => {
        if (modalVisible) {
            setFilterLocation(appliedFilters.location);
            setActivePurpose(appliedFilters.purpose);
            setActiveCategory(appliedFilters.property_category);
            setPrice(appliedFilters.price);
            setArea(appliedFilters.area);
            setFilterRadius(appliedFilters.radius);
        }
    }, [modalVisible]);

    const handleApplyFilters = () => {
        setAppliedFilters({
            location: filterLocation,
            purpose: activePurpose,
            property_category: activeCategory,
            price: price,
            area: area,
            radius: Number(filterRadius),
            lat: undefined as number | undefined,
            lng: undefined as number | undefined,
        });
        setModalVisible(false);
    };

    const handleClearFilters = () => {
        const defaultPrice = [0, 1000000];
        const defaultArea = [0, 500];

        setFilterLocation('');
        setActivePurpose('');
        setActiveCategory('');
        setFilterRadius(10);
        setPrice(defaultPrice);
        setArea(defaultArea);
        setActive('All');

        setAppliedFilters({
            location: '',
            purpose: '',
            property_category: 'All',
            price: defaultPrice,
            area: defaultArea,
            radius: 10,
            lat: undefined as number | undefined,
            lng: undefined as number | undefined,
        });
        setModalVisible(false);
    };

    const renderPropertyCard = ({ item }: { item: Property }) => (
        <TouchableOpacity
            onPress={() =>
                router.navigate({
                    pathname: '/(tenant-tab)/details/[id]',
                    params: { id: item.id }
                })
            }
            activeOpacity={0.9}
            style={tw`bg-white border border-zinc-100 rounded-[24px] mb-5 overflow-hidden shadow-sm`}
        >
            <Image
                source={{ uri: `${imageUrl}${item?.property_images[0]?.path}` }}
                style={tw`w-full h-48`}
                resizeMode="cover"
            />
            <View style={tw`px-4 mt-7 pb-6`}>
                <View style={tw`flex-row gap-x-2.5 mb-5`}>
                    <View style={tw`bg-[#24D7001A] py-1 px-3 flex-row items-center gap-x-3 rounded-[10px]`}>
                        <Text style={tw`w-2 h-2 bg-[#24D700] rounded-full`} />
                        <Text style={tw`text-[#24D700] font-medium text-xs`}>{item?.availability}</Text>
                    </View>
                    <View style={tw`bg-[#E6F1FB] py-1 px-3 flex-row items-center gap-x-3 rounded-[10px]`}>
                        <Text style={tw`text-primaryText font-medium text-xs`}>For {item?.purpose}</Text>
                    </View>
                    <View style={tw`bg-[#E8E8E8] py-1 px-3 flex-row items-center gap-x-3 rounded-[10px]`}>
                        <Text style={tw`text-[#6B6B6B] font-medium text-xs`}>{item?.property_category}</Text>
                    </View>
                </View>
                <View style={tw`flex flex-row items-center justify-between`}>
                    <Text style={tw`flex-1 text-textLg font-medium text-[#333] mr-2`} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <View style={tw`bg-btnColor rounded-[24px] px-2.5 py-1.5`}>
                        <Text style={tw`text-white text-xs`}>Available</Text>
                    </View>
                </View>
                <Text style={tw`text-zinkText text-small mt-2.5`}>{item.location}</Text>
                <Text style={tw`text-primaryText font-semibold text-textLg mt-5`}>{item?.currency_symbol} {item.price?.toLocaleString()}</Text>
            </View>
        </TouchableOpacity>
    );

    if (isLoading) {
        return <PropertySkeleton />;
    }

    return (
        <View style={tw`flex-1 bg-blackBg`}>
            <StatusBar barStyle="dark-content" />

            <View style={tw`px-5 flex-1`}>

                {/* Header */}
                <View style={tw`flex-row items-center justify-between mb-5 mt-1`}>
                    <Text style={tw`text-2xl font-normal text-[#333333]`}>Explore Properties</Text>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => router.push("/components/notification/TanentNotification")}
                        style={tw`p-2.5 bg-white border border-zinc-100 rounded-full shadow-sm relative`}
                    >
                        <Ionicons name="notifications-outline" size={24} color="#333333" />
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

                {/* Search Bar */}
                <View style={tw`flex-row items-center gap-x-2 mb-5`}>
                    <TouchableOpacity
                        onPress={() => { router.push("/components/MapViewDetails") }}
                        style={tw`flex-row flex-1 items-center bg-zinc-50 border border-zinc-100 h-13 rounded-2xl px-4`}
                    >
                        <Ionicons name="search-outline" size={20} color="#999" />

                        <Text style={tw`flex-1 ml-3 text-zinc-400`}>
                            Search map...
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setOpenAiModal(true)}
                        style={tw`border border-zinc-100 w-13 h-13 rounded-2xl items-center justify-center`}
                    >
                        <SvgXml xml={star} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={tw`bg-btnColor w-13 h-13 rounded-2xl items-center justify-center`}
                    >
                        <SvgXml xml={threeMenu} />
                    </TouchableOpacity>
                </View>

                {/* Category Tabs */}
                <View style={tw`mt-4`}>
                    <View style={tw`flex-row gap-x-2 mb-5`}>
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                onPress={() => setActive(cat)}
                                style={tw`flex-1 py-3 rounded-xl border ${active === cat ? 'bg-[#0474DA] border-[#0474DA]' : 'bg-white border-zinc-100'}`}
                            >
                                <Text style={tw`text-center text-xs font-medium ${active === cat ? 'text-white' : 'text-[#8A8A8A]'}`}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Property List */}
                <FlatList
                    data={filteredProperties}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderPropertyCard}
                    ListEmptyComponent={
                        <View style={tw`flex-1 items-center justify-center mt-20`}>
                            <Text style={tw`text-zinc-400 text-base font-medium`}>
                                No properties found 😕
                            </Text>
                        </View>
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={tw`pb-10`}
                />
            </View>

            {/* Filters Modal */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={tw`flex-1 justify-end bg-black/40`}>
                    <View style={tw`bg-white rounded-t-[36px] p-6 pb-10`}>

                        {/* Modal Header */}
                        <View style={tw`flex-row items-center justify-between mb-6`}>
                            <Text style={tw`text-2xl font-bold text-black`}>Filters</Text>
                            <TouchableOpacity onPress={handleClearFilters} style={tw`px-3 py-1`}>
                                <Text style={tw`text-sm text-red-500 font-medium`}>Clear</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={tw`bg-black/5 rounded-full p-1`}>
                                <Ionicons name="close" size={22} color="black" />
                            </TouchableOpacity>
                        </View>

                        <View style={tw`relative mb-5`}>

                            {/* Label */}
                            <Text style={tw`text-zinc-500 mb-2`}>
                                Location Area
                            </Text>

                            {/* Input  */}

                            <TextInput
                                value={filterLocation}
                                onChangeText={(text) => {
                                    setFilterLocation(text);
                                    setSearchQuery(text);
                                    handleLatLong(text); // ✅ correct
                                }}
                                placeholder="Enter location city or title"
                                placeholderTextColor="#aaa"
                                style={tw`border border-zinc-100 rounded-xl px-4 py-3.5 text-black`}
                            />
                            {/* Suggestions */}
                            {suggestions.length > 0 && (
                                <View
                                    style={tw`absolute top-20 left-0 right-0 bg-white rounded-xl shadow-md z-50`}
                                >
                                    {suggestions.map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => {
                                                const lat = item.geometry.location.lat;
                                                const lng = item.geometry.location.lng;

                                                setMapLat(lat);
                                                setMapLng(lng);

                                                setFilterLocation(item.formatted_address);
                                                setSuggestions([]);
                                            }}
                                            style={tw`p-3 border-b border-zinc-100`}
                                        >
                                            <Text style={tw`text-zinc-700`}>
                                                {item.formatted_address}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        {/* Radius */}
                        <Text style={tw`text-zinc-500 mb-2`}>Radius (km)</Text>
                        <TextInput
                            value={String(filterRadius)}
                            onChangeText={setFilterRadius}
                            keyboardType="numeric"
                            placeholder="e.g. 10"
                            placeholderTextColor="#aaa"
                            style={tw`border border-zinc-100 rounded-xl px-4 py-3.5 mb-5 text-black`}
                        />

                        {/* Purpose */}
                        <Text style={tw`text-zinc-500 mb-2`}>Purpose</Text>
                        <View style={tw`flex-row gap-x-3 mb-5`}>
                            <TouchableOpacity
                                onPress={() => setActivePurpose(activePurpose === 'Sale' ? '' : 'Sale')}
                                style={tw`w-32 h-12 rounded-xl justify-center items-center ${getPurposeStyle('Sale')}`}
                            >
                                <Text style={tw`font-medium text-sm ${getPurposeTextStyle('Sale')}`}>For Sale</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setActivePurpose(activePurpose === 'Rent' ? '' : 'Rent')}
                                style={tw`w-32 h-12 rounded-xl justify-center items-center ${getPurposeStyle('Rent')}`}
                            >
                                <Text style={tw`font-medium text-sm ${getPurposeTextStyle('Rent')}`}>For Rent</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Category */}
                        <Text style={tw`text-zinc-500 mb-2`}>Property Category</Text>
                        <View style={tw`flex-row flex-wrap gap-3 mb-6`}>
                            {['Residential', 'Commercial', 'Land'].map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    onPress={() => setActiveCategory(activeCategory === cat ? '' : cat as any)}
                                    style={tw`px-5 py-3 rounded-xl ${getCategoryStyle(cat as any)}`}
                                >
                                    <Text style={tw`text-sm ${getCategoryTextStyle(cat as any)}`}>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Price Range */}
                        <View style={tw`mb-6`}>
                            <View style={tw`flex-row items-center justify-between mb-3`}>
                                <Text style={tw`text-zinc-500 font-medium`}>Price Range</Text>

                                <View
                                    style={tw`border border-zinc-200 rounded-lg overflow-hidden bg-white`}
                                >
                                    <Picker
                                        selectedValue={currency}
                                        onValueChange={(value) => setCurrency(value)}
                                        style={{ width: 120, height: 40 }}
                                    >
                                        <Picker.Item
                                            label="Select"
                                            // value={}
                                            enabled={false}
                                            color="#9CA3AF"
                                        />

                                        {currencyData.map((curr) => (
                                            <Picker.Item
                                                key={curr.code}
                                                label={`${curr.symbol}`}
                                                value={curr.symbol}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                            </View>

                            <View style={tw`flex-row justify-between mb-2`}>
                                <Text style={tw`text-btnColor font-semibold`}>
                                    Min: {currency}
                                    {price[0].toLocaleString()}
                                </Text>

                                <Text style={tw`text-btnColor font-semibold`}>
                                    Max: {currency}
                                    {price[1].toLocaleString()}
                                </Text>
                            </View>

                            <MultiSlider
                                values={[price[0], price[1]]}
                                sliderLength={sliderWidth}
                                onValuesChange={(values) => setPrice(values)}
                                min={10}
                                max={1000000}
                                step={1000}
                                selectedStyle={tw`bg-btnColor h-1`}
                                unselectedStyle={tw`bg-zinc-100 h-1`}
                                markerStyle={tw`bg-btnColor h-5 w-5 border-2 border-white shadow-sm mt-1`}
                                pressedMarkerStyle={tw`bg-btnColor h-6 w-6`}
                                snapped
                            />

                            <View style={tw`flex-row justify-between -mt-2`}>
                                <Text style={tw`text-zinc-400 text-xs`}>
                                    {currency}10
                                </Text>

                                <Text style={tw`text-zinc-400 text-xs`}>
                                    {currency}1,000,000
                                </Text>
                            </View>
                        </View>

                        {/* Area Range */}
                        <View style={tw`mb-10`}>
                            <View style={tw`flex-row items-center justify-between mb-1`}>
                                <Text style={tw`text-zinc-500`}>Area Range</Text>
                                <Text style={tw`text-btnColor font-semibold`}>{area[1]} km</Text>
                            </View>
                            <MultiSlider
                                values={[area[0], area[1]]}
                                sliderLength={sliderWidth}
                                onValuesChange={(values) => setArea(values)}
                                min={1}
                                max={500}
                                step={1}
                                selectedStyle={tw`bg-btnColor h-1`}
                                unselectedStyle={tw`bg-zinc-100 h-1`}
                                markerStyle={tw`bg-btnColor h-5 w-5 border-2 border-white shadow-sm mt-1`}
                                pressedMarkerStyle={tw`bg-btnColor h-6 w-6`}
                            />
                            <View style={tw`flex-row justify-between -mt-2`}>
                                <Text style={tw`text-zinc-400 text-xs`}>1 km</Text>
                                <Text style={tw`text-zinc-400 text-xs`}>500 km</Text>
                            </View>
                        </View>

                        {/* Apply Button */}
                        <TouchableOpacity
                            onPress={handleApplyFilters}
                            style={tw`bg-btnColor w-full h-14 rounded-2xl items-center justify-center`}
                        >
                            <Text style={tw`text-white text-base font-bold`}>Apply</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>

            {/* AI Assistant Modal */}
            <AiModal openAiModal={openAiModal} setOpenAiModal={setOpenAiModal} />

        </View>
    );
};

export default Home;