const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "static/profiles");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

(exports.updateProfilePicture = upload.single("profilePicture")),
  async (req, res) => {
    try {
      const userId = req.params.id;
      const filePath = req.file.path;

      await User.update(
        { profilePicture: filePath },
        { where: { id: userId } }
      );

      res
        .status(200)
        .json({ message: "Изображение профиля успешно обновлено" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Произошла ошибка при обновлении изображения профиля" });
    }
  };
