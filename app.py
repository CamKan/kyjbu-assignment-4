from flask import Flask, render_template, request, jsonify
from sklearn.datasets import fetch_20newsgroups
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import nltk
from nltk.corpus import stopwords

nltk.download('stopwords')

app = Flask(__name__)


# TODO: Fetch dataset, initialize vectorizer and LSA here
# Load Dataset
newsgroups = fetch_20newsgroups(subset='all')
documents = newsgroups.data
stop_words = stopwords.words('english')

vectorizer = TfidfVectorizer(stop_words=stop_words, max_features=5000)
X = vectorizer.fit_transform(documents)

# SVD
svd = TruncatedSVD(n_components=100, random_state=42)
X_reduced = svd.fit_transform(X)

def search_engine(query):
    """
    Function to search for top 5 similar documents given a query
    Input: query (str)
    Output: documents (list), similarities (list), indices (list)
    """
    # TODO: Implement search engine here
    # return documents, similarities, indices 

    query_vec = vectorizer.transform([query])
    query_vec_reduced = svd.transform(query_vec)

    # Calculate the cosine similarity
    similarities = cosine_similarity(query_vec_reduced, X_reduced)[0]

    # Get an index of the 5 most similar documents
    indices = similarities.argsort()[-5:][::-1]
    top_similarities = similarities[indices]
    top_documents = [documents[i] for i in indices]

    return top_documents, top_similarities.tolist(), indices.tolist()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    query = request.form['query']
    documents, similarities, indices = search_engine(query)
    return jsonify({'documents': documents, 'similarities': similarities, 'indices': indices}) 

if __name__ == '__main__':
    app.run(debug=True)
