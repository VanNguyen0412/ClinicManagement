import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        fontFamily: 'serif'

    },
    forumItem: {
        flex: 5,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 7,
        marginBottom: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
    },
    avatarContainer: {
        width: 80,
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        overflow: 'hidden',
        marginRight: 10,
    },
    avatarContainer1: {
        width: 300,
        height: 200,
        justifyContent: 'center',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#835741',
        borderRadius: 10,
        overflow: 'hidden',
        marginRight: 10,
    },
    avatarContainer2: {
        width: 65,
        height: 65,
        justifyContent: 'center',
        alignSelf: 'center',
        borderWidth: 0.5,
        borderColor: '#835741',
        borderRadius: 10,
        overflow: 'hidden',
        marginRight: 10,
    },
    avatar: {
        width: '100%',
        height: '100%',

    },
    avatar1: {
        width: '80%',
        height: '90%',
        borderRadius: 10,
        alignSelf: 'center'
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    patientName: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'serif'

    },
    titleText: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 5,
        fontFamily: 'serif'

    },
    moreText: {
        color: '#835741',
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 10,
        fontFamily: 'serif'

    },
    button: {
        backgroundColor: '#8B4513',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonRecord: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
        width: '60%',
        alignSelf: 'center',
        borderColor: '#835741',
        borderWidth: 0.5,

    },
    buttonText1: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 15,
        fontFamily: 'serif'
    },
    buttonText: {
        color: '#835741',
        fontWeight: 'bold',
        fontSize: 15,
        fontFamily: 'serif'
    },
    textCancel: {
        color: '#835741',
        fontWeight: 'bold',
        fontSize: 15,
        fontFamily: 'serif',
        textAlign: 'center',
        marginBottom: 7
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
        padding: 10,
        marginBottom: 15,
        fontFamily: 'serif',
    },
    textAvatar: {
        fontFamily: 'serif',
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 10,
        color: '#835741'
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        alignSelf: 'center',
        marginBottom: 7
    },
    textTittle: {
        fontFamily: 'serif',
        fontSize: 17,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 7
    },
    textTittleName: {
        fontFamily: 'serif',
        fontSize: 19,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 7
    },
    textCreated: {
        fontFamily: 'serif',
        textAlign: 'center',
        marginBottom: 17
    },
    answer: {
        flexDirection: 'row',
        borderWidth: 0.5,
        padding: 5,
        borderRadius: 6,
        borderColor: '#835741',
        marginBottom: 20
    },
    buttonCancel: {
        backgroundColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
        width: '30%',
        alignSelf: 'center',
        borderColor: '#835741',
        borderWidth: 0.5,
    },
});