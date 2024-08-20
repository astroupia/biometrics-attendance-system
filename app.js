const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");
const session = require("express-session");
const passport = require("./config/passport");
const flash = require("connect-flash");
const validator = require("express-validator");
const MongoStore = require("connect-mongo")(session);
const Handlebars = require("handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const createError = require("http-errors");
const mongoose = require("mongoose");

// Routes
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const classRouter = require("./routes/classroom");

// Initialize Express
const app = express();

// Middleware setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(validator());
app.use(express.static(path.join(__dirname, "public")));

// Session setup
app.use(
  session({
    secret: "mysupersecret",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 100 * 60 * 1000 },
  })
);

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Set up Handlebars view engine
const hbs = expressHbs.create({
  defaultLayout: "layout",
  extname: ".hbs",
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: {
    maxItems: function (arg, context, options) {
      let items = [];
      let limit = context.length <= arg ? context.length : arg;
      for (let i = 0; i < limit; i++) {
        items.push(options.fn(context[i]));
      }
      return items.join(" ");
    },
    ifEquals: function (arg1, arg2, options) {
      return arg1 == arg2 ? options.fn(this) : options.inverse(this);
    },
    ifCond: function (v1, operator, v2, options) {
      switch (operator) {
        case "==":
          return v1 === v2 ? options.fn(this) : options.inverse(this);
        case "===":
          return v1 === v2 ? options.fn(this) : options.inverse(this);
        case "!=":
          return v1 !== v2 ? options.fn(this) : options.inverse(this);
        case "!==":
          return v1 !== v2 ? options.fn(this) : options.inverse(this);
        case "<":
          return v1 < v2 ? options.fn(this) : options.inverse(this);
        case "<=":
          return v1 <= v2 ? options.fn(this) : options.inverse(this);
        case ">":
          return v1 > v2 ? options.fn(this) : options.inverse(this);
        case ">=":
          return v1 >= v2 ? options.fn(this) : options.inverse(this);
        case "&&":
          return v1 && v2 ? options.fn(this) : options.inverse(this);
        case "||":
          return v1 || v2 ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
    },
  },
});

app.engine(".hbs", hbs.engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// Connect to MongoDB
const mongoUri =
  process.env.MONGO_URI || "mongodb://mongo:27017/attendance_portal";
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware for local variables
app.use((req, res, next) => {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});


// Routes setup
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/classroom", classRouter);

// Error handling
app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  console.error(err.stack); // Log error stack
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});


// Start the server
const port = 3000;
app.listen(port, "0.0.0.0", (err) => {
  if (err) {
    console.error("Error starting server:", err);
  } else {
    console.log("Listening to port:", port);
  }
});

module.exports = app;
