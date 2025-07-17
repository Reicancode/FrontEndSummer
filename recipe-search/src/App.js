import React, { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = "becd6e76242b4ed281c41af0f5a6f8e7";

// Translation dictionaries
const translations = {
  en: {
    title: "Recipe Finder",
    searchPlaceholder: "Search ingredients (e.g. chicken, rice)",
    searchButton: "Search",
    viewButton: "View",
    favoritesButton: "Favorites",
    allRecipesButton: "All Recipes",
    loading: "Loading recipes...",
    noResults: "Nothing found for your ingredients.",
    error: "Error fetching recipes. Please try again later.",
    noFavorites: "Your favorites list is empty. Add some recipes!",
    lightMode: "☀️ Light",
    darkMode: "🌙 Dark"
  },
  ru: {
    title: "Поиск рецептов",
    searchPlaceholder: "Ингредиенты (например, курица, рис)",
    searchButton: "Поиск",
    viewButton: "Просмотр",
    favoritesButton: "Избранное",
    allRecipesButton: "Все рецепты",
    loading: "Загрузка рецептов...",
    noResults: "По вашим ингредиентам ничего не найдено.",
    error: "Ошибка при загрузке рецептов. Пожалуйста, попробуйте позже.",
    noFavorites: "Ваш список избранного пуст. Добавьте рецепты!",
    lightMode: "☀️ Светлая",
    darkMode: "🌙 Тёмная"
  },
  kk: {
    title: "Рецепт іздеу",
    searchPlaceholder: "Ингредиенттер (мысалы, тауық, күріш)",
    searchButton: "Іздеу",
    viewButton: "Қарау",
    favoritesButton: "Таңдаулылар",
    allRecipesButton: "Барлық рецептер",
    loading: "Рецепттер жүктелуде...",
    noResults: "Сіздің ингредиенттеріңіз бойынша ештеңе табылмады.",
    error: "Рецепттерді жүктеу кезінде қате пайда болды. Кейінірек қайталаңыз.",
    noFavorites: "Таңдаулылар тізімі бос. Рецепттер қосыңыз!",
    lightMode: "☀️ Ашық",
    darkMode: "🌙 Қоңыр"
  }
};

// Common ingredient translations
const ingredientTranslations = {
  chicken: { ru: "курица", kk: "тауық" },
  rice: { ru: "рис", kk: "күріш" },
  egg: { ru: "яйцо", kk: "жұмыртқа" },
  milk: { ru: "молоко", kk: "сүт" },
  beef: { ru: "говядина", kk: "сиыр еті" },
  potato: { ru: "картофель", kk: "картоп" },
  tomato: { ru: "помидор", kk: "қызанақ" },
  onion: { ru: "лук", kk: "пияз" }
};

function translateIngredients(text, fromLang, toLang = 'en') {
  if (fromLang === 'en') return text;
  
  const ingredients = text.split(',').map(ingredient => {
    const trimmed = ingredient.trim().toLowerCase();
    // Find translation in our dictionary
    for (const [enIngredient, translations] of Object.entries(ingredientTranslations)) {
      if (translations[fromLang] && translations[fromLang].toLowerCase() === trimmed) {
        return enIngredient;
      }
    }
    return ingredient; // return original if no translation found
  });
  
  return ingredients.join(', ');
}

function App() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en', 'ru', 'kk'

  const t = (key) => translations[language][key] || key;

  useEffect(() => {
    const storedFavorites = localStorage.getItem("recipeFavorites");
    const storedLanguage = localStorage.getItem("recipeLanguage") || 'en';
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
    setLanguage(storedLanguage);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("recipeFavorites", JSON.stringify(favorites));
      localStorage.setItem("recipeLanguage", language);
    }
  }, [favorites, language, isInitialized]);

  const searchRecipes = async () => {
    if (!query.trim()) {
      setError(t('noResults'));
      return;
    }

    setLoading(true);
    setError("");
    setRecipes([]);

    try {
      // Translate ingredients to English before searching
      const englishQuery = language === 'en' ? query : translateIngredients(query, language);
      
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/findByIngredients`,
        {
          params: {
            ingredients: englishQuery,
            number: 12,
            apiKey: API_KEY,
          },
        }
      );

      if (response.data.length === 0) {
        setError(t('noResults'));
      } else {
        setRecipes(response.data);
      }
    } catch (err) {
      console.error(err);
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (recipe) => {
    const exists = favorites.find((fav) => fav.id === recipe.id);
    if (exists) {
      setFavorites(favorites.filter((fav) => fav.id !== recipe.id));
    } else {
      setFavorites([...favorites, recipe]);
    }
  };

  const renderRecipes = (recipesList) => {
    const isSingleCard = recipesList.length === 1;
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isSingleCard
            ? "1fr"
            : "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          padding: "16px",
          justifyItems: isSingleCard ? "center" : "stretch",
        }}
      >
        {recipesList.map((recipe) => (
          <div
            key={recipe.id}
            style={{
              width: isSingleCard ? "100%" : "100%",
              maxWidth: isSingleCard ? "400px" : "none",
              border: `1px solid ${darkMode ? "#444" : "#ddd"}`,
              borderRadius: "8px",
              padding: "12px",
              textAlign: "center",
              backgroundColor: darkMode ? "#2c2c2c" : "#f9f9f9",
              color: darkMode ? "#fff" : "#000",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              margin: "0 auto",
            }}
          >
            <h3
              style={{
                margin: "0 0 12px 0",
                fontSize: "16px",
                minHeight: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {recipe.title}
            </h3>
            <img
              src={recipe.image}
              alt={recipe.title}
              style={{
                width: "100%",
                height: "160px",
                objectFit: "cover",
                borderRadius: "6px",
                marginBottom: "12px",
              }}
            />
            <div
              style={{
                marginTop: "auto",
                display: "flex",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <a
                href={`https://spoonacular.com/recipes/${recipe.title
                  .toLowerCase()
                  .replace(/ /g, "-")}-${recipe.id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "6px 10px",
                  background: "#008CBA",
                  color: "#fff",
                  borderRadius: "4px",
                  textDecoration: "none",
                  fontSize: "14px",
                }}
              >
                {t('viewButton')}
              </a>
              <button
                onClick={() => toggleFavorite(recipe)}
                style={{
                  padding: "6px 10px",
                  background: favorites.find((f) => f.id === recipe.id)
                    ? "#FF6347"
                    : darkMode
                    ? "#555"
                    : "#ddd",
                  color: darkMode ? "#fff" : "#000",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                {favorites.find((f) => f.id === recipe.id) ? "♥" : "♡"}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        fontFamily: "Arial",
        backgroundColor: darkMode ? "#121212" : "#f0f0f0",
        minHeight: "100vh",
        color: darkMode ? "#fff" : "#000",
        margin: 0,
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "24px" }}>{t('title')}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                padding: "8px",
                background: darkMode ? "#333" : "#ddd",
                color: darkMode ? "#fff" : "#000",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              <option value="en">English</option>
              <option value="ru">Русский</option>
              <option value="kk">Қазақша</option>
            </select>
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                padding: "8px 12px",
                background: darkMode ? "#333" : "#ddd",
                color: darkMode ? "#fff" : "#000",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              {darkMode ? t('lightMode') : t('darkMode')}
            </button>
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              style={{
                padding: "8px 12px",
                background: showFavorites ? "#FF9800" : "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              {showFavorites
                ? t('allRecipesButton')
                : `${t('favoritesButton')} (${favorites.length})`}
            </button>
          </div>
        </div>

        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && searchRecipes()}
            style={{
              padding: "10px",
              flex: "1 1 300px",
              background: darkMode ? "#333" : "#fff",
              color: darkMode ? "#fff" : "#000",
              border: `1px solid ${darkMode ? "#555" : "#ccc"}`,
              borderRadius: "4px",
              fontSize: "14px",
              maxWidth: "500px",
            }}
          />
          <button
            onClick={searchRecipes}
            style={{
              padding: "10px 16px",
              background: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              flex: "0 0 auto",
            }}
          >
            {t('searchButton')}
          </button>
        </div>

        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: darkMode ? "#aaa" : "#666",
            }}
          >
            {t('loading')}
          </div>
        )}

        {error && (
          <div
            style={{
              padding: "12px",
              background: darkMode ? "#ff444422" : "#ff444411",
              color: "#ff4444",
              borderRadius: "4px",
              marginBottom: "16px",
            }}
          >
            {error}
          </div>
        )}

        {showFavorites ? (
          favorites.length > 0 ? (
            renderRecipes(favorites)
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: darkMode ? "#aaa" : "#666",
              }}
            >
              {t('noFavorites')}
            </div>
          )
        ) : (
          renderRecipes(recipes)
        )}
      </div>
    </div>
  );
}

export default App;