const { SessionsClient } = require("@google-cloud/dialogflow");

let dialogflowClient;
try {
  dialogflowClient = new SessionsClient({
    keyFilename: process.env.DIALOGFLOW_KEY_PATH,
  });
  console.log("✅ Dialogflow inicializado correctamente");
} catch (error) {
  console.error("⛔ Error al inicializar Dialogflow:", error);
  process.exit(1);
}

const projectId = process.env.DIALOGFLOW_PROJECT_ID;
const sessionId = "user123";
const sessionPath = dialogflowClient.projectAgentSessionPath(
  projectId,
  sessionId
);

module.exports = { dialogflowClient, sessionPath };
