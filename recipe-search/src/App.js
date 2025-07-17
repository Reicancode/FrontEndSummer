import React, { useState } from "react";
import axios from "axios";

const API_KEY = "becd6e76242b4ed281c41af0f5a6f8e7"; // <-- вставь свой ключ

function App() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const searchRecipes = async () => {
    if (!query.trim()) {
      setError("Insert ingredients to search for recipes.");
      return;
    }

    setLoading(true);
    setError("");
    setRecipes([]);

    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/findByIngredients`,
        {
          params: {
            ingredients: query,
            number: 12,
            apiKey: API_KEY,
          },
        }
      );

      if (response.data.length === 0) {
        setError("Nothing found for your ingredients.");
      } else {
        setRecipes(response.data);
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching recipes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial", maxWidth: 1200, margin: "0 auto" }}>
      <h1>Product search</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Products (e.g. chicken, rice)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: 10, width: "300px", marginRight: 10 }}
        />
        <button onClick={searchRecipes} style={{ padding: 10 }}>
          Find Recipes
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 20,
        }}
      >
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 10,
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <h3>{recipe.title}</h3>
            <img
              src={recipe.image}
              alt={recipe.title}
              style={{ width: "100%", borderRadius: 6 }}
            />
            <a
              href={`https://spoonacular.com/recipes/${recipe.title
                .toLowerCase()
                .replace(/ /g, "-")}-${recipe.id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginTop: 10,
                background: "#008CBA",
                color: "white",
                padding: "8px 12px",
                borderRadius: 6,
                textDecoration: "none",
              }}
            >
              Open Recipe
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
