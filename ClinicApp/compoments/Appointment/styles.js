import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
      flex: 1,
    //   backgroundColor: '#F5F5DC',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      marginTop: 25,
      textAlign: 'center',
      flex: 3
    },
    searchContainer: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#8B4513',
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
    },
    appointmentCard: {
      backgroundColor: '#FFF',
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#8B4513',
      
    },
    patientName: {
      fontWeight: 'bold',
      fontSize: 18,
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
    },
    dots: {
      fontSize: 18,
    },
    search: {
        paddingVertical: 12,
        borderWidth: 2,
        borderColor: '#835741',
        borderRadius: 5,
        // marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor : '#835741',
        padding: 5
        // width: '100%',
    },
    search1: {
      paddingVertical: 7,
      borderWidth: 2,
      borderColor: '#835741',
      borderRadius: 5,
      marginTop: 5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor : '#835741',
      padding: 5,
      width: '100%',

  },
    text: {
        color: '#ffeddc',
        fontSize: 14,
        fontWeight: 'bold',

    },
    text1: {
      color: '#ffeddc',
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center'
  },
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
});