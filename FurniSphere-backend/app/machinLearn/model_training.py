# model_training.py
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import joblib

# Load the dataset
df = pd.read_csv('amazon_product_reviews.csv')

# Preprocess the data
df['text'] = df['summary'] + ' ' + df['reviewText']
df['text'] = df['text'].fillna('')

# Create a TF-IDF vectorizer
vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
tfidf_matrix = vectorizer.fit_transform(df['text'])

# Calculate the mean TF-IDF vector for each product
product_profiles = tfidf_matrix.mean(axis=0)

# Save the vectorizer and product profiles
joblib.dump(vectorizer, 'tfidf_vectorizer.joblib')
joblib.dump(product_profiles, 'product_profiles.joblib')

print("Model training completed and saved.")
