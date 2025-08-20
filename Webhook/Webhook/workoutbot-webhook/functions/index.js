require("dotenv").config();
const express = require("express");
const { db } = require("./config/firebase");
const webhookRouter = require("./routes/webhook");
const exerciseTranslations = require("./exerciseTranslations");

const app = express();
app.use(express.json());

// Rutas
app.use("/webhook", webhookRouter);

// Ruta raíz
app.get("/", (req, res) => {
  res.send("¡Servidor funcionando! Usa POST /webhook");
});

// Ruta de prueba para Firestore
app.get("/test-firestore", async (req, res) => {
  try {
    const snapshot = await db.collection("exercises").get();
    const exercises = snapshot.docs.map((doc) => ({
      name: doc.data().name,
      type: doc.data().type,
      primaryMuscle: doc.data().primaryMuscle?.path || "Sin músculo primario",
      secondaryMuscle: doc.data().secondaryMuscle?.map((ref) => ref.path) || [],
      met: doc.data().met,
      imageUrl: doc.data().imageUrl,
      requiresWeight: doc.data().requiresWeight,
      instructions: doc.data().instructions || "Sin instrucciones",
      tips: doc.data().tips || [],
      common_mistakes: doc.data().common_mistakes || [],
    }));
    res.json({
      count: exercises.length,
      exercises: exercises,
    });
  } catch (error) {
    res.status(500).send("Error Firestore: " + error.message);
  }
});

// Verificar conexión a Firestore
db.listCollections()
  .then((collections) => {
    console.log("📚 Colecciones en Firestore:");
    collections.forEach((collection) => console.log(`- ${collection.id}`));
  })
  .catch((err) => console.error("🔥 Error de conexión a Firestore:", err));

db.collection("exercises")
  .get()
  .then((snapshot) => {
    console.log(`✅ Encontrados ${snapshot.size} ejercicios en Firestore`);
    snapshot.forEach((doc) =>
      console.log(
        `- ${exerciseTranslations[doc.data().name]?.es || doc.data().name}`
      )
    );
  })
  .catch((err) => console.error("⛔ Error Firestore:", err));

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Webhook available at http://localhost:${PORT}/webhook`);
});
