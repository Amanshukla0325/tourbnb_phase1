import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

export type Payload = Record<string, any>;

const DEFAULT_EXPIRES_IN = '7d';

export const signJwtToken = (
  payload: Payload,
  options?: SignOptions & { secret?: string }
) => {
  const secret = options?.secret || process.env.JWT_SECRET || 'dev-secret';
  const expiresIn = (options && options.expiresIn) || DEFAULT_EXPIRES_IN;
  const signOpts = { ...(options || {}), expiresIn } as SignOptions;
  // Remove secret from options before passing to jwt.sign
  const token = jwt.sign(payload, secret, signOpts);
  const decoded = jwt.decode(token) as JwtPayload | null;
  const expiresAt = decoded?.exp ? decoded.exp * 1000 : null;
  return { token, expiresAt };
};

export const verifyJwtToken = (token: string) => {
  const secret = process.env.JWT_SECRET || 'dev-secret';
  return jwt.verify(token, secret) as JwtPayload;
};
