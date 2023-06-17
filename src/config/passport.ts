import passport from 'passport';
import dotenv from 'dotenv';
import {Strategy as JWTStrategy, ExtractJwt} from 'passport-jwt'
import {User, UserInstance} from '../models/User';
import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

dotenv.config();

const notAuthorizedJson = {
    status: 401,
    message: 'Não autorizado'
}

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET as string
}

passport.use(new JWTStrategy(options, async (payload, done) => {
    
    const user = await User.findByPk(payload.id)

    if (user) {
        return done(null, user);
    } else {
        return done(notAuthorizedJson, false);
    }
}));

export const generateToken = (data: Object) => {
    return jwt.sign(data, process.env.JWT_SECRET as string);
}

export const privateRoute = (req: Request, res: Response, next: NextFunction) => {
    const authFunction = passport.authenticate('jwt', (err: Error, user: UserInstance) => {
        req.user = user;
        return user ? next() : next(notAuthorizedJson);
    })

    authFunction(req, res, next);
}

export default passport;