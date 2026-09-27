import axios from "axios";

// ======================================================
// API BASE URL
// ======================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5016/api";

// ======================================================
// AXIOS INSTANCE
// ======================================================

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ======================================================
// ACCESS TOKEN
// ======================================================

// Keep token in memory
let accessToken =
  localStorage.getItem("accessToken") || null;


// ======================================================
// SET ACCESS TOKEN
// ======================================================

export function setAccessToken(token) {

  accessToken = token || null;

  if (token) {
    localStorage.setItem(
      "accessToken",
      token
    );
  } else {
    localStorage.removeItem(
      "accessToken"
    );
  }

}


// ======================================================
// GET ACCESS TOKEN
// ======================================================

export function getAccessToken() {

  if (accessToken) {
    return accessToken;
  }

  const storedToken =
    localStorage.getItem(
      "accessToken"
    );

  if (storedToken) {
    accessToken = storedToken;
  }

  return accessToken;

}


// ======================================================
// CLEAR ACCESS TOKEN
// ======================================================

export function clearAccessToken() {

  accessToken = null;

  localStorage.removeItem(
    "accessToken"
  );

}


// ======================================================
// REQUEST INTERCEPTOR
// ======================================================

api.interceptors.request.use(

  (config) => {

    const token =
      getAccessToken();

    config.headers =
      config.headers || {};

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

      console.log(
        "AUTH TOKEN ATTACHED"
      );

    } else {

      console.warn(
        "NO ACCESS TOKEN AVAILABLE"
      );

    }

    console.log(
      "API REQUEST:",
      config.method?.toUpperCase(),
      `${config.baseURL}${config.url}`
    );

    console.log(
      "TOKEN EXISTS:",
      Boolean(token)
    );

    return config;

  },

  (error) => {
    return Promise.reject(error);
  }

);


// ======================================================
// REFRESH STATE
// ======================================================

let isRefreshing = false;

let refreshSubscribers = [];


// ======================================================
// SUBSCRIBE
// ======================================================

function subscribeTokenRefresh(
  callback
) {

  refreshSubscribers.push(
    callback
  );

}


// ======================================================
// NOTIFY
// ======================================================

function notifyTokenRefreshed(
  newToken
) {

  refreshSubscribers.forEach(
    (callback) => {
      callback(newToken);
    }
  );

  refreshSubscribers = [];

}


// ======================================================
// RESPONSE INTERCEPTOR
// ======================================================

api.interceptors.response.use(

  (response) => {
    return response;
  },

  async (error) => {

    const originalRequest =
      error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    if (
      error.response.status !== 401
    ) {
      return Promise.reject(error);
    }

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Never refresh refresh-token request
    if (
      originalRequest.url?.includes(
        "/auth/refresh-token"
      )
    ) {

      clearAccessToken();

      return Promise.reject(error);

    }

    // Prevent infinite loop
    if (
      originalRequest._retry
    ) {

      clearAccessToken();

      return Promise.reject(error);

    }

    originalRequest._retry = true;


    // ==================================================
    // REFRESH ALREADY RUNNING
    // ==================================================

    if (isRefreshing) {

      return new Promise(
        (
          resolve,
          reject
        ) => {

          subscribeTokenRefresh(
            (newToken) => {

              if (!newToken) {

                reject(error);

                return;

              }

              originalRequest.headers =
                originalRequest.headers ||
                {};

              originalRequest.headers.Authorization =
                `Bearer ${newToken}`;

              resolve(
                api(originalRequest)
              );

            }
          );

        }
      );

    }


    // ==================================================
    // START REFRESH
    // ==================================================

    isRefreshing = true;

    try {

      console.log(
        "ACCESS TOKEN EXPIRED."
      );

      console.log(
        "TRYING REFRESH TOKEN..."
      );


      /*
       * Refresh token should be stored
       * in HttpOnly cookie by backend.
       *
       * Browser sends it automatically
       * because withCredentials=true.
       */

      const response =
        await api.post(
          "/auth/refresh-token"
        );


      console.log(
        "REFRESH RESPONSE:",
        response.data
      );


      const newAccessToken =
        response.data?.data?.accessToken;


      if (!newAccessToken) {

        throw new Error(
          "Refresh API did not return accessToken."
        );

      }


      // Save new token
      setAccessToken(
        newAccessToken
      );


      // Notify waiting requests
      notifyTokenRefreshed(
        newAccessToken
      );


      // Update original request
      originalRequest.headers =
        originalRequest.headers ||
        {};

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;


      // Retry original request
      return api(
        originalRequest
      );

    } catch (
      refreshError
    ) {

      console.error(
        "REFRESH TOKEN FAILED:",
        refreshError.response?.data ||
        refreshError.message
      );

      clearAccessToken();

      notifyTokenRefreshed(
        null
      );

      return Promise.reject(
        refreshError
      );

    } finally {

      isRefreshing = false;

    }

  }

);


export default api;