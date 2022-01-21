// Dependencies
// =============================================================
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
let dbJSON = require('./db.json');
const path = require('path');

const app = express();
let PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/recipes', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/recipes.html'));
});

app.delete("/api/recipes/:id", function (req, res) {
  fs.readFile("db.json", function (err, data) {
    if (err) throw err;
    let allRecipes = JSON.parse(data);
    let newRecipes = allRecipes.filter((recipe) => {
      if(recipe.id !== req.params.id) {
        return true;
      }
    });
    fs.writeFile(path.join(__dirname, "db.json"), 
    JSON.stringify(newRecipes), (err) => {
      if (err) {
        return res.json({error: "Error writing to file"});
      }
  
      return res.json(newRecipes);
    });
  });
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html')); 
});

app.get("/api/recipes", function (req, res) {
  fs.readFile("db.json", function (err, data) {
    if (err) throw err;
    let allRecipes = JSON.parse(data);
    return res.json(allRecipes);
  });
});

app.post('/recipes', function(req, res) {
  // Validate request body
  if(!req.body.title) {
    return res.json({error: "Missing required title"});
  }

  // Copy request body and generate ID
  const recipe = {...req.body, id: uuidv4()}

  // Push recipe to dbJSON array - saves data in memory
  dbJSON.push(recipe);

  // Saves data to file by persisting in memory variable dbJSON to db.json file.
  // This is needed because when we turn off server we loose all memory data like pbJSON variable.
  // Saving to file allows us to read previous recipes (before server was shutdown) from file.
  // fs.writeFile(path.join(__dirname, "db.json"), JSON.stringify(dbJSON, null, 2), (err) => {
  //   if (err) {
  //     return res.json({error: "Error writing to file"});
  //   }

  //   return res.json(recipe);
  // });

  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedRecipes = JSON.parse(data);

      // Add a new review
      parsedRecipes.push(recipe);

      // Write updated recipes back to the file
      fs.writeFile(
        'db.json',
        JSON.stringify(parsedRecipes, null, 4),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info('Successfully updated recipes!')
      );

      return res.json(recipe);
    }
  });
});

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
