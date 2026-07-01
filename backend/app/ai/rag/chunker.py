from langchain_core.documents import Document

def chunk_documents(documents: list[Document]) -> list[Document]:
    """Split docs into overlapping chunks without requiring sentence_transformers."""
    chunks = []
    chunk_size = 500
    chunk_overlap = 50

    for doc in documents:
        text = doc.page_content
        # Simple character-based chunking on newline boundaries
        lines = text.split("\n")
        current_chunk = ""
        for line in lines:
            if len(current_chunk) + len(line) + 1 > chunk_size and current_chunk:
                chunks.append(Document(
                    page_content=current_chunk.strip(),
                    metadata=doc.metadata,
                ))
                # Keep last chunk_overlap characters for overlap
                current_chunk = current_chunk[-chunk_overlap:] + "\n" + line
            else:
                current_chunk = current_chunk + "\n" + line if current_chunk else line
        if current_chunk.strip():
            chunks.append(Document(
                page_content=current_chunk.strip(),
                metadata=doc.metadata,
            ))

    return chunks if chunks else documents  # fall back to full docs if all too small
