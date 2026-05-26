'use strict';
// Sessão sem servidor com estado: JWT assinado guardado num cookie httpOnly.
// Substitui o express-session (que não roda em serverless/Vercel).
const { SignJWT, jwtVerify } = require('jose');

const COOKIE = 'cha_session';
const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-troque-isto');
const MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 dias

async function issueSession(res, user) {
  const token = await new SignJWT({ uid: user.id, name: user.name, email: user.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret);
  res.cookie(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: MAX_AGE,
    path: '/',
  });
}

function readCookie(req, name) {
  const header = req.headers.cookie || '';
  const m = header.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}

async function getSession(req) {
  const token = readCookie(req, COOKIE);
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return { id: payload.uid, name: payload.name, email: payload.email };
  } catch {
    return null;
  }
}

function clearSession(res) {
  res.clearCookie(COOKIE, { path: '/' });
}

module.exports = { issueSession, getSession, clearSession, COOKIE };
