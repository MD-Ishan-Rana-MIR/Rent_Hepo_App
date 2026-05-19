import tw from '@/lib/tailwind';
import React, { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

interface VirtualTourProps {
    images: string[];
}

const VirtualTour = ({ images }: VirtualTourProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const html = useMemo(() => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"/>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css"/>
        <script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"></script>
        <style>
            html, body { margin:0; padding:0; width:100%; height:100%; overflow:hidden; background-color: #000; }
            #panorama { width:100vw; height:100vh; }
            /* প্রি-লোডার হাইড করার জন্য প্যানেলামের ডিফল্ট স্টাইল ওভাররাইড */
            .pnlm-load-box { display: none !important; } 
        </style>
    </head>
    <body>
        <div id="panorama"></div>
        <script>
            try {
                const viewer = pannellum.viewer('panorama', {
                    type: 'equirectangular',
                    panorama: "${images[currentIndex]}",
                    autoLoad: true,
                    showControls: true,
                    mouseZoom: true,
                    friction: 0.1,
                    crossOrigin: "Chapplus" // সার্ভারে CORS থাকলে এটি কাজ করবে
                });

                viewer.on('load', function () {
                    window.ReactNativeWebView.postMessage('loaded');
                });

                viewer.on('error', function (err) {
                    window.ReactNativeWebView.postMessage('error: ' + err);
                });
            } catch (e) {
                window.ReactNativeWebView.postMessage('exception: ' + e.message);
            }
        </script>
    </body>
    </html>
    `, [currentIndex, images]);

    return (
        <SafeAreaView style={tw`flex-1 bg-black`}>
            <View style={tw`flex-1`}>
                <WebView
                    key={currentIndex}
                    originWhitelist={['*']}
                    source={{
                        html: html,
                        baseUrl: 'https://api.renthapo.com'
                    }}
                    style={tw`flex-1`}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    allowsInlineMediaPlayback={true}
                    mixedContentMode="always"
                    allowFileAccess={true}
                    allowUniversalAccessFromFileURLs={true}
                    scrollEnabled={false}
                    onMessage={(event) => {
                        const msg = event.nativeEvent.data;
                        if (msg === 'loaded' || msg.startsWith('error') || msg.startsWith('exception')) {
                            setLoading(false);
                        }
                    }}
                />

                {/* কাস্টম লোডার */}
                {loading && (
                    <View style={tw`absolute inset-0 items-center justify-center bg-black`}>
                        <ActivityIndicator size="large" color="#0474DA" />
                    </View>
                )}
            </View>

            {/* থাম্বনেইল লিস্ট */}
            <View style={tw`absolute bottom-5 w-full`}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={tw`px-4 gap-x-3`}
                >
                    {images.map((img, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                if (currentIndex !== index) {
                                    setLoading(true);
                                    setCurrentIndex(index);
                                }
                            }}
                            activeOpacity={0.7}
                            style={tw`
                                rounded-xl
                                overflow-hidden
                                border-2
                                ${currentIndex === index ? 'border-[#0474DA]' : 'border-gray-600'}
                            `}
                        >
                            <Image
                                source={{ uri: img }}
                                style={tw`w-16 h-16`}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default VirtualTour;