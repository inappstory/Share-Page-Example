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

//this function returns datal, that should be used in meta tags
const viewData = (req, data) => {
  return {
    title: data.title,
    description: data.description,
    storyid: req.params.storyid,
  };
};

//routes
  //get root
app.get("/", (req, res) => {
  res.render("main", {});
});

  //get story by id
app.get("/:storyid", async (req, res) => {
  try {
console.log(PORT);
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
    const apiResponseJSON = await apiResponse.json();
    console.log(apiResponseJSON);

    res.render("sharePage", viewData(req, apiResponseJSON));
    
  } catch (err) {
    console.log(err);
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
