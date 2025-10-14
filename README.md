# 🍳 Recipe Recommender ML

A machine learning project that helps users discover dishes they can cook based on the ingredients they already have! The model uses **TF-IDF vectorization** and **cosine similarity** to suggest recipes with the highest ingredient match.

---

## 🚀 Features

* 🥕 **Ingredient-based recipe recommendation** — Enter the ingredients you have, and get dishes you can make.
* 🧠 **Smart ranking** — Dishes are ranked by how closely they match your available ingredients.
* 🥇 **Tiered suggestions** —

  * **Top tier**: Recipes that can be made with *exactly* your ingredients.
  * **Second tier**: Recipes that need only a few *common* ingredients.
  * **Third tier**: Recipes requiring *rare or unavailable* ingredients.
* 📊 **Machine Learning model** using TF-IDF and cosine similarity.

---

## 🧰 Tech Stack

* **Language:** Python 3.x
* **Libraries:** pandas, scikit-learn, numpy
* **Environment:** Jupyter Notebook

---

## 📂 Project Structure

```
Recipe-Recommender-ML/
│
├── Recipe Recommender Ml.ipynb   # Jupyter notebook containing the complete model code
├── README.md                     # Project documentation
├── data/                         # Folder for sample recipe datasets
└── requirements.txt               # Required Python packages
```

---

## ⚙️ Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-username>/Recipe-Recommender-ML.git
   cd Recipe-Recommender-ML
   ```

2. **Create and activate a virtual environment (optional but recommended)**

   ```bash
   python -m venv venv
   source venv/bin/activate   # for Mac/Linux
   venv\Scripts\activate      # for Windows
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Open the Jupyter Notebook**

   ```bash
   jupyter notebook
   ```

5. **Run the Notebook**
   Execute each cell in order to train and test the recommender model.

---

## 🧩 How It Works

1. The dataset includes recipes and their corresponding ingredient lists.
2. Each recipe’s ingredient list is vectorized using **TF-IDF**.
3. When a user inputs available ingredients, the system computes **cosine similarity** between the input and all recipes.
4. Recipes are then ranked and grouped based on the availability of ingredients.

---

## 🔮 Future Enhancements

* 🌐 Add a **Streamlit web app** interface for user-friendly interaction.
* 🗂️ Integrate with real-world recipe APIs (e.g., Spoonacular, Edamam).
* 💬 Add NLP preprocessing to handle synonyms and variations of ingredient names.
* 📱 Build a mobile-friendly version using React Native or Flutter.

**Made with ❤️ using Python and ML.**
