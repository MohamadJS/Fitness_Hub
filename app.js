if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

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
const catchAsync = require("./utils/catchAsync");
const Recipe = require("./models/recipes");

const userRoutes = require("./routes/user");
const diaryRoutes = require("./routes/foodDiary");
const recipeRoutes = require("./routes/recipe");
const commentRoutes = require("./routes/comment");

const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const MongoStore = require("connect-mongo");

const dbUrl = process.env.DB_URL;

mongoose.connect(process.env.DB_URL || "mongodb://localhost:27017/fitness-hub", {
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

// Mongo Injection
app.use(mongoSanitize());

const scriptSrcUrls = [
    "https://*.dreamstime.com/",
    "https://*.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/domad5jvw/"
];
const styleSrcUrls = [
    "https://cdnjs.cloudflare.com/",
    "https://*.fontawesome.com/",
    "https://fonts.googleapis.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/domad5jvw/"
];
const connectSrcUrls = [
    "https://res.cloudinary.com/domad5jvw/",
    "https://api.nal.usda.gov/fdc/v1/foods/",
];

const fontSrcUrls = [
    "https://fonts.gstatic.com/",
    "https://fonts.gstatic.com/",
    "https://cdnjs.cloudflare.com/",
];

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: [],
                connectSrc: ["'self'", ...connectSrcUrls],
                scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
                styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
                workerSrc: ["'self'", "blob:"],
                objectSrc: [],
                imgSrc: [
                    "'self'",
                    "blob:",
                    "data:",
                    "https://res.cloudinary.com/domad5jvw/",
                    "https://images.unsplash.com/",
                    "https://*.dreamstime.com/",
                    "https://api.nal.usda.gov/fdc/v1/foods/",
                    "https://res.cloudinary.com/domad5jvw/",
                ],
                fontSrc: ["'self'", ...fontSrcUrls],
                mediaSrc: ["https://res.cloudinary.com/dv5vm4sqh/"],
                childSrc: ["blob:"]
            }
        },
        crossOriginEmbedderPolicy: false
    })
);

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret: "thisshouldbeabettersecret",
    //helps prevent unneccessary resaves when data & session has not changed.
    touchAfter: 24 * 60 * 60  //update once every 24 hours (in seconds)
})

store.on("error", function (e) {
    console.log("Session Store Error: ", e);
})

const secret = process.env.SECRET || "thisshouldbeabettersecret";

const sessionConfig = {
    name: "session",
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        sameSite: "strict",
        // secure: true,
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

app.get("/", catchAsync(async (req, res) => {
    const recipes = await Recipe.find({});
    req.user ? res.redirect("/diary") : res.render("index", { recipes });
}))

app.get("/about", (req, res) => {
    req.user ? res.redirect("/") : res.render("about");
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
    message = err.message
    if (!err.message) err.message = "Something went wrong";
    res.status(statusCode).render("error", { message, err });
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});
