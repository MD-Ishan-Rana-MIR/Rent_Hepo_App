import tw from '@/lib/tailwind'
import React from 'react'
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native'

// প্রপসগুলো ডেসট্রাকচার করা হলো এবং ডিফল্ট ভ্যালু সেট করা হলো
const Button = ({
    text,
    handleContinueToDetails,
    color = "#0474DA",
    width = "full",
    font = "bold",
    paddingTopBottom = 16,
    rounded = "xl",
    isLoading = false,
    textSize
}) => {
    return (
        <TouchableOpacity
            onPress={handleContinueToDetails}
            disabled={isLoading}
            style={[
                tw`w-${width} rounded-${rounded}`, 
                { 
                    backgroundColor: color, 
                    paddingVertical: paddingTopBottom 
                }
            ]}
        >
            {isLoading ? (
                <ActivityIndicator color="white" />
            ) : (
                <Text style={tw`text-white text-center font-${font} text-${textSize} `}>{text}</Text>
            )}
        </TouchableOpacity>
    )
}

export default Button