/* eslint-disable import/no-unresolved */
const { initializeApp } = require('https://www.gstatic.com/firebasejs/9.8.3/firebase-app');

const {
  getStorage, ref, uploadBytesResumable, getDownloadURL,
} = require('https://www.gstatic.com/firebasejs/9.6.11/firebase-storage');

module.exports = {
  initializeApp, getStorage, ref, uploadBytesResumable, getDownloadURL,
};
