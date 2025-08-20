/*
function isRoutineResponse(responseText, language = "es") {
  const routineIndicators = {
    structure: /(\d+\.\s.+(\n|$)){3}/, // 3 líneas numeradas
    question: {
      es: "/¿Quieres saber cómo hacer alguno de estos ejercicios o necesitas más\?/",
      en: "/Want to know how to do any of these exercises or need more\?/",
    },
  };

  return (
    routineIndicators.structure.test(responseText) &&
    routineIndicators.question[language].test(responseText)
  );
}

module.exports = { isRoutineResponse };
*/
