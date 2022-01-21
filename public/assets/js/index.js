const $recipeTitle = $(".recipe-title");
const $recipeText1 = $(".recipe-ingredients");
const $recipeText2 = $(".recipe-steps");
const $saveRecipeBtn = $(".save-recipe");
const $newRecipeBtn = $(".new-recipe");
const $recipeList = $(".list-container .list-group");
const $delBtn = $("<i class='fas fa-trash-alt float-right text-danger delete-recipe'>");

// activeRecipe is used to keep track of the recipe in the textarea
let activeRecipe = {};

// A function for getting all recipes from the db
const getRecipes = () => {
  return $.ajax({
    url: '/api/recipes',
    method: "GET"
  });
};

// A function for saving a recipe to the db
const saveRecipe = (recipe) => {
  return $.ajax({
    url: '/recipes',
    data: recipe,
    method: "POST"
  });
};

// A function for deleting a recipe from the db
const deleteRecipe = (id) => {
  return $.ajax({
    url: '/api/recipes/' + id,
    method: "DELETE"
  });
};

// If there is an activeRecipe, display it, otherwise render empty inputs
const renderActiveRecipe = () => {
  $saveRecipeBtn.hide();

  if (activeRecipe.id) {
    $recipeTitle.attr("readonly", true);
    $recipeText1.attr("readonly", true);
    $recipeText2.attr("readonly", true);
    $recipeTitle.val(activeRecipe.title);
    $recipeText1.val(activeRecipe.text1);
    $recipeText2.val(activeRecipe.text2);
  } else {
    $recipeTitle.attr("readonly", false);
    $recipeText1.attr("readonly", false);
    $recipeText2.attr("readonly", false);
    $recipeTitle.val("");
    $recipeText1.val("");
    $recipeText2.val("");
  };
};

// Get the recipe data from the inputs, save it to the db and update the view
const handleRecipeSave = function () {
  const newRecipe = {
    title: $recipeTitle.val(),
    text1: $recipeText1.val(),
    text2: $recipeText2.val(),
  };

  saveRecipe(newRecipe).then(() => {
    getAndRenderRecipes();
    renderActiveRecipe();
  });
};

// Delete the clicked recipe
const handleRecipeDelete = function (event) {
  // prevents the click listener for the list from being called when the button inside of it is clicked
  event.stopPropagation();

  const recipe = $(this).parent(".list-group-item").data();

  if (activeRecipe.id === recipe.id) {
    activeRecipe = {};
  }

  deleteRecipe(recipe.id).then(() => {
    getAndRenderRecipes();
    renderActiveRecipe();
  });
};

// Sets the activeRecipe and displays it
const handleRecipeView = function () {
  activeRecipe = $(this).data();
  renderActiveRecipe();
};

// Sets the activeRecipe to and empty object and allows the user to enter a new recipe
const handleNewRecipeView = function () {
  activeRecipe = {};
  renderActiveRecipe();
};

// If a recipe's title or text are empty, hide the save button
// Or else show it
const handleRenderSaveBtn = function () {
  if (!$recipeTitle.val().trim() || !$recipeText1.val().trim() || !$recipeText2.val().trim()) {
    $saveRecipeBtn.hide();
  } else {
    $saveRecipeBtn.show();
  };
};

// Render's the list of recipe titles
const renderRecipeList = (recipes) => {
  $recipeList.empty();

  const recipeListItems = [];

  // Returns jquery object for li with given text and delete button
  // unless withDeleteButton argument is provided as false
  const create$li = (text, withDeleteButton = true) => {
    const $li = $("<li class='list-group-item'>");
    const $span = $("<span>").text(text);
    $li.append($span);

    if (withDeleteButton) {
      const $delBtn = $(
        "<i class='fas fa-trash-alt float-right text-danger delete-recipe'>"
      );
      $li.append($delBtn);
    };
    return $li;
  };

  if (recipes.length === 0) {
    recipeListItems.push(create$li("No saved recipes", false));
  };

  Array.from(recipes).forEach((recipe) => {
    const $li = create$li(recipe.title).data(recipe);
    recipeListItems.push($li);
  });

  $recipeList.append(recipeListItems);
};

// Gets recipes from the db and renders them to the sidebar
const getAndRenderRecipes = () => {
  return getRecipes().then(renderRecipeList);
};

// $delBtn.on("click", handleRecipeDelete);
$saveRecipeBtn.on("click", handleRecipeSave);
$recipeList.on("click", ".list-group-item", handleRecipeView);
$newRecipeBtn.on("click", handleNewRecipeView);
$recipeList.on("click", ".delete-recipe", handleRecipeDelete);
$recipeTitle.on("keyup", handleRenderSaveBtn);
$recipeText1.on("keyup", handleRenderSaveBtn);
$recipeText2.on("keyup", handleRenderSaveBtn);

// Gets and renders the initial list of recipes
getAndRenderRecipes();
