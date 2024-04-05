const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());
const dbConfig = require("./config/dbConfig");
const port = process.env.PORT || 5005;

const usersRoute = require("./routes/usersRoute");
const projectsRoute = require("./routes/projectsRoute");

app.use("/api/users", usersRoute);
app.use("/api/projects", projectsRoute);

app.listen(port, () => console.log(`Node server listening on port ${port}`));
