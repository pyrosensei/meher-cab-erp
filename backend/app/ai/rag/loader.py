"""
Converts JSON seed files into LangChain Documents for RAG indexing.
One Document per record, with metadata for source filtering.
"""
import json
import pathlib
from langchain_core.documents import Document

SEED_DIR = pathlib.Path(__file__).parent.parent.parent.parent / "data" / "seed"

def load_all_documents() -> list[Document]:
    """Convert every JSON seed file record into a LangChain Document."""
    docs = []
    for json_file in SEED_DIR.glob("*.json"):
        entity_type = json_file.stem  # e.g. "drivers", "trips"
        records = json.loads(json_file.read_text(encoding="utf-8"))
        for record in records:
            # Human-readable text representation of the record
            text = f"[{entity_type.upper()} RECORD]\n"
            for key, value in record.items():
                text += f"{key}: {value}\n"
            docs.append(Document(
                page_content=text,
                metadata={"source": json_file.name, "entity_type": entity_type},
            ))
    return docs
