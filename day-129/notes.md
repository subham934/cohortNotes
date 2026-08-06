RAG - Retrieval-Augmented Generation (RAG) is a technique that combines retrieval-based methods with generative models to enhance the performance of natural language processing tasks. It involves retrieving relevant information from a large corpus of data and using that information to generate more accurate and contextually relevant responses.

AI will take the human input and will tokenise it. the process is called tokenization. LLM works on tokens. 
jyada word = jyada token = jyada cost



Few concept of RAG::
- ingestion : store data in RAG
- vector store: data base where we store data
- retriever: valid information nikalna ka kam karta hai
 
 
look at "tersorflow data projection" to understand similarity in LLM

https://projector.tensorflow.org/

Embedding: ak word ko AI k through coordinates mein convert karna. 
taj : [1,2,3]
king : [1,2,4]
woman :[1,3,4]

Vactor Store: Embedding ko store karta hai vactor store. Eg: pinecone, Weaviate, Chroma etc

we have a PDF file, we chunk it into smaller documents, then we embed it and store it in vector store. now if we ask about certain topic from that pdf, at first it will embed our query and then based on query embedding it will find most similar chunk from vector store and will give you the answer.