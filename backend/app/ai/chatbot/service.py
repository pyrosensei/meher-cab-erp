"""
Stateless chatbot service.
Conversation history is passed in from the client — no server-side session state.
"""
from loguru import logger
from app.ai.nim.client import nim_client
from app.ai.chatbot.prompts import SYSTEM_PROMPT

class ChatbotService:
    async def respond(self, user_message: str, history: list, context: str = "") -> str:
        """Build prompt with optional RAG context, then call NIM LLM."""
        system = SYSTEM_PROMPT
        if context:
            system += f"\n\n## Relevant ERP data from the database:\n{context}"

        messages = [{"role": "system", "content": system}]
        messages.extend(history[-10:])  # cap at last 10 turns to avoid context overflow
        messages.append({"role": "user", "content": user_message})

        try:
            return await nim_client.chat(messages=messages, max_tokens=512)
        except Exception as e:
            logger.error(f"NIM chatbot call failed: {e}")
            # Graceful fallback — never crash the endpoint
            return "I'm having trouble connecting to the AI service right now. Please try again in a moment."

chatbot_service = ChatbotService()
