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
    button1: {
        backgroundColor: '#8B4513',
        borderRadius: 5,
        padding: 12,
        width: '75%',
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: 7,
        marginBottom:30
    },
    button: {
        backgroundColor: '#8B4513',
        borderRadius: 5,
        padding: 12,
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
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 16,
    },
    header: {
        fontSize: 21,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        fontFamily: 'serif'

    },
    tabMenu: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    activeTab: {
        backgroundColor: '#FFEFD5',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    inactiveTab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    tabText: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'serif'

    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        // marginBottom: 16,
    },
    infoHeader: {
        fontSize: 19,
        fontWeight: 'bold',
        marginBottom: 16,
        fontFamily: 'serif'

    },
    infoHeader1: {
        fontSize: 19,
        fontWeight: 'bold',
        marginBottom: 16,
        fontFamily: 'serif',
        textAlign: 'center'

    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    label1: {
        fontWeight: 'bold',
        flex: 1,
        fontSize: 17,
        fontFamily: 'serif'

    },
    value: {
        flex: 2,
        fontSize: 16,
        fontFamily: 'serif'

    },
    linkedFacility: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    bonus: {
        fontFamily: 'serif', 
        marginBottom: 7, 
        marginTop: 7, 
        fontSize: 15
    },
    margin:{
        marginBottom: 20
    }
})