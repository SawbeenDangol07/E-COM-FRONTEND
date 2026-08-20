import { createContext } from "react";

export const AuthContext = createContext({
  loggedInUser: null,
  token: null,
  loading: false,
  login: async () => {},
  getLoggedInUser: async () => {},
  register: async () => {},
  activate: async () => {},
  reactivate: async () => {},
  logout: () => {},
});

export default AuthContext;
