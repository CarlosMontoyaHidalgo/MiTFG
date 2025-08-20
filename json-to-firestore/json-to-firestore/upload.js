/*
 * Este script sube datos de ejercicios a Firestore.
 *  node upload.js
 * Pasos:
 * 1. Inicializa la aplicación de Firebase con las credenciales del servicio.
 * 2. Carga los datos de ejercicios desde un archivo JSON.
 * 3. Para cada ejercicio, crea un nuevo documento en la colección 'exercises'.
 * 4. Sube los datos a Firestore en un batch.
 */

const admin = require("firebase-admin");
const serviceAccount = require("./service-account-key.json"); // Archivo de credenciales

const collectionName = "exercises";
const data = require(`./${collectionName}.json`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function uploadData() {
  const batch = db.batch();
  const collectionRef = db.collection(collectionName);

  data.forEach((item) => {
    const docRef = collectionRef.doc();
    const { ...rest } = item;
    batch.set(docRef, rest);
  });

  await batch.commit();
  console.log("Todos los datos se subieron correctamente!");
}

uploadData().catch(console.error);
