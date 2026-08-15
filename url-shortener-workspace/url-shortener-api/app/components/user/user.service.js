const bcrypt = require("bcryptjs");
const { User } = require("@url/url-shortener-data-model");
const {
  NotFoundError,
  UnauthorizedError,
  UnprocessableEntityError
} = require("../../lib/error");
const { uploadToCloudinary, deleteFromCloudinary } = require("../../utils/cloudinary");

class UserService {
  async getProfile(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new NotFoundError("User not found.");
    }
    return user.toJSON();
  }

  async updateProfile(userId, data) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new NotFoundError("User not found.");
    }

    if (data.name !== undefined) user.name = data.name;
    if (data.bio !== undefined) user.bio = data.bio;
    if (data.phone !== undefined) user.phone = data.phone;

    await user.save();
    return user.toJSON();
  }

  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError("Incorrect current password.");
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    return { message: "Password changed successfully." };
  }

  async updateAvatar(userId, fileBuffer) {
    if (!fileBuffer) {
      throw new UnprocessableEntityError("An image file is required.");
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const uploadResult = await uploadToCloudinary(fileBuffer);

    if (user.avatarPublicId) {
      await deleteFromCloudinary(user.avatarPublicId);
    }

    user.avatarUrl = uploadResult.url;
    user.avatarPublicId = uploadResult.publicId;
    await user.save();

    return { avatarUrl: user.avatarUrl };
  }

  async deleteAvatar(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new NotFoundError("User not found.");
    }

    if (!user.avatarPublicId && !user.avatarUrl) {
      throw new NotFoundError("No profile photo currently set.");
    }

    if (user.avatarPublicId) {
      await deleteFromCloudinary(user.avatarPublicId);
    }

    user.avatarUrl = null;
    user.avatarPublicId = null;
    await user.save();
  }
}

module.exports = UserService;