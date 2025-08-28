const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
    registerUser,
    loginUser,
    getUserInfo,
} = require("../controllers/authController");
const {upload} = require("../middleware/uploadMiddleware");
const User = require("../models/User");


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo);

// router.post("/upload-image", upload.single("image"), (req, res) => {
//     if(!req.file){
//         return res.status(400).json({ message: "No file uploaded"});
//     }

//     const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
//     res.status(200).json({ imageUrl });
// });

router.post("/upload-image", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const { buffer, mimetype } = req.file;
    const dataUrl = `data:${mimetype};base64,${buffer.toString("base64")}`;

    await User.findByIdAndUpdate(req.user.id, { profileImageUrl: dataUrl }, { new: true });
    return res.status(200).json({ imageUrl: dataUrl });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;