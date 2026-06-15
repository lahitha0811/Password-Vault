const express = require("express");
const router = express.Router();
const User = require("../models/schema");
const bcrypt = require("bcrypt");
const authenticate = require("../middlewares/authenticate");


router.post("/register", async (req, res) => {

  const { name, email, password, cpassword } = req.body;

  if (!name || !email || !password || !cpassword) return res.status(400).json({ error: "Invalid Credentials" });

  if (password !== cpassword) return res.status(400).json({ error: "Passwords do not match." });

  try {

    const existingUser = await User.findOne({ email });

    if (existingUser) return res.status(400).json({ error: "Email already exists." });

    const newUser = new User({ name, email, password, cpassword });

    await newUser.save();

    return res.status(201).json({ message: "User created successfully." });

  } catch (err) {

    console.log(err);

    return res.status(500).json({ error: "Internal server error." });

  }

});

// Login

router.post("/login", async (req, res) => {

  const { email, password } = req.body;



  if (!email || !password) return res.status(400).json({ error: "Please fill all fields." });



  try {

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "user doesn't exist please signup first" });



    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ error: "Invalid Credentials." });



    const token = await user.generateAuthToken();

    res.cookie("jwtoken", token, { expires: new Date(Date.now() + 2592000000), httpOnly: true });



    return res.status(200).json({ message: "User login successfully.", name: user.name, email: user.email, passwords: user.passwords });

  } catch (err) {

    console.log(err);

    return res.status(500).json({ error: "Internal server error." });

  }

});


// Authenticate
router.get("/authenticate", authenticate, async (req, res) => {
  try {
    const { name, email, passwords } = req.rootUser;
    res.status(200).json({ name, email, passwords });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error." });
  }
});


// Adding new password
router.post("/addnewpassword", authenticate, async (req, res) => {
  // Use 'userPass' to match the frontend console log we saw earlier
  const { platform, userPass, platEmail } = req.body;
  console.log(req.body);

  if (!platform || !userPass || !platEmail) {
    return res.status(400).json({ error: "Required fields missing." });
  }

  try {
    const rootUser = req.rootUser;
    
    // Pass 'userPass' (the encrypted string) to your schema method
    const savedUser = await rootUser.addNewPassword(userPass, null, platform, platEmail);

    if (savedUser) {
      return res.status(200).json({ 
        message: "Stored securely.", 
        passwords: savedUser.passwords 
      });
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Delete password
router.post("/deletepassword", authenticate, async (req, res) => {
  const { id } = req.body;
  console.log(req.body);
  if (!id) return res.status(400).json({ error: "Could not find data." });

  try {
    const rootUser = req.rootUser;
    const result = await User.updateOne({ email: rootUser.email }, { $pull: { passwords: { _id: id } } });

    if (result.modifiedCount === 0) return res.status(400).json({ error: "Could not delete the password." });

    const updatedUser = await User.findOne({ email: rootUser.email });
    return res.status(200).json({ message: "Successfully deleted your password.", passwords: updatedUser.passwords });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error." });
  }
});


// Update password
router.put("/updatepassword", authenticate, async (req, res) => {
  const { id, platform, encryptedPassword, email } = req.body;
  console.log(req.body);
  if (!id || !platform || !encryptedPassword || !email) {
    return res.status(400).json({ error: "Incomplete data for update." });
  }

  try {
    const rootUser = req.rootUser;
    const result = await User.updateOne(
      { email: rootUser.email, "passwords._id": id },
      {
        $set: {
          "passwords.$.platform": platform,
          "passwords.$.platEmail": email,
          "passwords.$.encryptedPassword": encryptedPassword,
          "passwords.$.iv": null, // IV is no longer stored separately
        },
      }
    );

    if (result.modifiedCount === 0) return res.status(400).json({ error: "Update failed." });

    const updatedUser = await User.findOne({ email: rootUser.email });
    return res.status(200).json({ message: "Updated successfully.", passwords: updatedUser.passwords });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Logout

router.get("/logout", (req, res) => {
  console.log(req.body);
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("Logout");
});




module.exports = router;