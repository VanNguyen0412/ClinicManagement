import { StyleSheet } from "react-native";

export default StyleSheet.create({
    list: {
        marginBottom: 100,
        marginHorizontal: 3
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 15,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        marginHorizontal: 3,
        width: '48%',
        
    },
    image: {
        width: 150,
        height: 170,
        borderRadius: 8,
        marginBottom: 20,
        
    },
    details: {
        flex: 1,
        marginLeft: 10,
    },
    name: {
        fontSize: 15,
        fontWeight: '600',
        fontFamily: 'serif',

    },
    unit: {
        fontSize: 14,
        color: '#888',
        marginTop: 4,
        fontFamily: 'serif',

    },
    price: {
        fontSize: 14,
        color: '#8B4513',
        marginTop: 24,
        fontWeight: '500',
        fontFamily: 'serif',

    },
    type: {
        fontSize: 15,
        color: '#835741',
        marginLeft: 10,
        fontFamily: 'serif',

    },
    
    searchContainerList: {
        flexDirection: 'row',
        borderColor: '#835741',
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 5,
        marginHorizontal:10
    },
    searchInputList: {
        flex: 1,
        fontSize: 16,
        marginLeft: 8,
        fontFamily: 'serif',

    },
    margin: {
        flex: 1,
        padding: 13,
        backgroundColor: '#fff',
        borderColor:'#835741',
        borderWidth: 0.5,
        borderRadius: 3,
        marginBottom:10,
        marginTop: 10,
        width: '100%'
    },
    detailMedicine:{
        paddingHorizontal: 12
    },
    imageMedicineBorder:{
        borderRadius: 5, 
        borderWidth: 0.5, 
        borderColor: '#9ebdd5'
    },
    imageMedicine: {
        width: 300, 
        height: 250, 
        alignSelf: 'center', 
        borderRadius: 7, 
        marginTop: 40, 
        // marginBottom: 10
    },
    iso: {
        borderRadius: 2, 
        borderWidth: 0.5, 
        borderColor: '#9ebdd5'
    },
    isoText: {
        color:'blue', 
        backgroundColor:'#9ebdd5',
        fontFamily: 'serif',

    },
    medicineName: {
        fontSize: 19, 
        fontWeight: '700', 
        color:'gray', 
        fontFamily: 'serif',
        marginTop: 10
    },
    medicinePrice: {
        fontSize: 18, 
        fontFamily: 'serif', 
        color: '#5dafe0', 
        marginTop: 20, 
        marginBottom: 20
    },
    medicineType: {
        fontSize: 18, 
        fontWeight: 'bold', 
        marginBottom: 10, 
        fontFamily: 'serif'
    },
    descriptionMedicine: {
        fontFamily: 'serif', 
        fontSize: 16, 
        marginBottom: 7
    },
    headerDescription: {
        fontFamily: 'serif', 
        fontSize: 16, 
        marginBottom: 7, 
        fontWeight: '700'
    }
    
})