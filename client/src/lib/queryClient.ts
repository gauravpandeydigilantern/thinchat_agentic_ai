import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok && res.status !== 404) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export interface ApiRequestOptions {
  method: string;
  body?: string;
  headers?: Record<string, string>;
}

export async function apiRequest(
  url: string,
  options?: ApiRequestOptions,
): Promise<any> {
  const token = localStorage.getItem('authToken');
  const headers = {
    ...(options?.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...options?.headers
  };

  const res = await fetch(url, {
    method: options?.method || 'GET',
    headers,
    body: options?.body,
    credentials: "include",
  });
 
  await throwIfResNotOk(res);

  // Read the response body once and handle parsing
  const contentType = res.headers.get("Content-Type") || "";
  const responseBody = await res.text(); // Read as text first

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(responseBody); // Parse as JSON if applicable
    } catch (e) {
      throw new Error("Failed to parse JSON response");
    }
  }

  return responseBody; // Return as text if not JSON
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);

    // Read the response body once and handle parsing
    const contentType = res.headers.get("Content-Type") || "";
    const responseBody = await res.text(); // Read as text first

    if (contentType.includes("application/json")) {
      try {
        return JSON.parse(responseBody); // Parse as JSON if applicable
      } catch (e) {
        throw new Error("Failed to parse JSON response");
      }
    }

    return responseBody; // Return as text if not JSON
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
