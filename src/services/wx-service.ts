import { post } from '../utils/request';

export function auth(code) {
  return post("wx/auth", { js_code:code });
}

export function login() {
  return post("wx/login");
}

export function signIn() {
  return post("wx/signIn");
}

