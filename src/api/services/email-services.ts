import nodemailer, { Transporter } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

class EmailServices {
  private transporter: Transporter;
  private verificationCodeLength: number = 4;

  constructor() {
    // Convert environment variables to the expected types
    const host = process.env.HOST_SERVICE ?? "localhost"; // default to 'localhost' if not defined
    const port = parseInt(process.env.SMTP_PORT ?? "587", 10); // default to 587 if not defined
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

   generateVerificationCode(): string {
    // Generate a unique four-digit code
    const code = Math.floor(
      10 ** (this.verificationCodeLength - 1) +
        Math.random() * 9 * 10 ** (this.verificationCodeLength - 1)
    );
    return code.toString();
  }

  // async sendVerificationEmail(to: string): Promise<string> {
  //   const code = this.generateVerificationCode();
  //   const email = await this.transporter.sendMail({
  //     from: "shubham.mentem@gmail.com",
  //     to,
  //     subject: "Email Verification",
  //     text: `Please verify your email by entering this code: ${code}.`,
  //   });
  //   return code
  // }

  async sendVerificationEmail(to: string, code?: string,text?:string,subject?:string): Promise<void> {
    // If the code is not provided, generate a new one
    const verificationCode = code || this.generateVerificationCode();
    console.log(verificationCode);
    
    const msg = text || `Please verify your email by entering this code: ${verificationCode}.`
    const sub=subject || 'Email Verification';
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject:subject,
      text: msg,
    });
  }
  

  // Additional methods if needed
}

const EmailService = new EmailServices();
export default EmailService;
