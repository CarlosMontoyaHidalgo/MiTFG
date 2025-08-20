/*
 * Este script sube datos de ejercicios a Firestore.
 * Cada ejercicio contiene referencias a músculos en la colección 'muscles'.
 *
 * Pasos:
 * 1. Inicializa la aplicación de Firebase con las credenciales del servicio.
 * 2. Carga los datos de ejercicios desde un archivo JSON.
 * 3. Para cada ejercicio, crea un nuevo documento en la colección 'exercises'.
 * 4. Convierte los IDs de los músculos en referencias a documentos en la colección 'muscles'.
 * 5. Sube los datos a Firestore en un batch.
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
    const docRef = collectionRef.doc(item.id); // Usar el id del ejercicio como id del documento
    const { id, primaryMuscle, secondaryMuscle, ...rest } = item;

    // Crear referencias a los documentos de la colección 'muscles' usando los IDs
    const primaryMuscleRef = db.collection("muscles").doc(primaryMuscle);
    const secondaryMuscleRefs = secondaryMuscle.map((muscle) =>
      db.collection("muscles").doc(muscle)
    );

    batch.set(docRef, {
      ...rest,
      primaryMuscle: primaryMuscleRef,
      secondaryMuscle: secondaryMuscleRefs,
    });
  });

  await batch.commit();
  console.log("Todos los datos se subieron correctamente!");
}

uploadData().catch(console.error);
