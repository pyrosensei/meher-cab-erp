import asyncio

import pytest

from app.routers import chatbot


def test_chat_route_returns_mapped_response(monkeypatch):
    class Outcome:
        reply = "hello"
        sources = ["Driver: Test Driver (DRV-TEST)"]
        used_rag = True

    async def fake_chat(user_message, history, top_k):
        assert user_message == "Who is on duty?"
        assert history == [{"role": "user", "content": "Previous"}]
        assert top_k == 7
        return Outcome()

    monkeypatch.setattr(chatbot.ai_service, "chat", fake_chat)

    response = asyncio.run(
        chatbot.chat(
            chatbot.ChatRequest(
                message="Who is on duty?",
                history=[chatbot.ChatMessage(role="user", content="Previous")],
                top_k=7,
            )
        )
    )

    assert response.reply == "hello"
    assert response.sources == ["Driver: Test Driver (DRV-TEST)"]
    assert response.used_rag is True


def test_chat_route_maps_value_error_to_422(monkeypatch):
    async def fake_chat(user_message, history, top_k):
        raise ValueError("bad request")

    monkeypatch.setattr(chatbot.ai_service, "chat", fake_chat)

    with pytest.raises(chatbot.HTTPException) as exc_info:
        asyncio.run(chatbot.chat(chatbot.ChatRequest(message="Hi", history=[])))

    assert exc_info.value.status_code == 422
    assert exc_info.value.detail == "Invalid chat request"


def test_stats_exposes_service_payload(monkeypatch):
    monkeypatch.setattr(chatbot.ai_service, "stats", lambda: {"initialized": True, "total_chunks": 3})

    assert asyncio.run(chatbot.stats()) == {"initialized": True, "total_chunks": 3}
