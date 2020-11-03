const express = require("express");
const Parser = require("rss-parser");
const parser = new Parser();
const app = express();
const sources = [
  { name: "svt", url: "http://www.svt.se/nyheter/rss.xml" },
  {
    name: "aftonbladet",
    url: "https://rss.aftonbladet.se/rss2/small/pages/sections/aftonbladet/",
  },
  { name: "expressen", url: "https://feeds.expressen.se/nyheter/" },
  { name: "DN", url: "http://www.dn.se/nyheter/m/rss/" },
];

const removeImages = (content) => {
  return content.replace(/<img.*?src="(.*?)"[^\>]+>/g, "");
};

app.get("/news", (req, res) => {
  let feeds = [];
  let counter = 0;
  sources.forEach((source) => {
    parser
      .parseURL(source.url)
      .then((item) => {
        const items = item.items.map((item) => ({
          ...item,
          content: source.name !== "aftonbladet" ? removeImages(item.content) : item.content,
          source: source.name,
        }));
        feeds.push(...items);
        counter++;

        if (counter === sources.length) {
          // remove duplicates and sort
          feeds = feeds
            .filter(
              (v, i, a) => a.findIndex((t) => t.pubDate === v.pubDate) === i
            )
            .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

          res.send(feeds);
        }
      })
      .catch((e) => counter++);
  });
});

app.listen(4000, function () {
  console.log("Example app listening on port 4000!");
});
