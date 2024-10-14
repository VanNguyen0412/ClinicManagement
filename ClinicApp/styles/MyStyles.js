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
        backgroundColor: '#ffeddc'
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
    },
    invoiceButton: {
        borderWidth:0.5,
        padding: 7,
        borderColor: '#835741',
        borderRadius:10,
        marginBottom: 10,
        marginTop:7,
        width: '75%',
        alignSelf: 'center'
    },
    invoiceButtonText:{
        fontFamily: 'serif',
        color: '#835741',
        textAlign:'center',
        fontSize: 15
    },
    buttonRecord: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        // marginBottom: 10,
        width: '60%',
        alignSelf: 'center',
        borderColor: '#835741',
        borderWidth: 0.5,
    
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu mờ
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        marginTop: 190
    },
    modalImage: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'serif'
    },
    modalText: {
        marginBottom: 5,
        fontFamily: 'serif'
    },
    modalText1: {
        marginBottom: 5,
        fontSize: 16,
        fontFamily: 'serif'
    },
    quantityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    quantityText: {
        marginLeft: 10,
        marginRight: 10,
        fontFamily: 'serif'
    }
})