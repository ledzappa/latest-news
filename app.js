const express = require("express");
const Parser = require("rss-parser");
const parser = new Parser();
const app = express();
const urls = [
  "http://www.svt.se/nyheter/rss.xml",
  "https://rss.aftonbladet.se/rss2/small/pages/sections/aftonbladet/",
  "https://feeds.expressen.se/nyheter/",
];

app.get("/news", (req, res) => {
  let feeds = [];
  let counter = 0;
  urls.forEach((url) => {
    parser
      .parseURL(url)
      .then((item) => {
        feeds.push(...item.items);
        counter++;
        if (counter === urls.length) {
          // remove duplicates
          feeds = feeds.filter(
            (v, i, a) => a.findIndex((t) => t.pubDate === v.pubDate) === i
          );
          // sort
          feeds = feeds.sort(
            (a, b) => new Date(b.pubDate) - new Date(a.pubDate)
          );
          // output
          feeds =
            "<ul>" +
            feeds
              .map((feed) => "<li>" + feed.title + "-" + feed.pubDate + "</li>")
              .join("") +
            "</ul>";
          res.send(feeds);
        }
      })
      .catch((e) => counter++);
  });
});

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
