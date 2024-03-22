import { initializeApp } from "firebase/app"; 
import { getMessaging,getToken } from "firebase/messaging";
const firebaseConfig = {
  apiKey: "AIzaSyCTh2ium3O7mD_mR2HJXhKxBXfzKBT1OKI",
  authDomain: "tooth-fairy-428ed.firebaseapp.com",
 projectId: "tooth-fairy-428ed",
  storageBucket: "tooth-fairy-428ed.appspot.com",
  messagingSenderId: "958748499327",
  appId: "1:958748499327:web:c8bc1f12b9491fda574e4a"
};

function requestPermission() {
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');}
      })}


// Initialize Firebase
const fireBaseApp = initializeApp(firebaseConfig);
 const fbMessaging =getMessaging(fireBaseApp);
 export const initializeToken= ()=>{
getToken(fbMessaging, { vapidKey: 'BH-gwuwO-XJ-V1d5T3eGCZe2TEZfUE4OFvHk3kzzrelzdEZgG3D-uAlyZOiVUsyY1Zq57gfMmbtDw9vr_VatG20' }).then((currentToken) => {
    if (currentToken) {
        console.log("token",currentToken);
        
    } else {
      requestPermission();
      console.log('No registration token available. Request permission to generate one.');
      // ...
    }
  }).catch((err) => {
    requestPermission();
    console.log('An error occurred while retrieving token. ', err);
    // ...
  });
 }
