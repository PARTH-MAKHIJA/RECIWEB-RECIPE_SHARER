import React, { useState, useEffect } from 'react';
import './RecipeBook.css';

const RecipeBook = () => {
  const [recipes, setRecipes] = useState(() => {
    const savedRecipes = localStorage.getItem('recipes');
    return savedRecipes ? JSON.parse(savedRecipes) : [];
  });

  const [newRecipe, setNewRecipe] = useState({
    name: '',
    description: '',
    image: '',
    video: '',
    ingredients: [],
    steps: [],
    category: 'Breakfast',
    favorite: false,
    rating: 0,
    comments: []
  });

  const [newIngredient, setNewIngredient] = useState('');
  const [newStep, setNewStep] = useState('');
  const [newComment, setNewComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert'];

  // Function to save recipes to local storage
  const saveRecipesToLocalStorage = (recipes) => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  };

  // Add new recipe
  const handleAddRecipe = () => {
    if (!newRecipe.name || !newRecipe.description || !newRecipe.image) {
      alert('Please fill in all fields');
      return;
    }
    const updatedRecipes = [...recipes, { ...newRecipe, id: recipes.length + 1 }];
    setRecipes(updatedRecipes);
    saveRecipesToLocalStorage(updatedRecipes);
    setNewRecipe({
      name: '',
      description: '',
      image: '',
      video: '',
      ingredients: [],
      steps: [],
      category: 'Breakfast',
      favorite: false,
      rating: 0,
      comments: []
    });
    setImagePreview('');
  };

  // Add ingredient
  const handleAddIngredient = () => {
    setNewRecipe({ ...newRecipe, ingredients: [...newRecipe.ingredients, newIngredient] });
    setNewIngredient('');
  };

  // Add step
  const handleAddStep = () => {
    setNewRecipe({ ...newRecipe, steps: [...newRecipe.steps, newStep] });
    setNewStep('');
  };

  // Delete recipe
  const handleDeleteRecipe = (id) => {
    const updatedRecipes = recipes.filter((recipe) => recipe.id !== id);
    setRecipes(updatedRecipes);
    saveRecipesToLocalStorage(updatedRecipes);
  };

  // Edit recipe
  const handleEditRecipe = (recipe) => {
    setIsEditing(true);
    setCurrentRecipe(recipe);
    setImagePreview(recipe.image);
  };

  // Update recipe
  const handleUpdateRecipe = () => {
    const updatedRecipes = recipes.map((recipe) =>
      recipe.id === currentRecipe.id ? currentRecipe : recipe
    );
    setRecipes(updatedRecipes);
    saveRecipesToLocalStorage(updatedRecipes);
    setIsEditing(false);
    setCurrentRecipe(null);
    setImagePreview('');
  };

  // Handle image change with preview
  const handleImageChange = (e) => {
    const url = e.target.value;
    setNewRecipe({ ...newRecipe, image: url });

    if (url.match(/\.(jpeg|jpg|gif|png)$/)) {
      setImagePreview(url);
    } else {
      setImagePreview('');
    }
  };

  // Extract YouTube video ID from the URL
  const extractYouTubeID = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Search filter
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.ingredients.some((ingredient) =>
      ingredient.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Add comment
  const handleAddComment = (recipeId) => {
    const updatedRecipes = recipes.map((recipe) =>
      recipe.id === recipeId
        ? { ...recipe, comments: [...(recipe.comments || []), newComment] }
        : recipe
    );
    setRecipes(updatedRecipes);
    saveRecipesToLocalStorage(updatedRecipes);
    setNewComment('');
  };

  // Toggle favorite
  const toggleFavorite = (id) => {
    const updatedRecipes = recipes.map((recipe) =>
      recipe.id === id ? { ...recipe, favorite: !recipe.favorite } : recipe
    );
    setRecipes(updatedRecipes);
    saveRecipesToLocalStorage(updatedRecipes);
  };

  // Drag & Drop functionality
  const handleDragStart = (index) => {
    setDraggedItem(index);
  };

  const handleDragEnter = (index) => {
    const updatedRecipes = [...recipes];
    const draggedRecipe = updatedRecipes[draggedItem];
    updatedRecipes.splice(draggedItem, 1);
    updatedRecipes.splice(index, 0, draggedRecipe);
    setRecipes(updatedRecipes);
    saveRecipesToLocalStorage(updatedRecipes);
    setDraggedItem(index);
  };

  return (
    <div className="recipe-book">
      <h1>"Add Your Recipe Now!"-Contribute to our recipe collection and showcase your unique flavors.</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search Recipes"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="recipe-grid">
        {filteredRecipes.map((recipe, index) => (
          <div
            key={recipe.id}
            className="recipe-card"
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
          >
            <img src={recipe.image} alt={recipe.name} />
            <h3>{recipe.name}</h3>
            <p>{recipe.description}</p>

            <div>
              <strong>Ingredients:</strong>
              <ul>
                {recipe.ingredients.map((ingredient, idx) => (
                  <li key={idx}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div>
              <strong>Steps:</strong>
              <ol>
                {recipe.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>

            {recipe.video && extractYouTubeID(recipe.video) && (
              <div className="video-container">
                <iframe
                  width="300"
                  height="200"
                  src={`https://www.youtube.com/embed/${extractYouTubeID(recipe.video)}`}
                  title={recipe.name}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            )}

            <button onClick={() => toggleFavorite(recipe.id)}>
              {recipe.favorite ? 'Unfavorite' : 'Favorite'}
            </button>

            <div className="buttons">
              <button onClick={() => handleEditRecipe(recipe)}>Edit</button>
              <button onClick={() => handleDeleteRecipe(recipe.id)}>Delete</button>
            </div>

            <div>
              <strong>Comments:</strong>
              <ul>
                {recipe.comments.map((comment, idx) => (
                  <li key={idx}>{comment}</li>
                ))}
              </ul>
              <input
                type="text"
                placeholder="Add a comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button onClick={() => handleAddComment(recipe.id)}>Add Comment</button>
            </div>
          </div>
        ))}
      </div>

      <div className="recipe-form">
        {isEditing ? (
          <div>
            <h3>Edit Recipe</h3>
            <input
              type="text"
              value={currentRecipe.name}
              onChange={(e) =>
                setCurrentRecipe({ ...currentRecipe, name: e.target.value })
              }
            />
            <textarea
              value={currentRecipe.description}
              onChange={(e) =>
                setCurrentRecipe({ ...currentRecipe, description: e.target.value })
              }
            />
            <input
              type="text"
              value={currentRecipe.image}
              onChange={(e) =>
                setCurrentRecipe({ ...currentRecipe, image: e.target.value })
              }
            />
            {imagePreview && <img src={imagePreview} alt="Image Preview" />}
            <button onClick={handleUpdateRecipe}>Update Recipe</button>
          </div>
        ) : (
          <div>
            <h3>Add New Recipe</h3>
            <input
              type="text"
              placeholder="Recipe Name"
              value={newRecipe.name}
              onChange={(e) =>
                setNewRecipe({ ...newRecipe, name: e.target.value })
              }
            />
            <textarea
              placeholder="Recipe Description"
              value={newRecipe.description}
              onChange={(e) =>
                setNewRecipe({ ...newRecipe, description: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newRecipe.image}
              onChange={handleImageChange}
            />
            {imagePreview && <img src={imagePreview} alt="Image Preview" />}
            <input
              type="text"
              placeholder="YouTube Video URL"
              value={newRecipe.video}
              onChange={(e) =>
                setNewRecipe({ ...newRecipe, video: e.target.value })
              }
            />
            <div>
              <h4>Ingredients</h4>
              <input
                type="text"
                placeholder="Add ingredient"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
              />
              <button onClick={handleAddIngredient}>Add Ingredient</button>
              <ul>
                {newRecipe.ingredients.map((ingredient, idx) => (
                  <li key={idx}>{ingredient}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Steps</h4>
              <input
                type="text"
                placeholder="Add step"
                value={newStep}
                onChange={(e) => setNewStep(e.target.value)}
              />
              <button onClick={handleAddStep}>Add Step</button>
              <ol>
                {newRecipe.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
            <button onClick={handleAddRecipe}>Add Recipe</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeBook;
