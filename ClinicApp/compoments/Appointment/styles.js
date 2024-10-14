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
    flex: 3,
    fontFamily: 'serif'
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
    fontFamily: 'serif',
    marginBottom: 5
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  dots: {
    fontSize: 18,
    fontFamily: 'serif'
  },
  search: {
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#835741',
    borderRadius: 5,
    // marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#835741',
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
    backgroundColor: '#835741',
    padding: 5,
    width: '100%',

  },
  text: {
    color: '#ffeddc',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'serif'

  },
  text1: {
    color: '#ffeddc',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'serif'
  },
  header1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '600',
    fontFamily: 'serif'
  },
  fieldTextinput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 15,
    marginTop: 7,
    borderColor: '#8B4513',
    padding: 5,
    width: '100%'

  },
  inputDate: {
    padding: 5,
    width: '85%',
    color: 'black'
  },
  scrollContainer: {
    padding: 13,
    marginTop: 10
  },
  dropdownContainer: {
    // backgroundColor: '#ffffff',
    borderColor: '#8B4513',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    fontFamily: 'serif'
  },
  addMedicineContainer: {
    // marginTop: 5,
    marginBottom: 20,
  },
  margin: {
    marginTop: 20
  },
  iconContainer: {
    justifyContent: 'center'
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu mờ
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
    fontFamily: 'serif'
  },
  buttonRecord: {
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
  marginBottom: {
    marginBottom: 30
  }
});