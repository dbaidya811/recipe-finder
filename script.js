// Replace with your Spoonacular API key
const API_KEY = 'ae314afd755347478b3f8a34b42fa163';

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const randomRecipesContainer = document.getElementById('random-recipes');
const randomLoading = document.getElementById('random-loading');
const recipeDetailsSection = document.getElementById('recipe-details-section');
const recipeDetails = document.getElementById('recipe-details');
const recipeLoading = document.getElementById('recipe-loading');

// Show/hide loading indicators
function setLoading(element, isLoading) {
    if (isLoading) {
        element.classList.remove('hidden');
    } else {
        element.classList.add('hidden');
    }
}

// Fetch and display 4 random recipes
async function loadRandomRecipes() {
    setLoading(randomLoading, true);
    randomRecipesContainer.innerHTML = '';
    try {
        const res = await fetch(`https://api.spoonacular.com/recipes/random?number=4&apiKey=${API_KEY}`);
        const data = await res.json();
        if (data.recipes) {
            data.recipes.forEach(recipe => {
                const card = document.createElement('div');
                card.className = 'recipe-card';
                card.innerHTML = `
                    <img src="${recipe.image}" alt="${recipe.title}">
                    <div class="recipe-card-title">${recipe.title}</div>
                `;
                card.addEventListener('click', () => loadRecipeDetails(recipe.id));
                randomRecipesContainer.appendChild(card);
            });
        }
    } catch (err) {
        randomRecipesContainer.innerHTML = '<div style="color:red">Failed to load suggestions.</div>';
    }
    setLoading(randomLoading, false);
}

// Fetch and display recipe details by ID
async function loadRecipeDetails(recipeId) {
    setLoading(recipeLoading, true);
    recipeDetails.innerHTML = '';
    try {
        const res = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`);
        const data = await res.json();
        renderRecipeDetails(data);
    } catch (err) {
        recipeDetails.innerHTML = '<div style="color:red">Failed to load recipe details.</div>';
    }
    setLoading(recipeLoading, false);
}

// Render recipe details in the DOM
function renderRecipeDetails(recipe) {
    recipeDetails.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.title}">
        <h2>${recipe.title}</h2>
        <h3>Ingredients</h3>
        <ul>
            ${recipe.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join('')}
        </ul>
        <h3>Instructions</h3>
        <div class="instructions">${recipe.instructions ? recipe.instructions : 'No instructions available.'}</div>
    `;
}

// Handle search form submit
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;
    setLoading(recipeLoading, true);
    recipeDetails.innerHTML = '';
    try {
        const res = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&number=1&apiKey=${API_KEY}`);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
            await loadRecipeDetails(data.results[0].id);
        } else {
            recipeDetails.innerHTML = '<div style="color:red">No recipes found for that search.</div>';
        }
    } catch (err) {
        recipeDetails.innerHTML = '<div style="color:red">Failed to search for recipes.</div>';
    }
    setLoading(recipeLoading, false);
});

// Initial load
window.addEventListener('DOMContentLoaded', () => {
    loadRandomRecipes();
}); 