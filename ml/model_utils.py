import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
import re

# Load cleaned dataset once
# print("Loading dataset...")
df = pd.read_csv("./cleaned_indian_food_1.csv")
# print("Dataset loaded")

vectorizer = TfidfVectorizer(stop_words="english")
ingredient_vectors = vectorizer.fit_transform(df["CleanedIngredients"])


# Helper functions
def normalize_ingredient_name(text):
    text = text.lower().strip()
    # remove preparation words and descriptors
    text = re.sub(r'\b(chopped|finely|roughly|sliced|diced|grated|minced|crushed|powder|paste|optional|to taste|fresh|whole|small|medium|large|inch)\b', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# Main Recommendation Function
def recommend_recipe_precise(user_ingredients, top_n=10):
    if isinstance(user_ingredients, str):
        user_ingredients = [i.strip().lower() for i in user_ingredients.split(",")]
    else:
        user_ingredients = [i.strip().lower() for i in user_ingredients]

    user_set = set([normalize_ingredient_name(i) for i in user_ingredients])

    results = []
    for idx, row in df.iterrows():
        recipe_ingredients = [normalize_ingredient_name(i) for i in row["CleanedIngredients"].split(",")]
        recipe_set = set(recipe_ingredients)
        intersection = len(user_set & recipe_set)
        if intersection == 0:
            continue
        extra_ings = list(recipe_set - user_set)
        results.append((idx, intersection, len(extra_ings), extra_ings))

    if not results:
        return pd.DataFrame()

    results = sorted(results, key=lambda x: (x[2], -x[1]))
    indices = [r[0] for r in results]
    rec = df.iloc[indices][["TranslatedRecipeName", "CleanedIngredients", "Cuisine", "Course", "Diet", "RecipeSteps","ImageURL"]].copy()
    rec["ExtraIngredientsCount"] = [r[2] for r in results]
    rec["MissingIngredients"] = [", ".join(r[3]) if r[3] else "None" for r in results]
    rec["Rank"] = range(1, len(rec) + 1)
    return rec

# Recipe steps view
def get_recipe_steps(recipe_name):
    recipe = df[df["TranslatedRecipeName"].str.lower() == recipe_name.lower()]
    if recipe.empty:
        return None
    return recipe.iloc[0].to_dict()

# Similar recipes based on favorites
def get_similar_recipes(favorite_names, top_n=10):
    if not favorite_names:
        return pd.DataFrame()

    # Get cuisines and diets of favorites
    fav_recipes = df[df["TranslatedRecipeName"].str.lower().isin([n.lower() for n in favorite_names])]
    if fav_recipes.empty:
        return pd.DataFrame()

    fav_cuisines = set(fav_recipes["Cuisine"].dropna().str.lower())
    fav_diets = set(fav_recipes["Diet"].dropna().str.lower())

    # Find similar recipes
    similar = df[~df["TranslatedRecipeName"].str.lower().isin([n.lower() for n in favorite_names])]

    # Score based on matching cuisine or diet
    similar = similar.copy()
    similar["score"] = similar.apply(lambda row: (
        1 if row["Cuisine"] and row["Cuisine"].lower() in fav_cuisines else 0) +
        (1 if row["Diet"] and row["Diet"].lower() in fav_diets else 0), axis=1)

    # Filter those with score > 0
    similar = similar[similar["score"] > 0].sort_values("score", ascending=False).head(top_n)

    if similar.empty:
        return pd.DataFrame()

    return similar[["TranslatedRecipeName", "Cuisine", "Course", "Diet", "ImageURL"]]
