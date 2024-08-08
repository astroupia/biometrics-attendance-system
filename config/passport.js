const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const MailSender = require("../mail");

console.log("Passport.js file is loaded.");

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Email validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) && email.endsWith("@gmail.com");
}

// Password validation
function validatePassword(password) {
  const errors = [];
  if (password.length < 6) {
    errors.push("Your password must be at least 6 characters.");
  }
  if (password.length > 15) {
    errors.push("Your password must be at most 15 characters.");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Your password must contain at least one uppercase letter.");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Your password must contain at least one lowercase letter.");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Your password must contain at least one digit.");
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("Your password must contain at least one special character.");
  }
  return errors;
}

// Local registration strategy
passport.use(
  "local-register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      const {
        name,
        class: classs,
        rollnumber,
        teacher,
        student,
        year,
      } = req.body;
      let messages = [];

      req.checkBody("email", "Invalid email").notEmpty().isEmail();
      req.checkBody("password", "Invalid password").notEmpty();
      const errors = req.validationErrors();

      if (errors) {
        errors.forEach((error) => messages.push(error.msg));
        return done(null, false, req.flash("error", messages));
      }

      if (!validateEmail(email)) {
        messages.push("Email Domain: @gmail.com required");
        return done(null, false, req.flash("error", messages));
      }

      const passwordErrors = validatePassword(password);
      if (passwordErrors.length > 0) {
        return done(null, false, req.flash("error", passwordErrors));
      }

      if (!teacher && !student) {
        messages.push("Please check the tickbox");
        return done(null, false, req.flash("error", messages));
      }

      if (year === "Year") {
        messages.push("Please select a year");
        return done(null, false, req.flash("error", messages));
      }

      if (classs === "Class") {
        messages.push("Please select a class");
        return done(null, false, req.flash("error", messages));
      }

      const checkUserExists = (criteria, errorMsg) =>
        User.findOne(criteria).then((user) => {
          if (user) {
            return Promise.reject(errorMsg);
          }
        });

      // Check if roll number or email already exists
      const checkPromises = [
        rollnumber &&
          checkUserExists({ rollnumber }, "Roll number already in use."),
        checkUserExists({ email }, "Email already in use."),
      ].filter(Boolean);

      Promise.all(checkPromises)
        .then(() => {
          const newUser = new User({
            name,
            email,
            password: new User().encryptPassword(password),
            class: classs,
            rollnumber,
            who: teacher || student || "",
            year: student ? year : undefined,
          });

          return newUser.save();
        })
        .then((newUser) => done(null, newUser))
        .catch((err) => done(err, false, req.flash("error", [err.message])));
    }
  )
);

// Local login strategy
passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      req.checkBody("email", "Invalid Email").notEmpty().isEmail();
      req.checkBody("password", "Invalid password").notEmpty();
      const errors = req.validationErrors();

      if (errors) {
        const messages = errors.map((error) => error.msg);
        return done(null, false, req.flash("error", messages));
      }

      User.findOne({ email })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: "User not found." });
          }
          if (!user.validPassword(password)) {
            return done(null, false, { message: "Invalid Password" });
          }
          return done(null, user);
        })
        .catch((err) => done(err));
    }
  )
);

module.exports = passport;
