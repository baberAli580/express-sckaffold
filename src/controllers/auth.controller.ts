import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User , Users } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {      
      const userData: CreateUserDto = req.body;
      const signUpUserData: User = await this.authService.signup(userData);

      res.status(201).json({ data: signUpUserData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const { token, findUser } = await this.authService.login(userData);
      let isAdmin = false
      if(findUser.role && findUser.role === 'admin'){
        isAdmin = true
      }
      findUser.isAdmin = isAdmin
      res.status(200).json({ data: findUser, message: 'login' ,token });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const logOutUserData: User = await this.authService.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };

  public loginHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: Users = req.body;
      const loginHistoryData: Users = await this.authService.loginHistory(userData);

      res.status(200).json({ data: loginHistoryData, message: 'loginHistory' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
