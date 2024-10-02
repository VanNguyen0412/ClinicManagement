import { StyleSheet } from "react-native";

export default StyleSheet.create({
    show: {
        borderWidth: 1,
        borderColor: '#835741',
        paddingVertical: 20,
        width: '30%',
        // borderRadius: 150,
        alignSelf: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#8B4513',
        borderRadius: 5,
        marginTop: 7,
        padding: 7,
        marginBottom: 15,
        width: '98%',
        fontFamily: 'serif'

    },
    button: {
        backgroundColor: '#8B4513',
        borderRadius: 5,
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText1: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 15,
        fontFamily: 'serif'

    },
    day: {
        marginBottom: 5,
        fontFamily: 'serif',
        fontSize: 17,
        fontWeight: '700'
    },
    container: {
        flex: 1,
        justifyContent: 'flex-end', // Align content to bottom
        alignItems: 'flex-end', // Align content to right
        padding: 20, // Add padding so it's not too close to the screen edges
    },
    plusButton: {
        backgroundColor: "#835741", // Optional: Set a background color for the button
        borderRadius: 50,  // Optional: To make the button rounder
        padding: 10,  // Optional: Padding around the icon
        elevation: 5,  // Optional: Add some shadow (only for Android)
        shadowColor: "#000",  // Optional: Shadow for iOS
        shadowOffset: { width: 0, height: 2 },  // Optional: Shadow for iOS
        shadowOpacity: 0.3,  // Optional: Shadow for iOS
        shadowRadius: 3,
        borderWidth: 1,
        borderColor: '#835741'
    },
    content: {
        fontFamily: 'serif',
        fontSize: 15,
        marginTop: 10
    },
    contentAdd: {
        fontFamily: 'serif',
        fontSize: 15,
        marginTop: 10,
        textAlign: 'center',
        fontWeight: '700'
    }
})