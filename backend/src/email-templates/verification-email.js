export const getVerificationEmailTemplate = (fullName, otp) => ({
  subject: "Verify your email - Your App",
  html: `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
    <!-- Header with chess pattern -->
    <div style="height: 8px; background: repeating-linear-gradient(45deg, #000, #000 10px, #fff 10px, #fff 20px);"></div>
    
    <!-- Main content -->
    <div style="padding: 40px;">
      <!-- Logo/App Name -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 24px; color: #1a1a1a; font-weight: 600;">NOE</h1>
        <p style="margin: 8px 0 0; color: #666; font-size: 14px;">Your move starts here</p>
      </div>
      
      <!-- Greeting -->
      <p style="font-size: 16px; color: #333; line-height: 1.6; margin: 0 0 25px 0;">
        Hi <span style="font-weight: 600;">${fullName}</span>,
      </p>
      
      <!-- OTP Code -->
      <p style="font-size: 15px; color: #555; margin: 0 0 15px 0;">Your verification code is:</p>
      <div style="
        background: #f8f9fa;
        border: 1px solid #e1e4e8;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
        font-size: 32px;
        font-weight: 600;
        letter-spacing: 6px;
        color: #1a1a1a;
        margin: 20px 0 30px;
        font-family: 'Courier New', monospace;
      ">
        ${otp}
      </div>
      
      <!-- Instructions -->
      <div style="background: #f8f9fa; border-radius: 8px; padding: 16px; margin: 30px 0; font-size: 14px; color: #555; line-height: 1.5;">
        <p style="margin: 0 0 8px 0; display: flex; align-items: center;">
          <span style="display: inline-block; width: 20px; text-align: center; margin-right: 8px;">⏱️</span>
          <span>Code expires in 15 minutes</span>
        </p>
        <p style="margin: 8px 0 0 0; display: flex; align-items: center;">
          <span style="display: inline-block; width: 20px; text-align: center; margin-right: 8px;">🔒</span>
          <span>Don't share this code with anyone</span>
        </p>
      </div>
      
      <!-- Footer -->
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eaeaea; text-align: center;">
        <p style="margin: 0 0 10px 0; font-size: 12px; color: #999;">
          If you didn't request this, you can safely ignore this email.
        </p>
        <p style="margin: 0; font-size: 12px; color: #999;">
          &copy; ${new Date().getFullYear()} NOE. All rights reserved.
        </p>
      </div>
    </div>
    
    <!-- Bottom border -->
    <div style="height: 8px; background: repeating-linear-gradient(45deg, #000, #000 10px, #fff 10px, #fff 20px);"></div>
  </div>`
});
