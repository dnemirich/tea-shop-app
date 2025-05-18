import {
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from '@commercetools/ts-client';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

const projectKey: string = import.meta.env.VITE_CTP_PROJECT_KEY;
const scopes = import.meta.env.VITE_CTP_SCOPES?.split(' ') ?? [];

const anonymousId = localStorage.getItem('anonymousId') || crypto.randomUUID();
localStorage.setItem('anonymousId', anonymousId);

const anonymousAuthMiddlewareOptions: AuthMiddlewareOptions = {
  host: import.meta.env.VITE_CTP_AUTH_URL,
  projectKey,
  credentials: {
    clientId: import.meta.env.VITE_CTP_CLIENT_ID,
    clientSecret: import.meta.env.VITE_CTP_CLIENT_SECRET,
    anonymousId: anonymousId,
  },
  scopes: scopes,
  httpClient: fetch,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: import.meta.env.VITE_CTP_API_URL,
  httpClient: fetch,
};

const anonymousClient = new ClientBuilder()
  .withAnonymousSessionFlow(anonymousAuthMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

export const anonymousApiRoot = createApiBuilderFromCtpClient(anonymousClient).withProjectKey({
  projectKey,
});
