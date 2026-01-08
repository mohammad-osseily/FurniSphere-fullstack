# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import joblib

app = FastAPI()

# Load the dataset, vectorizer, and product profiles
df = pd.read_csv('amazon_product_reviews.csv')
vectorizer = joblib.load('tfidf_vectorizer.joblib')
product_profiles = joblib.load('product_profiles.joblib')

class UserInterest(BaseModel):
    interests: str

class ProductRecommendation(BaseModel):
    id: str
    name: str
    description: str
    similarity: float

@app.post("/recommend", response_model=List[ProductRecommendation])
async def recommend_products(user_interest: UserInterest):
    if not user_interest.interests.strip():
        raise HTTPException(status_code=400, detail="Interest cannot be empty")

    # Vectorize user interest
    user_vector = vectorizer.transform([user_interest.interests])

    # Calculate cosine similarity
    similarities = cosine_similarity(user_vector, product_profiles).flatten()

    # Sort products by similarity
    similar_product_indices = similarities.argsort()[::-1]

    # Get unique product IDs (to avoid duplicates)
    unique_product_ids = df['asin'].iloc[similar_product_indices].unique()[:5]

    # Return top 5 recommendations
    recommendations = []
    for product_id in unique_product_ids:
        product = df[df['asin'] == product_id].iloc[0]
        recommendations.append(
            ProductRecommendation(
                id=product['asin'],
                name=product['productName'],
                description=product['reviewText'][:200] + '...',  # Truncate description
                similarity=float(similarities[df[df['asin'] == product_id].index[0]])
            )
        )

    return recommendations

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
