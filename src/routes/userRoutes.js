const express = require("express");
const sharp = require("sharp");
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const { sendMail, cancellationMail } = require("../emails/account");

const router = new express.Router();

//* Creating user resource
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  // console.log(sendMail(user.email, user.name));
  try {
    await user.save();
    await sendMail(user.email, user.name)
      .then((result) => console.log(result))
      .catch((e) => console.log(e));
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

//* Logging In user

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.pass);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send();
  }
});

//* Logout user
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send("Succesfully logout!");
  } catch (error) {
    res.status(500).send();
  }
});

//* Logout all
router.post("/users/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send("Logout from all session!");
  } catch (error) {
    res.status(500).send();
  }
});

//* Getting users
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

//* Getting user
router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send("user not found!");
    }
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

//* Deleting user
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    cancellationMail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});

//* Uploading profile picture
const upload = multer({
  limits: {
    fileSize: 2000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)/)) {
      cb(new Error("Please upload an image!"));
    }

    cb(undefined, true);
  },
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send("File added!.");
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//* Getting images

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-type", "image/jpg");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send("Data not found");
  }
});

//* Deleting profile picture

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send("Image deleted succesfully");
});

//* Updating user
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "pass", "age"];
  const isAllowed = updates.every((update) => allowedUpdates.includes(update));
  if (!isAllowed) {
    return res.status(400).send("Invalid updates!");
  }
  try {
    const user = req.user;
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send();
  }
});

module.exports = router;
