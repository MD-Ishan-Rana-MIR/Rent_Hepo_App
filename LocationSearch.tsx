import { LocationProps } from "@/src/lib/authType";
import axios from "axios";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import tw from "../../lib/tailwind";
import { errorMsg } from "./lib/errorMsg";

const Location = ({ setSelectedLocation, setAddress, isEmpty, address }: LocationProps) => {
    const [searchText, setSearchText] = useState("");
    const [locationSuggestions, setLocationSuggestions] = useState([]);

    useEffect(() => {
        setAddress(searchText);
        if (isEmpty) {
            setSearchText("");
        }
    }, [searchText, setAddress, isEmpty]);


    const handleSearchLocation = async (query: string) => {
        setSelectedLocation(null);
        setSearchText(query);

        // Stop search if query is empty or only spaces
        if (!query.trim()) {
            setLocationSuggestions([]);
            return;
        }

        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=`
            );
            setLocationSuggestions(response?.data?.results || []);
        } catch (error) {
            return errorMsg(error)
        }
    };


    return (
        <View style={tw`flex-1`}>


            <View>
                <Text style={tw`text-base text-[#000] font-montserrat-500 mb-2`}>
                    Address
                </Text>
                <View
                    style={tw`border border-gray/60 px-2 py-1 flex-row items-center rounded`}
                >
                    <TextInput
                        value={searchText}
                        onChangeText={handleSearchLocation}
                        placeholder={address || "Enter your address "}
                        placeholderTextColor="#3e3e3f"
                        style={tw`flex-1 h-12 mr-1`}
                    />
                </View>
            </View>

            {locationSuggestions.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => {
                        setSelectedLocation(item);
                        setSearchText(item?.name);
                        setLocationSuggestions([]);
                    }}
                >
                    <View style={tw`py-2 border-b border-gray`}>
                        <Text style={tw`font-montserrat-500  text-black`}>{item?.name}</Text>
                        <Text style={tw`text-gray`}>{item?.formatted_address}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default Location;
