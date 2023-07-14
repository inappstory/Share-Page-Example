//add dependencies
const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const dotenv = require("dotenv");

//configure environment avriables
const envConfig = dotenv.config();
const PORT = envConfig.parsed.PORT;

//set the view engine to mustache
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");

//routes
  //get root
app.get("/", (req, res) => {
  res.render("main", {
    title: "Main",
    apiKey: envConfig.parsed.API_KEY,
  });
});

  //get story by id
app.get("/:storyid", async (req, res) => {
  try {
    const apiResponse = await fetch(
      "https://api.inappstory.com/v2/story-share-page-info/" +
        req.params.storyid,
      {
        headers: {
          Authorization:
            "Bearer " + envConfig.parsed.API_KEY,
        },
      }
    );
    const data = await apiResponse.json();

    res.render("sharePage", {
      title: data.title,
      description: data.description,
      storyid: req.params.storyid,
      apiKey: envConfig.parsed.API_KEY,
    });
    
  } catch (err) {
     res.status(500).send('Something went wrong');
     return;
  }
  
});

//server listener
app.listen(PORT, (err) => {
  if (err) {
    console.log(`There was a problem :(, ${err}`);
  }
  console.log(`Server is running at localhost on port ${PORT}`);
});
