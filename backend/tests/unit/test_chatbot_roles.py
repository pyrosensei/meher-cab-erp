from app.routers.chatbot import ChatMessage


def test_chat_message_accepts_allowed_roles():
    for role in ["system", "user", "assistant"]:
        message = ChatMessage(role=role, content="hello")
        assert message.role == role
