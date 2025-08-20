const { db } = require("../config/firebase");
const normalizeText = require("../utils/normalizeText");
const exerciseTranslations = require("../exerciseTranslations");

async function getExerciseByName(exerciseName, language = "es") {
  try {
    console.log(`🔍 Buscando ejercicio: ${exerciseName} (idioma: ${language})`);
    const normalizedName = normalizeText(exerciseName);
    console.log(`🔍 Nombre normalizado: ${normalizedName}`);
    let exerciseId = null;
    for (const [id, names] of Object.entries(exerciseTranslations)) {
      console.log(
        `🔍 Comparando con ID: ${id}, es: ${normalizeText(
          names.es
        )}, en: ${normalizeText(names.en)}`
      );
      if (
        normalizeText(names.es) === normalizedName ||
        normalizeText(names.en) === normalizedName
      ) {
        exerciseId = id;
        break;
      }
    }
    if (!exerciseId) {
      console.log(
        `❌ No se encontró traducción para el ejercicio: ${exerciseName}`
      );
      return null;
    }
    console.log(`✅ Traducción encontrada: ${exerciseName} -> ${exerciseId}`);
    const query = db.collection("exercises").where("name", "==", exerciseId);
    const snapshot = await query.get();
    if (snapshot.empty) {
      console.log(
        `❌ No se encontró el ejercicio con nombre: ${exerciseId} en Firestore`
      );
      return null;
    }
    const exercise = snapshot.docs[0].data();
    console.log(
      `✅ Ejercicio encontrado: ${
        exercise.name
      }, Instrucciones: ${JSON.stringify(exercise.instructions)}`
    );
    return exercise;
  } catch (error) {
    console.error("⛔ Error al obtener ejercicio:", error);
    return null;
  }
}

async function getExercises(type, muscles = []) {
  try {
    let exercises = [];
    if (muscles.length === 0) {
      let query = db.collection("exercises");
      if (type) {
        query = query.where("type", "==", type);
      }
      const snapshot = await query.get();
      snapshot.forEach((doc) => exercises.push(doc.data()));
    } else {
      for (const muscle of muscles) {
        let query = db.collection("exercises");
        if (type) {
          query = query.where("type", "==", type);
        }
        query = query.where("primaryMuscle", "==", db.doc(`muscles/${muscle}`));
        const snapshot = await query.get();
        snapshot.forEach((doc) => exercises.push(doc.data()));
      }
      exercises = [...new Map(exercises.map((ex) => [ex.name, ex])).values()];
    }
    console.log(
      `🔍 Encontrados ${exercises.length} ejercicios para type=${type}, muscles=${muscles}`
    );
    return exercises;
  } catch (error) {
    console.error("⛔ Error al obtener ejercicios:", error);
    return [];
  }
}

module.exports = { getExerciseByName, getExercises };
