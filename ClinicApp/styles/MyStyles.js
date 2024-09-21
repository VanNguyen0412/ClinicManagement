import { StyleSheet } from "react-native";

export default StyleSheet.create({
    headerList: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5,
        // marginTop: 30,
        padding: 10,
        paddingTop: 40,
        paddingBottom: 13,
        backgroundColor:'#ffeddc'
    },
    titleList: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'serif'
        // marginLeft: 75
    },
    bonusMore: {
        marginBottom: 30, 
        textAlign: 'center', 
        fontSize: 16, 
        marginTop: 5, 
        color: '#835741',
        fontFamily: 'serif'
    },
    closeButton: {
        paddingVertical: 12,
        borderWidth: 2,
        borderColor: '#835741',
        borderRadius: 5,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    closeButtonText: {
    color: '#835741',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'serif'
    },
    flex: {
        flexDirection: 'row'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền mờ
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 100,  // Kích thước logo
        height: 100,
        borderRadius: 75
    }
})