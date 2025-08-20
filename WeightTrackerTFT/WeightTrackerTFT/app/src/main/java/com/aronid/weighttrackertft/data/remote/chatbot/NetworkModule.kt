package com.aronid.weighttrackertft.data.remote.chatbot

import com.aronid.weighttrackertft.data.chatbot.ChatbotRepository
import com.aronid.weighttrackertft.data.chatbot.ChatbotRepositoryImpl
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import okhttp3.OkHttpClient
import java.util.concurrent.TimeUnit
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    @Provides
    @Singleton
    fun provideOkHttpClient(): OkHttpClient {
        return OkHttpClient.Builder()
            .connectTimeout(ChatbotConfig.CONNECT_TIMEOUT_SECONDS, TimeUnit.SECONDS)
            .readTimeout(ChatbotConfig.READ_TIMEOUT_SECONDS, TimeUnit.SECONDS)
            .writeTimeout(ChatbotConfig.WRITE_TIMEOUT_SECONDS, TimeUnit.SECONDS)
            .build()
    }

    @Provides
    @Singleton
    fun provideChatbotApiService(client: OkHttpClient): ChatbotApiService {
        return ChatbotApiServiceImpl(client)
    }

    @Provides
    @Singleton
    fun provideChatbotRepository(apiService: ChatbotApiService): ChatbotRepository {
        return ChatbotRepositoryImpl(apiService)
    }
}