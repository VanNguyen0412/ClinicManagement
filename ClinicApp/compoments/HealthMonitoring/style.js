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
        marginBottom: 10,
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
        justifyContent: 'flex-end', 
        alignItems: 'flex-end', 
        padding: 20,
    },
    containerAdd: {
        position: 'relative',
        // flex: 1,
        justifyContent: 'flex-end', 
        alignItems: 'flex-end', 
        marginRight: 10,
        marginBottom: 5,
        // padding: 20,
    },
    plusButton: {
        backgroundColor: "#835741", 
        borderRadius: 50,  
        padding: 10,  
        elevation: 5, 
        shadowColor: "#000",  
        shadowOffset: { width: 0, height: 2 },  
        shadowOpacity: 0.3,  
        shadowRadius: 3,
        borderWidth: 1,
        borderColor: '#835741'
    },
    addButton: {
        backgroundColor: "#e6c4a8", 
        borderRadius: 25,  
        elevation: 5,  
        shadowColor: "#000",  
        shadowOffset: { width: 0, height: 2 },  
        shadowOpacity: 0.3,  
        shadowRadius: 3,
        borderWidth: 1,
        borderColor: '#835741',
        padding: 10
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