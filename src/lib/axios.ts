import axios from "axios";
import { decryptResponse, encryptPayload } from "./crypto";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// REQUEST
api.interceptors.request.use(
  async (config) => {
    console.log("payload-req==>", config.data);
    // get token from Cookie
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_token="))
      ?.split("=")[1];

    // ===== TOKEN ATTACH =====
    if (token) {
      if (config.method === "get") {
        // GET — query params mein
        config.params = {
          ...config.params,
          token,
        };
      } else if (config.data instanceof FormData) {
        // FormData — directly append
        config.data.append("token", token);
      } else if (config.data && typeof config.data === "object") {
        // JSON — merged with object
        config.data = {
          ...config.data,
          token,
        };
      } else {
        // No data — only token
        config.data = { token };
      }
    }

    // Log check
    // if (config.data instanceof FormData) {
    //   const rawPayload: Record<string, any> = {};

    //   config.data.forEach((value, key) => {
    //     rawPayload[key] = value;
    //   });

    //   console.log("RAW PAYLOAD =>", rawPayload);
    // } else {
    //   console.log("RAW PAYLOAD =>", config.data);
    // }

    // ===== ENCRYPTION =====
    if (config.method !== "get") {
      // FormData case — seprate file, other encrypt
      if (config.data instanceof FormData) {
        const originalFormData = config.data;
        const newFormData = new FormData();
        const rawPayload: Record<string, FormDataEntryValue> = {};

        originalFormData.forEach((value, key: string) => {
          if (typeof value === "object") {
            newFormData.append(key, value); // File ya Blob
          } else {
            rawPayload[key] = value; // string
          }
        });

        const encrypted = await encryptPayload(rawPayload);
        newFormData.append("data", encrypted);
        config.data = newFormData;
      } else {
        // JSON case
        const rawPayload = config.data || {};
        const encrypted = await encryptPayload(rawPayload);
        config.data = { data: encrypted };
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// core function
// api.interceptors.request.use(async (config) => {
//   if (config.data) {
//     console.log("payload-req", config.data);
//     // config.data = await encryptPayload(config.data);
//     const encrypted = await encryptPayload(config.data);
//     config.data = { data: encrypted };
//   }
//   return config;
// });

//  RESPONSE with encrepted
// api.interceptors.response.use(async (response) => {
//   if (response.data) {
//     // console.log("encrepted-data", response.data);
//     const decrypted = await decryptResponse(response.data);
//     // console.log("decrypted-res", decrypted);
//     response.data = JSON.parse(decrypted);
//   }
//   return response;
// });

// token expiry

// api.interceptors.response.use(
//   async (response) => {
//     try {
//       if (response.data) {
//         const decrypted = await decryptResponse(response.data);
//         response.data = JSON.parse(decrypted);
//       }

//       return response;
//     } catch (error) {
//       console.error("Response decryption failed:", error);
//       return Promise.reject(error);
//     }
//   },

//   async (error) => {
//     // Handle Unauthorized (401)
//     if (error.response?.status === 401) {
//       console.warn("Session expired. Logging out...");
//       console.log("Session expired. Logging out...");

//       // Remove auth cookie
//       document.cookie =
//         "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

//       // queryClient.clear();
//       // Redirect to login page
//       window.location.href = "/sign-in";
//     }

//     return Promise.reject(error);
//   }
// );

api.interceptors.response.use(
  async (response) => {
    try {
      if (response.data) {
        const decrypted = await decryptResponse(response.data);
        response.data = JSON.parse(decrypted);
      }

      if (response.data?.data?.status === 401 || response.data?.status === 401) {
        console.warn("Token expired. Logging out...");
        document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/sign-in";
        return Promise.reject(new Error("Token Expired"));
      }

      return response;
    } catch (error) {
      console.error("Response decryption failed:", error);
      return Promise.reject(error);
    }
  },

  async (error) => {
    if (error.response?.status === 401) {
      console.warn("Session expired. Logging out...");
      document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "/sign-in";
    }
    return Promise.reject(error);
  }
);

export default api;