import { StyleSheet } from "react-native";

export default StyleSheet.create({
container: {
    flex: 1, 
    backgroundColor: '#efeae4', 
    alignItems: 'center'
},
background: {
    width: '80%', 
    alignItems: 'center',
    marginTop: 20
},
fieldTextinput:{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
},
textInput: {
    flex: 1, 
    padding: 10, 
    fontSize: 16,
},
buttonLogin: { 
    color: '#835741',
    fontSize: 15,
    fontWeight: 'bold',
},
backgroundButton: {
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#835741',
    borderRadius: 5,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
},
linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
},
linkText: {
    color: '#ac6e37',
    fontSize: 14,
},
footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
},
footerText: {
    color: '#999',
    fontSize: 14,
},
margin: {
    marginRight: 15
},
avatarText: {
    color: '#ac6e37',
    fontSize: 15,
    margin: 10
},

registerText: {
    fontSize: 24, 
    color: '#8B4513',
    fontWeight: '600', 
    letterSpacing: 3, 
    textAlign: 'center', 
    fontFamily: 'serif', 
    paddingBottom: 20,
},
title: {
    fontSize: 60,
    fontFamily: 'serif', // Chọn font chữ có kiểu chữ nghiêng
    color: '#7d4b3a',
    fontStyle: 'italic',
    textAlign:'center',
    paddingBottom: 20,
    paddingTop: 10
},
infoText: {
    fontSize: 15, 
    color: '#9d7763',
    fontWeight: '400', 
    letterSpacing: 3, 
    textAlign: 'center', 
    fontFamily: 'serif', 
    paddingBottom: 10,
},
});