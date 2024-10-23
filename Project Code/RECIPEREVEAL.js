document.addEventListener("DOMContentLoaded", () => {
    const savedRecipes = localStorage.getItem("recipes");
    let recipes = savedRecipes ? JSON.parse(savedRecipes) : [];
  
    let newRecipe = {
      name: "",
      description: "",
      image: "",
      video: "",
      ingredients: [],
      steps: [],
      category: "Breakfast",
      favorite: false,
      rating: 0,
      comments: [],
    };
  
    const saveRecipesToLocalStorage = (recipes) => {
      localStorage.setItem("recipes", JSON.stringify(recipes));
    };
  
    const handleAddRecipe = () => {
      const recipeName = document.getElementById("newRecipeName").value;
      const recipeDescription = document.getElementById("newRecipeDescription").value;
      const recipeImage = document.getElementById("newRecipeImage").value;
      const recipeVideo = document.getElementById("newRecipeVideo").value;
  
      if (!recipeName || !recipeDescription || !recipeImage) {
        alert("Please fill in all fields");
        return;
      }

      const youtubeVideoID = extractYouTubeID(recipeVideo);
  
      newRecipe.name = recipeName;
      newRecipe.description = recipeDescription;
      newRecipe.image = recipeImage;
      newRecipe.video = youtubeVideoID; 
  
      recipes.push({ ...newRecipe, id: recipes.length + 1 });
      saveRecipesToLocalStorage(recipes);
      resetNewRecipeForm();
      renderRecipes();
    };
  
    const extractYouTubeID = (url) => {
      const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(regex);
      return match ? match[1] : null; // 
    };
  
    const resetNewRecipeForm = () => {
      document.getElementById("newRecipeName").value = "";
      document.getElementById("newRecipeDescription").value = "";
      document.getElementById("newRecipeImage").value = "";
      document.getElementById("newRecipeVideo").value = "";
      document.getElementById("newIngredient").value = "";
      document.getElementById("newStep").value = "";
      newRecipe.ingredients = [];
      newRecipe.steps = [];
    };
  
    const handleAddIngredient = () => {
      const ingredient = document.getElementById("newIngredient").value;
      if (ingredient) {
        newRecipe.ingredients.push(ingredient);
        document.getElementById("newIngredient").value = "";
      }
    };
  
    const handleAddStep = () => {
      const step = document.getElementById("newStep").value;
      if (step) {
        newRecipe.steps.push(step);
        document.getElementById("newStep").value = "";
      }
    };
  
    const handleDeleteRecipe = (id) => {
      recipes = recipes.filter((recipe) => recipe.id !== id);
      saveRecipesToLocalStorage(recipes);
      renderRecipes();
    };
  
    const renderRecipes = () => {
      const recipeGrid = document.getElementById("recipeGrid");
      recipeGrid.innerHTML = "";
  
      recipes.forEach((recipe) => {
        const recipeCard = document.createElement("div");
        recipeCard.className = "recipe-card";
  
        const img = document.createElement("img");
        img.src = recipe.image;
        img.alt = recipe.name;
        recipeCard.appendChild(img);

        const h3 = document.createElement("h3");
        h3.textContent = recipe.name;
        recipeCard.appendChild(h3);
        const p = document.createElement("p");
        p.textContent = recipe.description;
        recipeCard.appendChild(p);
          const ingredientsList = document.createElement("ul");
        recipe.ingredients.forEach((ingredient) => {
          const li = document.createElement("li");
          li.textContent = ingredient;
          ingredientsList.appendChild(li);
        });
        recipeCard.appendChild(ingredientsList);
  
        const stepsList = document.createElement("ol");
        recipe.steps.forEach((step) => {
          const li = document.createElement("li");
          li.textContent = step;
          stepsList.appendChild(li);
        });
        recipeCard.appendChild(stepsList);
  
        if (recipe.video) {
          const iframe = document.createElement("iframe");
          iframe.width = "300";
          iframe.height = "200";
          iframe.src = `https://www.youtube.com/embed/${recipe.video}`;
          iframe.setAttribute("frameborder", "0");
          iframe.setAttribute("allowfullscreen", "true");
          recipeCard.appendChild(iframe);
        }
  
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => handleDeleteRecipe(recipe.id);
        recipeCard.appendChild(deleteButton);
  
        recipeGrid.appendChild(recipeCard);
      });
    };

    document.getElementById("addRecipeButton").onclick = handleAddRecipe;
    document.getElementById("addIngredientButton").onclick = handleAddIngredient;
    document.getElementById("addStepButton").onclick = handleAddStep;
    const handleSearch = () => {
      const searchTerm = document.getElementById("searchBar").value.toLowerCase();
      const filteredRecipes = recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchTerm) ||
        recipe.description.toLowerCase().includes(searchTerm)
      );
      renderRecipes(filteredRecipes);
    };
        document.getElementById("searchBar").addEventListener("input", handleSearch);
    
    renderRecipes(); 
  });
  