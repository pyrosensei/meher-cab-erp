from app.ai.rag import pipeline


def test_rag_stats_reflect_initial_state(monkeypatch):
    monkeypatch.setattr(pipeline, "_initialized", False)
    monkeypatch.setattr(pipeline, "_documents", [])

    assert pipeline.get_stats() == {"initialized": False, "total_chunks": 0}
