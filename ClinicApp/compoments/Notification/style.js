import { StyleSheet } from "react-native";

export default StyleSheet.create({
    subTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
        fontFamily: 'serif'
    },
    text: {
        fontFamily: 'serif',
        marginBottom: 5,
        fontSize: 16
    },
    content: {
        fontFamily: 'serif',
        fontWeight: '600',
        marginBottom: 7,
        fontSize: 18
    },
    notificationContainer: {
        padding: 10,
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 5,
        borderWidth: 1,
        
    },
    read: {
        backgroundColor: '#f0f0f0',
        borderColor: '#cccccc',
    },
    unread: {
        backgroundColor: '#fff',
        borderColor: '#835741',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    typeText: {
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: 'serif',

    },
    dateText: {
        fontSize: 12,
        color: '#999',
        fontFamily: 'serif',

    },
    contentText: {
        fontSize: 14,
        fontFamily: 'serif',

    },
    texContent: {
        marginRight: 50,
        fontFamily: 'serif',

    },
    tableHeader: {
        marginTop: 10,
        backgroundColor: '#ffffff',
        height: 50, 
        borderBlockColor: '#333',
        fontFamily: 'serif'
    
    },
    tableTitle1: {
        flex: 4,
        overflow: 'hidden',
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: 'serif'
    
    },
    tableTitle2: {
        flex: 2,
        overflow: 'hidden',
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: 'serif'
    
    },
    tableTitle3: {
        flex: 1,
        overflow: 'hidden',
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: 'serif'
    
    },
    tableRow: {
        backgroundColor: '#ffffff',
        height: 70,
    },
    tableCell1: {
        flex: 3,
        fontFamily: 'serif'
    },
    tableCell3: {
        flex: 1,
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
    closeButton1: {
        paddingVertical: 7,
        borderWidth: 2,
        borderColor: '#835741',
        borderRadius: 5,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
    },
    closeButtonText: {
        color: '#835741',
        fontSize: 15,
        fontWeight: 'bold',
        fontFamily: 'serif',
        textAlign: 'center',
        marginTop: 10
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
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu mờ
    },
    invoice: {
        borderColor: '#835741', 
        borderWidth: 1, 
        padding: 7, 
        borderRadius: 10, 
        marginTop: 8
    },
    invoiceContainer: { 
        flexDirection: 'row',  
        borderColor: '#835741', 
        borderWidth: 0.5, 
        padding: 7, 
        borderRadius: 10,
        marginBottom: 10
        
    },
    momo: {
        width: '100%',
        height: 70,
        borderWidth: 0.5,
        borderColor: '#835741',
        borderRadius: 10,
        marginBottom: 10
    },
    payment: {
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
    paymentText: {
        color: '#835741',
        textAlign: 'center',
        fontFamily: 'serif',
        fontSize: 17,
        fontWeight: '700'
    }
})