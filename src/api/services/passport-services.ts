import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import passport from 'passport';
import User from '../models/user.model';

class PassportServices {
  private jwtSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || "secret";

    const opts: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: this.jwtSecret,
    };

    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
      console.log("jwt",jwt_payload)
      try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    }));
  }

  initialize() {
    return passport.initialize();
  }

  authenticate(strategy: string) {
    return passport.authenticate(strategy, { session: false });
  }
}
const PassportService = new PassportServices();
export default PassportService
