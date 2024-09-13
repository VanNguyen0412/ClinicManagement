import { StyleSheet } from "react-native";

export default StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
},
scrollContainer: {
    padding: 13,
    marginTop:10
},
title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 25,
    textAlign: 'center',
    flex: 3
},
subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
},
input: {
    borderWidth: 1,
    borderColor: '#8B4513',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
},
inputMedicine: {
    borderWidth: 1,
    borderColor: '#8B4513',
    borderRadius: 5,
    padding: 10,
    marginTop: 15,
},
button: {
    backgroundColor: '#8B4513',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
},
buttonRecord: {
    backgroundColor: '#9d7763',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    width: '60%',
    alignSelf:'center'
},
buttonText1: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
},
name: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '400',
    marginLeft: 15
},
containerRecord: {
    flex: 1,
    padding: 20,

},
titleRecord: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
},
recordCard: {
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#8B4513',
    borderRadius: 5,
    backgroundColor: '#FFF',
},
recordText: {
    fontSize: 16,
},
backButtonRecord: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#8B4513',
    borderRadius: 5,
    alignItems: 'center',
},
backButtonTextRecord: {
    color: '#FFF',
    fontWeight: 'bold',
},
infoText: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '400',
    marginLeft: 15
},
label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '600',
},
header: {
    height: 60,
    backgroundColor: '#FF6F00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
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
headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
},
profileContainer: {
    padding: 20,
    backgroundColor: '#fff',
},
avatar: {
    width: 110,
    height: 110,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 15,
},
doctorName: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
},
details: {
    marginTop: 10,
  },
detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
},
detailText: {
    marginLeft: 10,
    fontSize: 15,
},

sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
},

introduction: {
    marginBottom: 7,
},
toggleText: {
    color: '#8B4513',
    textAlign: 'center',
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
infoBox: {
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
    marginBottom:20,
    // marginTop:20
},
button1: {
    width: '48%',
    paddingVertical: 9,
    borderWidth: 2,
    borderColor: '#835741',
    borderRadius: 5,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
},
buttonText: {
    color: '#835741',
    fontSize: 15,
    fontWeight: 'bold',
},
ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
},
rating: {
    marginRight: 5,
},
reviewCount: {
    fontSize: 14,
    color: '#888',
},
iccon: {
    color:"#835741",
    marginTop:10
},
tableHeader: {
    marginTop: 10,
    backgroundColor: '#ffffff',
    height: 50, 
    borderBlockColor: '#333',
},
tableTitle1: {
    flex: 4,
    overflow: 'hidden',
    textAlign: 'center',
    fontWeight: 'bold',
},
tableTitle3: {
    flex: 1,
    overflow: 'hidden',
    textAlign: 'center',
    fontWeight: 'bold',
},
tableRow: {
    backgroundColor: '#ffffff',
    height: 70,
},
tableCell1: {
    flex: 3,
},
tableCell3: {
    flex: 1,
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
    textAlign: 'center'
},
modalText: {
    marginBottom: 5,
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
},
modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu mờ
},
addMedicineContainer: {
    marginTop: 20,
    marginBottom: 20,
},

addButton: {
    
    alignItems: 'center',
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: '#835741',
    borderRadius: 5,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
},
addButtonText: {
    color: 'white',
    fontWeight: 'bold',
},
dropdownContainer: {
    backgroundColor: '#ffffff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
},
marginMedicine: {
    marginTop: 15
},
iconContainer: {
    justifyContent: 'center'
},
});