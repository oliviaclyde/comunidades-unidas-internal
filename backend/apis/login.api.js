const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { app, pool } = require("../server");
const passport = require("passport");
const cookieSession = require("cookie-session");
const mysql = require("mysql");

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use({
  name: "fake",
  authenticate(req) {
    console.log("success");
    this.success({
      id: 1,
      googleProfile: {},
      fullName: "CU Developers",
      firstName: "CU",
      lastName: "Developers",
      email: "developers@cuutah.org",
      token: "456787656789"
    });
  }
});

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_CALLBACK_URL
//     },
//     (token, refreshToken, profile, done) => {
//       pool.getConnection((err, connection) => {
//         if (err) {
//           done(err);
//         } else {
//           connection.query(
//             mysql.format(
//               `
//             INSERT IGNORE INTO users (googleId, firstName, lastName, email, accessLevel)
//             VALUES(?, ?, ?, ?, ?)
//           `,
//               [
//                 profile.id,
//                 profile.name.givenName,
//                 profile.name.familyName,
//                 profile.emails[0].value,
//                 "Staff" // Start them off as staff, upgrade their access level later
//               ]
//             ),
//             (err, result) => {
//               if (err) {
//                 connection.release();
//                 done(err);
//               } else {
//                 const getUserQuery = mysql.format(
//                   `
//                 SELECT * FROM users WHERE googleId = ?
//               `,
//                   [profile.id]
//                 );

//                 connection.query(getUserQuery, (err, rows) => {
//                   connection.release();

//                   if (err) {
//                     done(err);
//                   } else {
//                     done(null, {
//                       id: rows[0].id,
//                       googleProfile: profile,
//                       fullName: rows[0].firstName + " " + rows[0].lastName,
//                       firstName: rows[0].firstName,
//                       lastName: rows[0].lastName,
//                       email: rows[0].email,
//                       token: token
//                     });
//                   }
//                 });
//               }
//             }
//           );
//         }
//       });
//     }
//   )
// );

app.use(
  cookieSession({
    name: "session",
    keys: require("keygrip")([process.env.KEYGRIP_SECRET], "sha256"),
    maxAge: 144 * 60 * 60 * 1000, // 144 hours
    secure: process.env.RUNNING_LOCALLY ? false : true
  })
);

app.use(passport.initialize());

app.get(
  "/login",
  passport.authenticate("fake"),
  (req, res) => {
    res.redirect("/");
  }
  // passport.initialize("fake", {}),
  // (req, res) => {
  //   console.log('req.session', req.session)
  //   res.redirect('/')
  // }
  // passport.authenticate("google", {
  //   scope: ["profile", "email"],
  //   includeGrantedScopes: true,
  //   hd: "cuutah.org"
  // })
);

app.get(
  "/login/select-account",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    includeGrantedScopes: true,
    hd: "cuutah.org",
    prompt: "select_account"
  })
);

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/"
  }),
  (req, res) => {
    req.session.token = req.user.token;
    res.redirect("/");
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  req.session = null;
  res.cookie("session", "", { maxAge: 1 });
  res.redirect("/login/select-account");
});
