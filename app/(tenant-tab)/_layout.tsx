import { activeAi, activeBooking, activeProfile, ai, booking, inactiveDiscover, profile, world } from '@/lib/icon';
import tw from '@/lib/tailwind';
import { Tabs, usePathname } from 'expo-router';
import { Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';


export default function TannerLayout() {
  const pathname = usePathname();

  const TabIcon = ({ xml, active, label }: { xml: string, active: boolean, label: string }) => {
    return (
      <View
        style={[
          tw`flex-row items-center px-2 py-2 rounded-full`,
          active ? tw`bg-[#E6F1FB]` : tw`bg-transparent`
        ]}
      >
        <SvgXml
          xml={xml}
          width="26"
          height="26"
          fill={active ? "#0474DA" : "#ffffff"}
        />

        {active && (
          <Text
            numberOfLines={1}
            style={[
              tw`ml-2 font-bold text-sm text-[#0474DA]`,
              { flexShrink: 0 }
            ]}
          >
            {label}
          </Text>
        )}
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#0474DA",
          borderTopWidth: 0,
          elevation: 10,
          height: 60,
          paddingTop: 10,
          paddingLeft: 12,
          paddingRight: 12,
          // borderWidth : 2,
          // borderColor:"#000"
        },
        tabBarItemStyle: {
          flex: 1,
        },
        tabBarIconStyle: {
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => {
            const isDiscoverActive =
              focused ||
              pathname === "/" ||
              pathname.includes('/details') ||
              pathname.includes('map');

            return (
              <TabIcon
                xml={isDiscoverActive ? world : inactiveDiscover}
                active={isDiscoverActive}
                label="Discover"
              />
            );
          },
        }}
      />

      <Tabs.Screen
        name="AI-Assistant"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon xml={focused ? activeAi : ai} active={focused} label="AI Assistant" />
          ),
        }}
      />

      <Tabs.Screen
        name="tenant-booking"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon xml={focused ? activeBooking : booking} active={focused} label="Bookings" />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon xml={focused ? activeProfile : profile} active={focused} label="Profile" />
          ),
        }}
      />

      <Tabs.Screen name="details/[id]" options={{ href: null }} />
      <Tabs.Screen name="map/[id]" options={{ href: null }} />
    </Tabs>
  );
}