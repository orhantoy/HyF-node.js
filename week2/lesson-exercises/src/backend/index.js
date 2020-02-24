const express = require("express");
const app = express();
const educations = require("./data/educations");

app.use((req, res, next) => {
  req.isChromeBrowser = req.headers["user-agent"] && req.headers["user-agent"].includes("Chrome");
  next();
});

app.get("/", (req, res) => {
  res.send(`Go to <a href="/educations">Educations</a> page.`);
});

app.get("/educations", (req, res) => {
  // Build filters object
  let filters = {};

  if (req.query.hasOwnProperty("is-university")) {
    filters.isUniversity = req.query["is-university"] === "true";
  }

  if (req.query.hasOwnProperty("attended-before")) {
    filters.attendedBefore = Number(req.query["attended-before"]);
  }

  // Filter educations according to the filters object
  const filteredEducations = educations.filterEducations(filters);

  let htmlBody = "<h1>Educations</h1>";

  if (filteredEducations.length > 0) {
    htmlBody += `<ul>
      ${filteredEducations
        .map(education => `<li>${education.startYear} - ${education.endYear}: <strong>${education.name}</strong></li>`)
        .join("")}
    </ul>`;
  } else {
    htmlBody += "<p>No matching educations were found</p>";
  }

  res.send(`<html>
    <head>
      <title>Educations ${req.isChromeBrowser ? "- Are you using Chrome?" : ""}</title>
    </head>
    <body>
      ${htmlBody}
    </body>
  </html>`);
});

app.get("/api/educations/:educationName", (req, res) => {
  const education = educations.findEducation(req.params.educationName);

  if (education) {
    res.send(education);
  } else {
    res.status(404).send({ error: "education_not_found" });
  }
});

const PORT = 3000;
app.listen(PORT);
