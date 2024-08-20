import { Response } from "express";

class AuthResponseController {
  public userAlreadyExists(res: Response) {
    res.status(400).json({ message: "User already exists" });
  }

  public invalidVerificationCode(res: Response) {
    res.status(400).json({ message: "Invalid verification code" });
  }
  public otpExpired(res: Response) {
    res.status(400).json({ message: "Invalid otp or your otp is expired." });
  }
  
  public roleNotFound(res: Response) {
    res.status(404).json({ message: "User not found" });
  }

  public emailNotFound(res: Response) {
    res.status(404).json({ message: "User with this email does not exists." });
  }


  public invalidRole(res: Response) {
    res.status(400).json({ message: "Invalid role" });
  }

  public profileUpdateSuccess(res: Response) {
    res.status(200).json({ message: "Profile completed successfully" });
  }

  public serverError(res: Response) {
    res.status(500).json({ message: "Server error" });
  }

  
}

const AuthResponse = new AuthResponseController();
export default AuthResponse;
