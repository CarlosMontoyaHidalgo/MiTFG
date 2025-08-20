const admin = require("firebase-admin");

try {
  const serviceAccount = require("../service-account.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase inicializado correctamente");
} catch (error) {
  console.error("⛔ Error al inicializar Firebase:", error);
  process.exit(1);
}

const db = admin.firestore();

module.exports = { db };
