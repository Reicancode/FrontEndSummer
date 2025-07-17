import React, { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = "becd6e76242b4ed281c41af0f5a6f8e7";
const LIBRE_TRANSLATE_URL = "https://libretranslate.de/translate";

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
    darkMode: "🌙 Dark",
    translating: "Translating..."
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
    darkMode: "🌙 Тёмная",
    translating: "Перевод..."
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
    darkMode: "🌙 Қоңыр",
    translating: "Аударылуда..."
  }
};

async function translateText(text, sourceLang, targetLang = 'en') {
  if (sourceLang === targetLang) return text;
  
  try {
    const response = await axios.post(LIBRE_TRANSLATE_URL, {
      q: text,
      source: sourceLang,
      target: targetLang,
      format: "text"
    });
    
    return response.data.translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}

function App() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const t = (key) => translations[language][key] || key;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      let englishQuery = query;
      if (language !== 'en') {
        setTranslating(true);
        englishQuery = await translateText(query, language, 'en');
        setTranslating(false);
      }
      
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
      setTranslating(false);
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
            : `repeat(auto-fit, minmax(${isMobile ? '150px' : '220px'}, 1fr))`,
          gap: isMobile ? "12px" : "16px",
          padding: isMobile ? "8px" : "16px",
          justifyItems: isSingleCard ? "center" : "stretch",
        }}
      >
        {recipesList.map((recipe) => (
          <div
            key={recipe.id}
            style={{
              width: isSingleCard ? "100%" : "100%",
              maxWidth: isSingleCard ? (isMobile ? "280px" : "400px") : "none",
              border: `1px solid ${darkMode ? "#444" : "#ddd"}`,
              borderRadius: "8px",
              padding: isMobile ? "8px" : "12px",
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
                margin: "0 0 8px 0",
                fontSize: isMobile ? "14px" : "16px",
                minHeight: isMobile ? "36px" : "40px",
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
                height: isMobile ? "120px" : "160px",
                objectFit: "cover",
                borderRadius: "6px",
                marginBottom: "8px",
              }}
            />
            <div
              style={{
                marginTop: "auto",
                display: "flex",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              <a
                href={`https://spoonacular.com/recipes/${recipe.title
                  .toLowerCase()
                  .replace(/ /g, "-")}-${recipe.id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: isMobile ? "4px 8px" : "6px 10px",
                  background: "#008CBA",
                  color: "#fff",
                  borderRadius: "4px",
                  textDecoration: "none",
                  fontSize: isMobile ? "12px" : "14px",
                }}
              >
                {t('viewButton')}
              </a>
              <button
                onClick={() => toggleFavorite(recipe)}
                style={{
                  padding: isMobile ? "4px 8px" : "6px 10px",
                  background: favorites.find((f) => f.id === recipe.id)
                    ? "#FF6347"
                    : darkMode
                    ? "#555"
                    : "#ddd",
                  color: darkMode ? "#fff" : "#000",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: isMobile ? "12px" : "14px",
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
        padding: isMobile ? "12px" : "20px",
      }}
    >
      <div style={{ 
        maxWidth: "1400px", 
        margin: "0 auto",
        width: "100%"
      }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: isMobile ? "16px" : "20px",
            flexWrap: "wrap",
            gap: isMobile ? "8px" : "16px",
          }}
        >
          <h1 style={{ 
            margin: 0, 
            fontSize: isMobile ? "20px" : "24px",
            whiteSpace: "nowrap"
          }}>
            {t('title')}
          </h1>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: isMobile ? "6px" : "10px",
            flexWrap: "wrap",
            justifyContent: "flex-end"
          }}>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                padding: isMobile ? "6px" : "8px",
                background: darkMode ? "#333" : "#ddd",
                color: darkMode ? "#fff" : "#000",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: isMobile ? "12px" : "14px",
              }}
            >
              <option value="en">English</option>
              <option value="ru">Русский</option>
              <option value="kk">Қазақша</option>
            </select>
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                padding: isMobile ? "6px 8px" : "8px 12px",
                background: darkMode ? "#333" : "#ddd",
                color: darkMode ? "#fff" : "#000",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: isMobile ? "12px" : "14px",
                whiteSpace: "nowrap"
              }}
            >
              {darkMode ? t('lightMode') : t('darkMode')}
            </button>
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              style={{
                padding: isMobile ? "6px 8px" : "8px 12px",
                background: showFavorites ? "#FF9800" : "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: isMobile ? "12px" : "14px",
                whiteSpace: "nowrap"
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
            marginBottom: isMobile ? "16px" : "20px",
            display: "flex",
            flexWrap: "wrap",
            gap: isMobile ? "8px" : "10px",
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
              padding: isMobile ? "8px" : "10px",
              flex: "1 1 200px",
              background: darkMode ? "#333" : "#fff",
              color: darkMode ? "#fff" : "#000",
              border: `1px solid ${darkMode ? "#555" : "#ccc"}`,
              borderRadius: "4px",
              fontSize: isMobile ? "13px" : "14px",
              minWidth: "150px",
            }}
          />
          <button
            onClick={searchRecipes}
            disabled={loading || translating}
            style={{
              padding: isMobile ? "8px 12px" : "10px 16px",
              background: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: isMobile ? "13px" : "14px",
              flex: "0 0 auto",
              opacity: (loading || translating) ? 0.7 : 1,
              whiteSpace: "nowrap"
            }}
          >
            {translating ? t('translating') : t('searchButton')}
          </button>
        </div>

        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: isMobile ? "30px" : "40px",
              color: darkMode ? "#aaa" : "#666",
            }}
          >
            {t('loading')}
          </div>
        )}

        {error && (
          <div
            style={{
              padding: isMobile ? "10px" : "12px",
              background: darkMode ? "#ff444422" : "#ff444411",
              color: "#ff4444",
              borderRadius: "4px",
              marginBottom: isMobile ? "12px" : "16px",
              fontSize: isMobile ? "13px" : "14px",
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
                padding: isMobile ? "30px" : "40px",
                color: darkMode ? "#aaa" : "#666",
                fontSize: isMobile ? "14px" : "16px",
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