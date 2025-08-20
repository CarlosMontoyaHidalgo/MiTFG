const express = require("express");
const router = express.Router();
const { dialogflowClient, sessionPath } = require("../config/dialogflow");
const { handleIntent } = require("../services/intentService");

router.post("/", async (req, res) => {
  const { message, language = "es" } = req.body;
  console.log("📥 Mensaje recibido:", message, "Idioma:", language);
  if (!message) {
    console.log("❌ No se proporcionó mensaje");
    return res.status(400).json({ error: "No message provided" });
  }

  try {
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: language,
        },
      },
    };

    console.log("📡 Enviando a Dialogflow:", message, "Idioma:", language);
    const [response] = await dialogflowClient.detectIntent(request);
    const result = response.queryResult;
    const intentName = result.intent ? result.intent.displayName : null;
    const parameters = result.parameters || {};
    const contexts = result.outputContexts || [];
    console.log(
      "🔍 Intent detectado:",
      intentName,
      "Parámetros:",
      JSON.stringify(parameters),
      "Contextos:",
      contexts.map((c) => c.name)
    );

    if (!intentName) {
      console.log("❌ No se detectó intent");
      return res.json({
        response:
          language === "es"
            ? "Lo siento, no entendí. ¿Puedes repetir?"
            : "Sorry, I didn’t understand. Can you repeat?",
      });
    }

    const responseText = await handleIntent(
      intentName,
      parameters,
      contexts,
      language
    );
    res.json({ response: responseText });
  } catch (error) {
    console.error("⛔ Error en Dialogflow:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
