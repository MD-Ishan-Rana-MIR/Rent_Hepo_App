import BookingModal from '@/app/components/BookingModal';
import PropertyDetailsSkeleton from '@/app/components/PropertyDetailsSkeleton';
import VirtualTour from '@/app/components/VirtualTour';
import { useSingleTenentPropertyQuery } from '@/app/redux/api/tanentDiscoverApi';
import tw from '@/lib/tailwind';
import { PropertyResponseType } from '@/lib/type';
import { imageUrl } from '@/lib/url';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { bookNow, callIcon, locationIcon, mapIcon } from './../../../lib/icon';

const { width, height } = Dimensions.get('window');

const PropertyDetails = () => {
  const { id } = useLocalSearchParams();


  const { data, isLoading } = useSingleTenentPropertyQuery(id);


  const singleProperty: PropertyResponseType = data?.data;







  const router = useRouter();

  // State for different viewing modes
  const [is360Visible, set360Visible] = useState(false);
  const [isImageViewerVisible, setImageViewerVisible] = useState(false);

  // Asset URLs


  const message = "Hi, I am interested in the Skyline Modern Villa.";

  const openWhatsApp = (whatsAppNumber: string) => {
    // Standard WhatsApp deep link
    const url = `whatsapp://send?phone=${whatsAppNumber}&text=${encodeURIComponent(message)}`;

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        // Fallback to web if WhatsApp isn't installed
        Linking.openURL(`https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(message)}`);
      }
    });
  };

  const makeCall = (phoneNumber: string) => {
    const url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert("Error", "Phone dialer is not available on this device.");
      }
    });
  };


  // Booking modal related 

  const [showTimeModal, setShowTimeModal] = useState(false);


  if (isLoading) {
    return (
      <PropertyDetailsSkeleton />
    )
  }

  const propertyImages = singleProperty?.property_images || [];

  console.log('is360Visible',is360Visible)

  const demoImages = [
    {
      path : "https://pannellum.org/images/alma.jpg"
    },
    {
      path : "https://pannellum.org/images/cerro-tolo-s.jpg"
    },
    {
      path : "https://pannellum.org/images/jure.jpg"
    }
  ];


  return (
    <View style={tw`flex-1 bg-white`}>
      <StatusBar barStyle="dark-content" />

      {/* --- 1. 360° VIRTUAL TOUR MODAL --- */}
      <Modal visible={is360Visible} animationType="slide" transparent={false}>
        <View style={tw`flex-1 bg-black`}>
          <SafeAreaView style={tw`absolute top-5 right-0 z-50`}>
            <TouchableOpacity
              onPress={() => set360Visible(false)}
              style={tw`bg-black/50 p-2 rounded-full flex justify-center `}
            >
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
          </SafeAreaView>

          <VirtualTour images={demoImages.map(img => `${img.path}`)} />

          <View style={tw`absolute bottom-10 w-full items-center`}>
            <Text style={tw`text-white/80 text-xs bg-black/60 px-5 py-2 rounded-full`}>
              Drag to explore 360°
            </Text>
          </View>
        </View>
      </Modal>

      {/* --- 2. IMAGE VIEWER MODAL (WEB FEEL) --- */}
      <Modal visible={isImageViewerVisible} transparent={true} animationType="fade">
        <View style={tw`flex-1 bg-black justify-center items-center`}>
          <TouchableOpacity
            style={tw`absolute top-12 right-6 z-50 p-2 bg-white/20 rounded-full  `}
            onPress={() => setImageViewerVisible(false)}
          >
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
          <Image source={{ uri: `${imageUrl}${singleProperty?.property_images[0].path}` }} style={{ width: width, height: height * 0.7 }} resizeMode="contain" />
        </View>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-32`}>
        {/* Header Image Section */}
        <View style={tw`relative w-full h-80`}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => setImageViewerVisible(true)}>
            <Image source={{ uri: `${imageUrl}${singleProperty?.property_images[0]?.path}` }} style={tw`w-full h-full`} resizeMode="cover" />
          </TouchableOpacity>

          {/* Back Button */}
          <View style={tw`absolute top-4 left-5`}>
            <TouchableOpacity onPress={() => router.back()} style={tw`bg-white/90 p-2 rounded-full shadow-md`}>
              <Ionicons name="arrow-back" size={24} color="#0474DA" />
            </TouchableOpacity>
          </View>

          {/* 360° Trigger Button */}
          <TouchableOpacity
            onPress={() => set360Visible(true)}
            style={tw`absolute bottom-5 left-5 bg-btnColor px-5 py-2.5 rounded-full flex-row items-center shadow-lg`}
          >
            <Ionicons name="sync-outline" size={20} color="white" />
            <Text style={tw`text-white font-bold ml-2`}>360° Tour</Text>
          </TouchableOpacity>
        </View>

        {/* --- CONTENT SECTION --- */}
        <View style={tw`px-5 pt-6`}>
          <View style={tw`flex-row justify-between items-start`}>
            <View style={tw`flex-1`}>
              <Text style={tw`font-normal text-textTwoXl text-bodyText `}>{singleProperty?.title}</Text>
              <View style={tw`flex-row items-center mt-1 gap-x-1 `} >
                <SvgXml xml={locationIcon} />
                <Text style={tw`text-zinc-400 `}>{singleProperty?.location}</Text>
              </View>
            </View>
            <View style={tw`items-end`}>
              <Text style={tw`text-2xl font-bold text-primaryText `}>${singleProperty?.price}</Text>
              <Text style={tw`text-green-500 text-xs font-medium`}>{singleProperty?.availability} Now</Text>
            </View>
          </View>

          <View style={tw`flex-row items-center justify-between mt-5`} >
            {/* Tags */}
            <View style={tw`flex-row gap-x-2.5 `}>
              <View style={tw`bg-[#E6F1FB] py-1.5 px-2.5 rounded-[10px] `}>
                <Text style={tw`text-primaryText font-medium text-[8px] `} >FOR {singleProperty?.purpose.toUpperCase()}</Text>
              </View>
              <View style={tw`bg-[#E8E8E8] py-1.5 px-2.5 rounded-[10px] `}>
                <Text style={tw`text-[#6B6B6B] font-medium text-[8px] `} >{singleProperty?.property_category.toUpperCase()}</Text>
              </View>
              <View style={tw`bg-[#FFE2C0] py-1.5 px-2.5 rounded-[10px] `}>
                <Text style={tw`text-[#FF8800] font-medium text-[8px] `} >{singleProperty?.total_area} SqFt</Text>
              </View>
            </View>

            {/* Map  */}

            <View>
              <TouchableOpacity onPress={() => {
                router.navigate({
                  pathname: '/(tenant-tab)/map/[id]',
                  params: { id: id }
                })
              }} style={tw`py-1.5 px-2 bg-btnColor rounded-[15px] flex-row  items-center gap-x-1`} >
                <SvgXml xml={mapIcon} />
                <Text style={tw`text-white font-medium text-[12px]`} >Map</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={tw`flex-row items-center mt-6 gap-x-2.5`} >
            <View>
              <Image
                // style={styles.stretch}
                style={tw`w-11 h-11 rounded-full  p-1 `}
                source={{ uri: `${singleProperty?.landlord?.avatar_url}` }}
              />
            </View>
            <View>
              <Text style={tw`border-bodyText font-normal`} >{singleProperty?.landlord?.name}</Text>
              <Text style={tw` text-bodyText text-small `} >{singleProperty?.landlord?.email}</Text>
            </View>
          </View>



          <Text style={tw` text-textLg  text-bodyText mt-2.5 mb-2.5  `}>About This Property</Text>
          <Text style={tw`text-[#545454] leading-6`}>
            {
              singleProperty?.description
            }
          </Text>

          <Text style={tw` text-bodyText font-medium text-textLg  mt-6 mb-5 `}>Prime Amenities</Text>
          <View style={tw`flex-row flex-wrap gap-3`}>
            {singleProperty?.amenities.map((item, index) => (
              <View key={index} style={tw`flex-row items-center bg-white border border-zinc-100 px-4 py-2.5 rounded-xl`}>
                <Ionicons name={"checkmark-circle-outline"} size={18} color="#0474DA" />
                <Text style={tw`ml-2 text-zinc-600 text-sm`}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Fixed Footer */}
      <View style={tw`absolute bottom-0 w-full bg-white border-t-2 border-[#E6E6E6] px-5 py-6 flex-row gap-x-3`}>
        {/* WhatsApp Button */}
        <TouchableOpacity
          onPress={() => { openWhatsApp(singleProperty?.landlord?.phone_number) }}
          style={tw`bg-[#00E676] flex-1 py-2.5 rounded-xl flex-row items-center justify-center`}
        >
          <Ionicons name="logo-whatsapp" size={16} color="white" />
          <Text style={tw`text-white font-bold ml-2`}>WhatsApp</Text>
        </TouchableOpacity>

        {/* Call Button */}
        <TouchableOpacity
          onPress={() => { makeCall(singleProperty?.landlord?.phone_number) }}
          style={tw`bg-white border border-zinc-100 flex-1 py-2.5 rounded-xl flex-row items-center justify-center`}
        >
          <SvgXml xml={callIcon} />
          <Text style={tw`text-[#545454] font-semibold text-xs ml-1`}>Call Owner</Text>
        </TouchableOpacity>

        {/* Book Now Button */}
        <TouchableOpacity
          onPress={() => setShowTimeModal(true)}
          style={tw`bg-[#0474DA] flex-1 py-2.5 rounded-xl flex-row items-center justify-center gap-x-1`}
        >
          <SvgXml xml={bookNow} />
          <Text style={tw`text-white font-semibold text-xs`}>Book Now</Text>
        </TouchableOpacity>

      </View>
      <BookingModal
      id = {id}
        showTimeModal={showTimeModal}
        onClose={() => setShowTimeModal(false)}
      />

    </View>

  );
}

export default PropertyDetails;