const express = require("express");
const mongoose = require("mongoose");
const app = express();
const session = require("express-session");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const path = require("path");
const ExpressError = require("./utils/ExpressError");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const userRoutes = require("./routes/user");
const diaryRoutes = require("./routes/foodDiary");
const recipeRoutes = require("./routes/recipe");
const commentRoutes = require("./routes/comment");

mongoose.connect("mongodb://localhost:27017/fitness-hub", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

// Query String for methodOverride
app.use(methodOverride("_method"));

// Parses the req.body so we can access it.
app.use(express.urlencoded({ extended: true }));

const sessionConfig = {
    secret: "thisshouldbeabettersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() * 1000 * 60 * 60 * 24,
        maxAge: 1000 * 60 * 60 * 24
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/", (req, res) => {
    // Send style sheet location and title of page to boilerplate.
    const style = "\\css\\app.css";
    const title = "Fitness Hub";
    res.render("index", { style, title });
})

app.get("/nutrition", (req, res) => {
    res.render("nutrition");
})

app.use("/", userRoutes);
app.use("/", diaryRoutes);
app.use("/", recipeRoutes);
app.use("/recipes", commentRoutes);

app.all("*", (req, res, next) => {
    next(new ExpressError("Page not Found", 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong";
    res.status(statusCode).render("error", { err });
})

app.listen(3000, () => {
    console.log("Serving on port 3000");
});
