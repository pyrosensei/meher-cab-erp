import asyncio

import pytest

from app.ai.chatbot.service import ai_service
from app.routers.chatbot import ChatRequest, ChatMessage


def test_chat_service_defaults_top_k(monkeypatch):
    captured = {}

    async def fake_query_rag(query, top_k, history):
        captured["query"] = query
        captured["top_k"] = top_k
        captured["history"] = history
        return {"reply": "ok", "sources": ["driver-1"], "used_rag": True}

    monkeypatch.setattr("app.ai.chatbot.service.query_rag", fake_query_rag)

    outcome = asyncio.run(ai_service.chat("hello", [{"role": "user", "content": "previous"}]))

    assert outcome.reply == "ok"
    assert outcome.sources == ["driver-1"]
    assert outcome.used_rag is True
    assert captured["query"] == "hello"
    assert captured["top_k"] == 5
    assert captured["history"] == [{"role": "user", "content": "previous"}]


def test_chat_service_honors_top_k(monkeypatch):
    captured = {}

    async def fake_query_rag(query, top_k, history):
        captured["top_k"] = top_k
        return {"reply": "ok", "sources": [], "used_rag": False}

    monkeypatch.setattr("app.ai.chatbot.service.query_rag", fake_query_rag)

    asyncio.run(ai_service.chat("hello", [], top_k=9))

    assert captured["top_k"] == 9


def test_chat_request_validation():
    request = ChatRequest(message="Need driver status", history=[ChatMessage(role="user", content="Hi")], top_k=3)

    assert request.message == "Need driver status"
    assert request.history[0].role == "user"
    assert request.top_k == 3


def test_chat_request_rejects_blank_message():
    with pytest.raises(ValueError):
        ChatRequest(message="", history=[])
