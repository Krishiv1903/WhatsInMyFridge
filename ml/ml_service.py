from flask import Flask, request, jsonify
import os
from model_utils import recommend_recipe_precise, get_recipe_steps, get_similar_recipes

app = Flask(__name__)

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json(silent=True) or {}
    ingredients = data.get("ingredients", "").strip()

    recommendations = recommend_recipe_precise(ingredients)

    if recommendations.empty:
        return jsonify([])

    return jsonify(recommendations.to_dict(orient="records"))


@app.route("/recipe/<path:name>", methods=["GET"])
def recipe(name):
    recipe = get_recipe_steps(name)

    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404

    return jsonify(recipe)


@app.route("/similar", methods=["POST"])
def similar():
    data = request.get_json(silent=True) or {}
    favorite_names = data.get("favorite_names", [])

    if not favorite_names:
        return jsonify([])

    similar_recipes = get_similar_recipes(favorite_names)

    if similar_recipes.empty:
        return jsonify([])

    return jsonify(similar_recipes.to_dict(orient="records"))

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", "5001")), debug=False)
