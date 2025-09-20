import { NODE_ENV } from "@/config";
import { GoogleAuthRequest } from "@/dtos/auth.dto";
import AuthService from "@/services/auth.service";
import { Request, Response } from "express";
import { Body, JsonController, Post, Req, Res } from "routing-controllers";

@JsonController('/auth')
export default class AuthController {
  private authService = new AuthService();

  @Post('/google')
  public async googleAuth(@Body() googleAuthReq: GoogleAuthRequest, @Res() res: Response) {
    const googleProfile = await this.authService.verifyGoogleToken(googleAuthReq.token);
    const user = await this.authService.findOrCreateUser(googleProfile);
    const { accessToken, refreshToken } = this.authService.generateTokensForUser(user);
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh'
    });

    return res.json({
      status: true,
      message: "Login Successful",
      access_token: accessToken,
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: user.role
      }
    });
  }

  @Post("/refresh")
  public async refreshToken(@Req() req: Request, @Res() res: Response) {
    const { accessToken, user } = await this.authService.refreshAccessToken(req.cookies.refreshToken);
    return res.json({
      status: true,
      message: "Refresh new access token successful",
      access_token: accessToken,
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: user.role
      }
    });
  }

  @Post("/logout")
  public async logout(@Res() res: Response) {
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
    return res.json({
      status: true,
      message: "Logged out successful",
    });
  }
}