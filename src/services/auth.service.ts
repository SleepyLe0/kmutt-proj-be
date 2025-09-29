import { OAuth2Client } from 'google-auth-library';
import MainService from './main.service';
import { User } from '@/interfaces/user.interface';
import { HttpException } from '@/exceptions/HttpException';
import { generateJWTAccess, generateJWTRefresh, verifyJWTRefresh } from '@/utils/token';
import { GoogleProfile } from '@/dtos/auth.dto';

class AuthService extends MainService {
  private googleClient: OAuth2Client;

  constructor() {
    super();
    this.googleClient = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
  }

  public async verifyGoogleToken(token: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      
      const payload = ticket.getPayload();
      if (!payload) throw new HttpException(400, 'Invalid token payload');

      return {
        google_id: payload.sub,
        email: payload.email!,
        name: payload.name!,
        picture: payload.picture
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async findOrCreateUser(googleProfile: GoogleProfile): Promise<User> {
    try {
      let user = await this.model.user.findOne({ google_id: googleProfile.google_id });
    
      if (!user) {
        // Check if this email should be an admin (you can modify this logic)
        const isAdmin = this.checkIfAdmin(googleProfile.email);
        
        const newUser = await this.model.user.create({
          google_id: googleProfile.google_id,
          email: googleProfile.email,
          name: googleProfile.name,
          picture: googleProfile.picture,
          role: isAdmin ? 'admin' : 'user'
        });

        return newUser;
      }
      
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public generateTokensForUser(user: User): { accessToken: string, refreshToken: string } {
    try {
      const accessToken = generateJWTAccess(user);
      const refreshToken = generateJWTRefresh(user);
      return { accessToken, refreshToken };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string, user: User }> {
    try {
      if (!refreshToken) throw new HttpException(400, 'No refresh token');
      const payload = verifyJWTRefresh(refreshToken) as { id: string, email: string };
      const findUser = await this.model.user.findOne({ _id: payload.id, email: payload.email });
      if (!findUser) throw new HttpException(404, "User not found");
      const accessToken = generateJWTAccess(findUser);
      return { accessToken, user: findUser }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private checkIfAdmin(email: string): boolean {
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    return adminEmails.includes(email);
  }
}

export default AuthService;