package com.aronid.weighttrackertft.data.remote.chatbot

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import javax.inject.Inject
import java.util.Locale

class ChatbotApiServiceImpl @Inject constructor(
    private val client: OkHttpClient
) : ChatbotApiService {
    override suspend fun sendMessage(request: ChatbotRequest): ChatbotResponse {
        return withContext(Dispatchers.IO) {
            val language = if (Locale.getDefault().language.startsWith("en")) "en" else "es"
            val json = JSONObject()
                .put("message", request.message)
                .put("language", language)
                .toString()
            val body = json.toRequestBody("application/json".toMediaType())
            val httpRequest = Request.Builder()
                .url(ChatbotConfig.WEBHOOK_URL)
                .post(body)
                .build()
            val response = client.newCall(httpRequest).execute()
            val responseBody = response.body?.string() ?: throw Exception("Respuesta vacía")
            val jsonResponse = JSONObject(responseBody)
            ChatbotResponse(jsonResponse.getString("response"))
        }
    }
}

