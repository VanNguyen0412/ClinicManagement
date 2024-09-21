import { StyleSheet } from "react-native";

export default StyleSheet.create({
container: {
    flex: 1,
    padding: 20,   
},
username: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'serif'
},
email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    fontFamily: 'serif'
},
avatarContainer: {
    alignItems: 'center',
    marginBottom: 10,
},
avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
},
infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
},
infoBox: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
},
input: {
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5,
    fontFamily: 'serif'
},
iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
},
iconBox: {
    width: '33%',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
},
newsImageContainer: {
    marginBottom: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    alignItems: 'center',
},
newsText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'serif'
},
categoryText: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'serif'
    // marginRight: 30
},
categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap'
},
categoryBox: {
    width: '23%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
},
seeAll: {
    textAlign: 'center',
    // fontWeight: 'bold',
    color: '#007BFF',
    fontFamily: 'serif'
},
headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    marginTop: 20
},
leftArrow: {
    position: 'absolute',
    left: 10,
    top: '50%',
    zIndex: 1,
    transform: [{ translateY: -15 }],
},
imageBanner: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
},
rightArrow: {
    position: 'absolute',
    right: 10,
    top: '50%',
    zIndex: 1,
    transform: [{ translateY: -15 }],
},
indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // position: 'absolute',
    bottom: 20,
    width: '100%',
},
indicator: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginLeft: 7,
},
drugImage: {
    width: 100,
    height: 120,
    borderRadius: 5,
    marginBottom: 5,
},
drugName: {
    textAlign: 'center',
    fontFamily: 'serif'
},
medicineBox: {
    width: '48%',
    alignItems: 'center',
    padding: 5,
    paddingTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    marginRight: 3
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
modalPateint: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 300
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
createRecord: {
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#835741',
    borderRadius: 5,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
},
closeButtonText: {
    color: '#835741',
    fontSize: 15,
    fontWeight: 'bold',
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
margin: {
    flex: 1,
    padding: 13,
    backgroundColor: '#fff',
    borderColor:'#835741',
    borderWidth: 1,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    marginBottom:10,
    width: '50%'
},
});