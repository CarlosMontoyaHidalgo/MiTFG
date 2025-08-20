const { getExercises } = require("./exerciseService");
const shuffle = require("../utils/shuffle");
const exerciseTranslations = require("../exerciseTranslations");

async function generateRoutine(type, muscles, prefix = "", language = "es") {
  const exercises = await getExercises(type, muscles);
  if (exercises.length === 0) {
    return language === "es"
      ? `¡Ups! No hay ejercicios para ${type || "esta categoría"}. 😅`
      : `Oops! No exercises found for ${type || "this category"}. 😅`;
  }
  const selected = shuffle(exercises).slice(0, 3);
  console.log("🔍 Ejercicios seleccionados:", selected);
  const routine = selected
    .map(
      (ex, index) =>
        `${index + 1}. ${exerciseTranslations[ex.name]?.[language] || ex.name}`
    )
    .join("\n");
  return language === "es"
    ? `${prefix}\n${routine}\n¿Quieres saber cómo hacer alguno de estos ejercicios o necesitas más?`
    : `${prefix}\n${routine}\nWant to know how to do any of these exercises or need more?`;
}

module.exports = { generateRoutine };
