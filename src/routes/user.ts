import express from "express";
import passport from "passport";

const router = express.Router();

router.get(
  "/callback/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/login",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    successRedirect: process.env.CLIENT_URL!,
  })
);

router.get("/session", (req, res) => {
  if (req.user) {
    res.status(200).json({ session: req.user });
  }

  res.redirect(process.env.LOGIN_URL!);
});

export default router;
