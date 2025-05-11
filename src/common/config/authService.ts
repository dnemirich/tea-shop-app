type loginResponse = {
  access_token: string;
  expires_in: string;
  scope: string;
  refresh_token: string;
  token_type: string;
};

export async function login(email: string, password: string): Promise<loginResponse> {
  const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;
  const clientSecret = import.meta.env.VITE_CTP_CLIENT_SECRET;
  const clientId = import.meta.env.VITE_CTP_CLIENT_ID;
  const authUrl = import.meta.env.VITE_CTP_AUTH_URL;
  const scope = import.meta.env.VITE_CTP_SCOPES;

  const authHeader = btoa(`${clientId}:${clientSecret}`);

  const response = await fetch(`${authUrl}/oauth/${projectKey}/customers/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authHeader}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'password',
      username: email,
      password: password,
      scope: scope,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw {
      status: response.status,
      message: error.message || 'authentication failed',
    };
  }

  return response.json();
}
