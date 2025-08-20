package com.aronid.weighttrackertft.data.remote.chatbot

object ChatbotConfig {
    // URL base para el webhook
    // Para emulador Android: http://10.0.2.2:3000
    // Para dispositivo físico en la misma red: http://192.168.1.XXX:3000
    // Para producción: https://tu-servidor.com
    const val BASE_URL = "http://10.0.2.2:3000"
    
    // Endpoints
    const val WEBHOOK_ENDPOINT = "/webhook"
    
    // URL completa
    const val WEBHOOK_URL = "$BASE_URL$WEBHOOK_ENDPOINT"
    
    // Configuración de timeouts
    const val CONNECT_TIMEOUT_SECONDS = 30L
    const val READ_TIMEOUT_SECONDS = 30L
    const val WRITE_TIMEOUT_SECONDS = 30L
}
