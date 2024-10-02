import { StyleSheet } from "react-native";

export default StyleSheet.create({
    listContainer: {
      padding: 16,
    },
    reviewContainer: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      padding: 16,
      borderRadius: 8,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
      marginHorizontal: 16
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
  title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      marginTop: 25,
      textAlign: 'center',
      flex: 3,
      fontFamily: 'serif'
  },
  titleRating: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'serif'
  },
  createRating: {
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  reviewContent: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'serif'
  },
  rating: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  content: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'serif'
  },
  contentRole: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'serif',
    textAlign: 'center'
  },
  contentDate: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'serif'
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: '#8B4513',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    marginVertical:10,
    marginHorizontal: 2
  },
  
  input: {
    height: 100,
    borderColor: '#8B4513',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontFamily: 'serif'
  },
  button: {
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#835741',
    borderRadius: 5,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#835741',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'serif'
  },
    
});