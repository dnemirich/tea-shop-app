import fetch from 'node-fetch';
import {
  ClientBuilder,

  // Import middlewares
  type AuthMiddlewareOptions, // Required for auth
  type HttpMiddlewareOptions, // Required for sending HTTP requests
} from '@commercetools/ts-client';

const projectKey : string = import.meta.env.VITE_CTP_PROJECT_KEY;
const scopes = [import.meta.env.VITE_CTP_SCOPES]

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: import.meta.env.VITE_CTP_AUTH_URL,
  projectKey: import.meta.env.VITE_CTP_PROJECT_KEY,
  credentials: {
    clientId: import.meta.env.VITE_CTP_CLIENT_ID,
    clientSecret: import.meta.env.VITE_CTP_CLIENT_SECRET,
  },
  scopes,
  httpClient: fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: import.meta.env.VITE_CTP_API_URL,
  httpClient: fetch,
};

// Export the ClientBuilder
export const ctpClient = new ClientBuilder()
  .withProjectKey(projectKey) // .withProjectKey() is not required if the projectKey is included in authMiddlewareOptions
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware() // Include middleware for logging
  .build();
