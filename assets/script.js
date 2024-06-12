document.getElementById('searchBtn').addEventListener('click', () => {
    const ingredients = document.getElementById('ingredient').value.trim();
    if (ingredients) {
        getRecipes(ingredients.split(',').map(ing => ing.trim()));
        getDadJoke();
    }
});

document.getElementById('surpriseBtn').addEventListener('click', () => {
    const ingredients = document.getElementById('ingredient').value.trim();
    if (ingredients) {
        getSurpriseRecipe(ingredients.split(',').map(ing => ing.trim()));
        getDadJoke();
    }
});

document.getElementById('returnBtn').addEventListener('click', () => {
    clearResults();
});

async function getRecipes(ingredients) {
    const recipes = [];
    for (const ingredient of ingredients) {
        const cachedRecipes = localStorage.getItem(ingredient);
        if (cachedRecipes) {
            recipes.push(...JSON.parse(cachedRecipes));
        } else {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
            const data = await response.json();
            if (data.meals) {
                localStorage.setItem(ingredient, JSON.stringify(data.meals));
                recipes.push(...data.meals);
            }
        }
    }
    displayRecipes(recipes);
}

function displayRecipes(recipes) {
    const recipesDiv = document.getElementById('recipes');
    recipesDiv.innerHTML = '';
    const uniqueRecipes = Array.from(new Set(recipes.map(a => a.idMeal)))
        .map(id => {
            return recipes.find(a => a.idMeal === id);
        });
    if (uniqueRecipes.length) {
        uniqueRecipes.forEach(recipe => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <h3>${recipe.strMeal}</h3>
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
            `;
            recipesDiv.appendChild(recipeDiv);
        });
    } else {
        recipesDiv.innerHTML = '<p>No recipes found.</p>';
    }
}

async function getSurpriseRecipe(ingredients) {
    const allRecipes = [];
    for (const ingredient of ingredients) {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
        const data = await response.json();
        if (data.meals) {
            allRecipes.push(...data.meals);
        }
    }
    if (allRecipes.length) {
        const randomRecipe = allRecipes[Math.floor(Math.random() * allRecipes.length)];
        displayRecipes([randomRecipe]);
    } else {
        document.getElementById('recipes').innerHTML = '<p>No recipes found.</p>';
    }
}

async function getDadJoke() {
    const response = await fetch('https://icanhazdadjoke.com/', {
        headers: {
            'Accept': 'application/json'
        }
    });
    const data = await response.json();
    document.getElementById('joke').innerText = data.joke;
}

function clearResults() {
    document.getElementById('recipes').innerHTML = '';
    document.getElementById('joke').innerText = '';
    document.getElementById('ingredient').value = '';
}
