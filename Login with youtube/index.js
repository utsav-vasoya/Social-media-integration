const express = require('express')
const app = express();
const axios = require("axios");
const apiKey = "AIzaSyDcAGG22OYXnBvm6kgXrxMCT-Eu8eejLi8";
const apiUrl = "https://www.googleapis.com/youtube/v3";
const { google } = require("googleapis");

//Better way
const youtube = google.youtube({
  version: "v3",
  auth: apiKey,
});

app.get("/search-with-googleapis", async (req, res) => {
  try {
    const searchQuery = req.query.search;
    const response = await youtube.search.list({
      part: "snippet",
      q: searchQuery,
      maxResults: 10,
    });

    const titles = response.data.items.map((item) => {
      var id = item.id.videoId;
      var urls = `https://www.youtube.com/watch?v=${id}`;
      item.videolink = urls
    });
    res.send(response.data.items);
  } catch (err) {
    res.send(err);
  }
});


//2nd way
app.get("/search", async (req, res) => {
  try {
    const searchQuery = req.query.search;
    const url = `${apiUrl}/search?key=${apiKey}&type=video&part=snippet&q=${searchQuery}`;

    const response = await axios.get(url);
    const titles = response.data.items.map((item) => {
      var id = item.id.videoId;
      var urls = `https://www.youtube.com/watch?v=${id}`;
      item.videolink = urls
    });
    res.send(response.data.items);
  } catch (err) {
    res.send(err);
  }
});

app.listen(6004, () => {
  console.log('Server is up and running at the port 8000')
})