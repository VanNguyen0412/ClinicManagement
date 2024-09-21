import { StyleSheet } from "react-native";

export default StyleSheet.create({
    header1: {
        flexDirection: 'row', 
        justifyContent:'space-between',
        // marginTop: 30, 
        borderColor: '#ffeddc', 
        borderWidth: 1,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        padding: 10,
        backgroundColor: '#ffeddc',
        // borderRadius: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 25,
        textAlign: 'center',
        flex: 3,
        fontFamily: 'serif'

    },
    scrollContainer: {
        padding: 13,
        marginTop:10
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: '600',
        fontFamily: 'serif'

    },
    input: {
        borderWidth: 1,
        borderColor: '#8B4513',
        borderRadius: 5,
        marginTop: 7,
        padding: 10,
        marginBottom: 15,
        width: '95%',
        fontFamily: 'serif'

    },
    inputDate: {
        padding: 5,
        width: '85%',
        color: 'black'
    },
    option: {
        backgroundColor: '#fff',
        padding: 5,
        borderRadius: 5,
        width: '40%',
        alignItems: 'center',
        marginTop: 7,
        borderWidth: 1,
        borderColor: '#8B4513',
    },
    selected: {
        borderColor: '#007bff',
        backgroundColor: '#e7f0ff',
    },
    optionText: {
        fontSize: 18,
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
    fieldTextinput:{
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        borderWidth: 1,
        marginBottom: 15,
        marginTop: 7,
        borderColor: '#8B4513',
        padding: 5,
        width: '95%'
        
    },
})