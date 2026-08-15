const AuthService = require("./auth.service");

class AuthController {
  constructor(){
    this.authService = new AuthService();
  }
  async register(req, res, next) {
    try {
      const result = await this.authService.register(req.body);
      return res.status(201).json({
        message: "User registered successfully",
        ...result
      });
    } catch (error) {
      next(error)
    }
  }

  async login(req, res, next) {
    try {
      const result = await this.authService.login(req.body);
      return res.status(200).json({ success: true, data: result});
    } catch (error) {
      next(error)
    }
  }

  async logout(req, res, next) {
    try {
      // Stateless JWT logout - client is instructed to discard token
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req,res,next){
    try {
      const result = await this.authService.forgotPassword(req.body);
      return res.status(200).json({
        success: true,
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  async resetPassword(req,res,next){
    try {
      const result = await this.authService.resetPassword(req.body);
      return res.status(200).json({
        success: true,
        data: result
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = AuthController;
