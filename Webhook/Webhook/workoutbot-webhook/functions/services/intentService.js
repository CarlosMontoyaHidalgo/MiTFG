const { getExerciseByName, getExercises } = require("./exerciseService");
const { generateRoutine } = require("./routineService");
const exerciseTranslations = require("../exerciseTranslations");
const normalizeText = require("../utils/normalizeText");
const { db } = require("../config/firebase");

async function handleIntent(
  intentName,
  parameters,
  contexts = [],
  language = "es"
) {
  console.log(
    "🔍 Procesando intent:",
    intentName,
    "Parámetros:",
    JSON.stringify(parameters),
    "Contextos:",
    contexts.map((c) => c.name),
    "Idioma:",
    language
  );
  const workoutType = parameters["workout_type"] || intentName;
  const exerciseName = parameters["exercise_name"];
  const prefixMap = {
    push: language === "es" ? "¡Día de empuje! " : "Push day! ",
    pull: language === "es" ? "¡Día de tracción! " : "Pull day! ",
    legs: language === "es" ? "¡Día de piernas! " : "Leg day! ",
    beginner_routine:
      language === "es"
        ? "¡Perfecto para principiantes! "
        : "Perfect for beginners! ",
  };
  console.log("🔍 Intent recibido:", intentName);

  // Manejar intents de bienvenida y saludos
  if (
    intentName === "welcome" ||
    intentName === "greeting" ||
    intentName === "start"
  ) {
    return language === "es"
      ? "¡Hola! ¿Listo para entrenar? Prueba con 'me gustaría una rutina de empuje, de tracción o de piernas', o pregunta '¿cómo se hace el press de banca?', '¿qué consejos hay para la sentadilla?' o '¿cuáles son los errores comunes del peso muerto?'."
      : "Hey! Ready to work out? Try 'I’d like a push, pull, or legs routine,' or ask 'how do I do a bench press?', 'what are tips for the squat?', or 'what are common mistakes for the deadlift?'.";
  }

  // Fallback para entradas desconocidas
  if (intentName === "input.unknown") {
    return language === "es"
      ? "Lo siento, no entendí. ¿Quieres una rutina de ejercicios? Prueba con 'me gustaría una rutina de empuje, de tracción o de piernas', o pregunta '¿cómo se hace un ejercicio?', '¿qué consejos hay para un ejercicio?' o '¿cuáles son los errores comunes?'."
      : "Sorry, I didn’t get that. Want a workout routine? Try 'I’d like a push, pull, or legs routine,' or ask 'how do I do an exercise?', 'what are tips for an exercise?', or 'what are common mistakes?'.";
  }

  // Instrucciones de ejercicios
  if (intentName === "exercise_instructions") {
    const exerciseName = parameters?.fields?.exercise_name?.stringValue;
    console.log(`🔍 Buscando ejercicio: ${exerciseName}`);
    if (!exerciseName) {
      return language === "es"
        ? "Por favor, dime qué ejercicio quieres hacer."
        : "Please tell me which exercise you want to do.";
    }
    const normalizedExerciseName = normalizeText(exerciseName);
    const translatedExercise = Object.keys(exerciseTranslations).find((key) =>
      exerciseTranslations[key].es
        .toLowerCase()
        .includes(normalizedExerciseName)
    );
    console.log(
      translatedExercise
        ? `✅ Traducción encontrada: ${exerciseName} -> ${translatedExercise}`
        : `❌ No se encontró traducción para: ${exerciseName}`
    );
    if (!translatedExercise) {
      return language === "es"
        ? `Lo siento, no tengo información sobre "${exerciseName}". Prueba con otro ejercicio.`
        : `Sorry, I don't have information about "${exerciseName}". Try another exercise.`;
    }
    const exerciseDoc = await db
      .collection("exercises")
      .where("name", "==", translatedExercise)
      .get();
    if (exerciseDoc.empty) {
      console.log(
        `❌ No se encontró el ejercicio con nombre: ${translatedExercise} en Firestore`
      );
      return language === "es"
        ? `Lo siento, no encontré el ejercicio "${exerciseName}" en la base de datos.`
        : `Sorry, I couldn't find the exercise "${exerciseName}" in the database.`;
    }
    const exerciseData = exerciseDoc.docs[0].data();
    console.log(
      `✅ Ejercicio encontrado: ${translatedExercise}, Instrucciones: ${JSON.stringify(
        exerciseData.instructions
      )}`
    );
    return exerciseData.instructions[language] || exerciseData.instructions.es;
  }

  // Consejos de ejercicios
  if (intentName === "exercise_tips" && exerciseName) {
    console.log(`💡 Procesando consejos para: ${exerciseName}`);
    const exercise = await getExerciseByName(exerciseName, language);
    if (!exercise) {
      console.log(`❌ Ejercicio no encontrado para: ${exerciseName}`);
      return language === "es"
        ? `No hay consejos disponibles para ${exerciseName}.`
        : `No tips available for ${exerciseName}.`;
    }
    const tips = exercise.tips?.[language] || exercise.tips?.es || [];
    if (tips.length === 0) {
      console.log(`❌ Sin consejos para: ${exerciseName}`);
      return language === "es"
        ? `No hay consejos disponibles para ${exerciseName}.`
        : `No tips available for ${exerciseName}.`;
    }
    console.log(`💡 Consejos para ${exerciseName}: ${tips.join(" ")}`);
    return language === "es"
      ? `Consejos para ${
          exerciseTranslations[exercise.name]?.[language] || exercise.name
        }: ${tips.join(" ")}`
      : `Tips for ${
          exerciseTranslations[exercise.name]?.[language] || exercise.name
        }: ${tips.join(" ")}`;
    Toya;
  }

  // Errores comunes de ejercicios
  if (intentName === "exercise_common_mistakes" && exerciseName) {
    console.log(`⚠️ Procesando errores comunes para: ${exerciseName}`);
    const exercise = await getExerciseByName(exerciseName, language);
    if (!exercise) {
      console.log(`❌ Ejercicio no encontrado para: ${exerciseName}`);
      return language === "es"
        ? `No hay errores comunes listados para ${exerciseName}.`
        : `No common mistakes listed for ${exerciseName}.`;
    }
    const mistakes =
      exercise.common_mistakes?.[language] ||
      exercise.common_mistakes?.es ||
      [];
    if (mistakes.length === 0) {
      console.log(`❌ Sin errores comunes para: ${exerciseName}`);
      return language === "es"
        ? `No hay errores comunes listados para ${exerciseName}.`
        : `No common mistakes listed for ${exerciseName}.`;
    }
    console.log(
      `⚠️ Errores comunes para ${exerciseName}: ${mistakes.join(" ")}`
    );
    return language === "es"
      ? `Errores comunes en ${
          exerciseTranslations[exercise.name]?.[language] || exercise.name
        }: ${mistakes.join(" ")}`
      : `Common mistakes in ${
          exerciseTranslations[exercise.name]?.[language] || exercise.name
        }: ${mistakes.join(" ")}`;
  }

  // Rutinas de empuje
  if (
    intentName === "push" ||
    ["push", "empuje", "thrust"].includes(workoutType)
  ) {
    return await generateRoutine(
      "strength",
      ["chest", "shoulders", "triceps"],
      prefixMap.push,
      language
    );
  }

  // Rutinas de tracción
  if (
    intentName === "pull" ||
    ["pull", "tracción", "tirar", "traction", "tug"].includes(workoutType)
  ) {
    return await generateRoutine(
      "strength",
      ["back", "biceps"],
      prefixMap.pull,
      language
    );
  }

  // Rutinas de piernas
  if (
    intentName === "legs" ||
    ["legs", "piernas", "glúteos", "cuádriceps"].includes(workoutType)
  ) {
    return await generateRoutine(
      "strength",
      ["quads", "glutes", "hamstrings", "calves"],
      prefixMap.legs,
      language
    );
  }

  // Rutina para principiantes
  if (intentName === "beginner_routine") {
    const strengthExercises = await getExercises("strength");
    const cardioExercises = await getExercises("cardio");
    const allExercises = [...strengthExercises, ...cardioExercises];
    if (allExercises.length === 0) {
      return language === "es"
        ? "¡Ups! No hay ejercicios. 😅 Añade algunos en Firebase."
        : "Oops! No exercises found. 😅 Add some to Firebase.";
    }
    const selected = shuffle(allExercises).slice(0, 3);
    const routine = selected
      .map(
        (ex, index) =>
          `${index + 1}. ${
            exerciseTranslations[ex.name]?.[language] || ex.name
          }`
      )
      .join("\n");
    return language === "es"
      ? `${prefixMap.beginner_routine}\n${routine}\n¿Quieres saber cómo hacer alguno de estos ejercicios o necesitas más?`
      : `${prefixMap.beginner_routine}\n${routine}\nWant to know how to do any of these exercises or need more?`;
  }

  // Más ejercicios
  if (intentName === "more") {
    let lastType = null;
    for (const context of contexts) {
      if (context.parameters && context.parameters["workout_type"]) {
        lastType = context.parameters["workout_type"];
        break;
      }
    }
    if (!lastType) {
      return language === "es"
        ? "No sé qué rutina estabas siguiendo. ¿Quieres una rutina de empuje, tracción o piernas?"
        : "I'm not sure which routine you were following. Want a push, pull, or legs routine?";
    }
    const musclesMap = {
      push: ["chest", "shoulders", "triceps"],
      pull: ["back", "biceps"],
      legs: ["quads", "glutes", "hamstrings", "calves"],
      beginner_routine: [],
    };
    const prefix =
      prefixMap[lastType] ||
      (language === "es" ? "¡Otra rutina! " : "Another routine! ");
    return await generateRoutine(
      lastType === "beginner_routine" ? null : "strength",
      musclesMap[lastType] || [],
      prefix,
      language
    );
  }

  // Respuesta genérica para intents no reconocidos
  return language === "es"
    ? "Lo siento, no entendí. ¿Puedes repetir?"
    : "Sorry, I didn’t understand. Can you repeat?";
}

module.exports = { handleIntent };
