import { activeProfile, booking, bookingActive, inactiveDiscover, postActive, postIcon, profile, world } from '@/lib/icon';
import tw from '@/lib/tailwind';
import { Tabs, usePathname } from 'expo-router';
import { Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

export default function PropertyOwnerLayout() {
  const pathname = usePathname();

  // Reusable Pill-style Tab Icon component
  const TabIcon = ({ xml, active, label }: { xml: string, active: boolean, label: string }) => {
    return (
      <View
        style={[
          tw`flex-row items-center px-4 py-2 rounded-full`, // Increased horizontal padding
          active ? tw`bg-[#E6F1FB]` : tw`bg-transparent`
        ]}
      >
        <SvgXml
          xml={xml}
          width="24"
          height="24"
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
          paddingLeft: 7,
          paddingRight: 7,
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
            // Logic: It's active if it's the literal root OR if it's one of your sub-paths
            const isSubRoute =
              pathname.includes('/search') ||
              pathname.includes('/details') ||
              pathname.includes('/update');

            const isHomeActive = focused || isSubRoute;

            return (
              <TabIcon
                xml={isHomeActive ? world : inactiveDiscover}
                active={isHomeActive}
                label="Home"
              />
            );
          },
        }}
      />

      <Tabs.Screen
        name="post"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon xml={focused ? postActive : postIcon} active={focused} label="Post" />
          ),
        }}
      />

      <Tabs.Screen
        name="Bookings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon xml={focused ? bookingActive : booking} active={focused} label="Bookings" />
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

      {/* --- Hidden Routes --- */}
      <Tabs.Screen name="details/[id]" options={{ href: null }} />
      <Tabs.Screen name="update/[id]" options={{ href: null }} />
      <Tabs.Screen name="landloard-notification" options={{ href: null }} />
    </Tabs>
  );
}