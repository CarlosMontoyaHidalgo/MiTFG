/*
 * Este script sube datos de rutinas predefinidas a Firestore.
 * Cada rutina contiene referencias a ejercicios en la colección 'exercises'.
 *
 * Pasos:
 * 1. Inicializa la aplicación de Firebase con las credenciales del servicio.
 * 2. Carga los datos de rutinas desde un archivo JSON.
 * 3. Para cada rutina, crea un nuevo documento en la colección 'routines_predefined'.
 * 4. Convierte los IDs de los ejercicios en referencias a documentos en la colección 'exercises'.
 * 5. Sube los datos a Firestore en un batch.
 */

const admin = require("firebase-admin");
const serviceAccount = require("./service-account-key.json"); // Archivo de credenciales

const collectionName = "routines_predefined";
const data = require(`./${collectionName}.json`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function uploadData() {
  const batch = db.batch();
  const collectionRef = db.collection(collectionName);

  data.forEach((item) => {
    const docRef = collectionRef.doc(); // Crear un nuevo documento con ID automático
    const { exercises, ...rest } = item;

    // Crear referencias a los documentos de la colección 'exercises' usando los IDs
    const exerciseRefs = exercises.map((exerciseId) =>
      db.collection("exercises").doc(exerciseId)
    );

    batch.set(docRef, {
      ...rest,
      exercises: exerciseRefs,
    });
  });

  await batch.commit();
  console.log("Todos los datos se subieron correctamente!");
}

uploadData().catch(console.error);
