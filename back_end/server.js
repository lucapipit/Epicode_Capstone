const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");//cors serve a collegare backend con frontend
const PORT = 5050;
const path = require("path");//multer

const app = express();
require("dotenv").config();// dotenv serve per far funzionare il file .env

//imports
const authorRoutes = require("./routes/authors");
const loginRoutes = require("./routes/login");
const dbProvaRoutes = require("./routes/dbProva");
const postRoutes = require("./routes/posts");
const commentRouter = require("./routes/comments")
const githubRoute = require("./routes/githubOauth");
const googleRoute = require("./routes/googleOauth");
const facebookRoute = require("./routes/facebookOauth");
const logger = require("./middlewares/logger");

//middleware
app.use(express.json());
app.use(cors());//collegamento backend-fronted
/* app.use(logger); *///logger globale...anche se non funziona
app.use("/uploads", express.static("uploads"));//multer => app.use("./uploads", express.static(path.join(__dirname, "./uploads")));
app.use("/", authorRoutes);
app.use("/", loginRoutes);
app.use("/", dbProvaRoutes);
app.use("/", postRoutes);
app.use("/", commentRouter);
app.use("/", githubRoute);
app.use("/", googleRoute);
app.use("/", facebookRoute);



//connessione a MongoDB
mongoose.connect(process.env.MONGO_DB_URL);//connessione tra backend e database
const db = mongoose.connection;//??
db.on("error", console.error.bind(console, "Errore di connessione"));
db.once("open", ()=>console.log("Database connesso con successo!!!!"))

//ultima riga
app.listen(PORT, ()=>console.log(`server avviato nella porta ${PORT}`))