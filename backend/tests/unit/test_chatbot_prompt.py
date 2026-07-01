from app.ai.chatbot.prompts import SYSTEM_PROMPT

def test_system_prompt_not_empty():
    assert len(SYSTEM_PROMPT) > 50

def test_system_prompt_mentions_mehar():
    assert "Mehar" in SYSTEM_PROMPT

def test_system_prompt_mentions_bot():
    assert "MeharBot" in SYSTEM_PROMPT
