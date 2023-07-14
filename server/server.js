const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const dotenv = require("dotenv");

const envConfig = dotenv.config();
const PORT = envConfig.parsed.PORT;

//set the views engine to mustache
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");

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
    console.log(envConfig.parsed.API_KEY);
    console.log(req.params.storyid);
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

    res.render("template", viewData(req, apiResponseJSON));
    
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
