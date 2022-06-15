const {
  getStorage, ref, uploadBytesResumable, getDownloadURL,
} = require('./firebase/imports');

const storage = getStorage();

// funcion para descargar la foto del usuario
async function dowloadImagePhoto(image) {
  let urlImage = '';
  await getDownloadURL(ref(storage, `photoDesayuno/${image}`))
    .then((url) => {
      urlImage = url;
      console.log('url');
      console.log(url);
    }).catch((error) => {
    });
  return urlImage;
}
// funcion para subir la foto del usuario al storage
let result = '';
async function uploadImages(image) {
  const photoRef = ref(storage, `photoDesayuno/${image}`);
  console.log('photoRef');
  console.log(photoRef);
  const upload = await uploadBytesResumable(photoRef, '../img/burguer.jpg');
  result = true;
  await dowloadImagePhoto(image);
  return result;
}

module.exports = {
  uploadImages,
};
