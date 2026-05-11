import tw from '@/lib/tailwind';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StatusBar, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const DATA = [
  {
    id: '1',
    title: 'Find Your Dream Home',
    description: 'Explore a curated list of premium properties in your favorite locations.',
    image: require('../../assets/images/app.logo.png'),
  },
  {
    id: '2',
    title: 'Smart Management',
    description: 'Manage tenants, maintenance, and payments with our intuitive dashboard.',
    image: require('../../assets/images/app.logo.png'),
  },
  {
    id: '3',
    title: 'Secure Operations',
    description: 'Your data is protected with industry-leading security and encryption.',
    image: require('../../assets/images/app.logo.png'),
  },
];

const SplashScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const handlePress = () => {
    if (activeIndex < DATA.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
    } else {
      router.push("/(auth)");
    }
  };

  return (
    <View style={tw`flex-1 bg-blackBg px-4`}>
      <StatusBar barStyle="light-content" />

      {/* --- HEADER --- */}
      {/* <View style={tw``}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color={tw.color('primaryText')} />
        </TouchableOpacity>
      </View> */}

      {/* --- SLIDER SECTION --- */}
      {/* Note: No px-4 on the FlatList container itself, 
          otherwise paging will be off-center 
      */}
      <FlatList
        ref={flatListRef}
        data={DATA}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          /* Using width and flex-1 to occupy all middle space */
          <View style={[tw`items-center justify-center px-10`, { width: width - 32 }]}>
            <View style={tw`w-32 h-32 rounded-3xl items-center justify-center  mb-10`}>
              <Image source={item.image} style={tw`w-40 h-40 mb-12 `} resizeMode="contain" />
            </View>
            <Text style={tw`text-primaryText text-[28px] font-bold text-center mb-4`}>{item.title}</Text>
            <Text style={tw` text-[#0474DA] font-light text-textLg  text-center `}>{item.description}</Text>
          </View>
        )}
      />

      {/* --- BOTTOM CONTROLS --- */}
      <View style={tw`pb-10`}>
        <View style={tw`flex-row justify-center mb-10`}>
          {DATA.map((_, index) => (
            <View
              key={index}
              style={tw`h-2 rounded-full mx-1 ${index === activeIndex ? 'w-8 bg-btnColor' : 'w-2 bg-optinalColor/60'
                }`}
            />
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePress}
          style={tw`bg-btnColor h-16 rounded-2xl items-center justify-center`}
        >
          <Text style={tw`text-secondery text-lg font-bold`}>
            {activeIndex === DATA.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>

        {activeIndex < DATA.length - 1 && (
          <TouchableOpacity
            style={tw`mt-4`}
            onPress={() => router.push('/(auth)')}
          >
            <Text style={tw`text-primaryText/60 text-center font-medium`}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SplashScreen;