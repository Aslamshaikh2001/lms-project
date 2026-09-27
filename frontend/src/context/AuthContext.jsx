import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  setAccessToken,
  clearAccessToken,
} from "../api/axios.js";

import {
  loginUser,
  refreshToken,
  logoutUser,
  logoutAllDevices,
  getMe,
} from "../services/authService.js";


// ======================================================
// AUTH CONTEXT
// ======================================================

const AuthContext =
  createContext(null);


// ======================================================
// AUTH PROVIDER
// ======================================================

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);


  // ====================================================
  // RESTORE SESSION
  // ====================================================

  async function restoreSession() {
    try {

      /*
       * Try to use the HttpOnly refresh cookie.
       *
       * If it exists, backend returns
       * a new access token.
       */

      const result =
        await refreshToken();


      const accessToken =
        result?.data
          ?.accessToken;


      const refreshedUser =
        result?.data
          ?.user;


      if (!accessToken) {
        throw new Error(
          "Access token not received."
        );
      }


      setAccessToken(
        accessToken
      );


      if (refreshedUser) {

        setUser(
          refreshedUser
        );

        setIsAuthenticated(
          true
        );

      } else {

        await fetchCurrentUser();

      }

    } catch (error) {

      clearAccessToken();

      setUser(null);

      setIsAuthenticated(
        false
      );

    } finally {

      setLoading(false);

    }
  }


  // ====================================================
  // GET CURRENT USER
  // ====================================================

  async function fetchCurrentUser() {

    const result =
      await getMe();


    const currentUser =
      result?.data;


    if (!currentUser) {
      throw new Error(
        "User information not received."
      );
    }


    setUser(
      currentUser
    );

    setIsAuthenticated(
      true
    );


    return currentUser;
  }


  // ====================================================
  // LOGIN
  // ====================================================

  async function login(
    email,
    password
  ) {

    const result =
      await loginUser({
        email,
        password,
      });


    const loginData =
      result?.data;


    if (!loginData) {
      throw new Error(
        "Invalid login response."
      );
    }


    const accessToken =
      loginData.accessToken;


    const loggedInUser =
      loginData.user;


    if (!accessToken) {
      throw new Error(
        "Access token was not received."
      );
    }


    setAccessToken(
      accessToken
    );


    setUser(
      loggedInUser
    );


    setIsAuthenticated(
      true
    );


    return loggedInUser;
  }


  // ====================================================
  // LOGOUT
  // ====================================================

  async function logout() {

    try {

      await logoutUser();

    } finally {

      clearAccessToken();

      setUser(null);

      setIsAuthenticated(
        false
      );

    }
  }


  // ====================================================
  // LOGOUT ALL DEVICES
  // ====================================================

  async function logoutAll() {

    try {

      await logoutAllDevices();

    } finally {

      clearAccessToken();

      setUser(null);

      setIsAuthenticated(
        false
      );

    }
  }


  // ====================================================
  // INITIAL SESSION CHECK
  // ====================================================

  useEffect(() => {

    restoreSession();

  }, []);


  // ====================================================
  // CONTEXT VALUE
  // ====================================================

  const value = {

    user,

    loading,

    isAuthenticated,

    login,

    logout,

    logoutAll,

    fetchCurrentUser,

    restoreSession,

  };


  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}


// ======================================================
// USE AUTH
// ======================================================

export function useAuth() {

  const context =
    useContext(
      AuthContext
    );


  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }


  return context;
}