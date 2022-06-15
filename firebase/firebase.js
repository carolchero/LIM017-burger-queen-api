// Import the functions you need from the SDKs you need
const { initializeApp, getStorage } = require('./imports');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDJIPoav68-P9vwgMod8KNuFxYNfZtKWk0',
  authDomain: 'burguer-queen-88bf7.firebaseapp.com',
  projectId: 'burguer-queen-88bf7',
  storageBucket: 'burguer-queen-88bf7.appspot.com',
  messagingSenderId: '702056466594',
  appId: '1:702056466594:web:a9bbe65d5990e0decc6ffb',
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
