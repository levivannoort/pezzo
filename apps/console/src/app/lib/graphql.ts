import { QueryClient } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import { BASE_API_URL } from "../../env";
import {
  attemptRefreshingSession,
  signOut,
} from "supertokens-auth-react/recipe/session";

export const gqlClient = new GraphQLClient(`${BASE_API_URL}/graphql`, {
  credentials: "include",
  fetch: async (url, options) => {
    const res = await fetch(url, options);
    const json = await res.clone().json();

    if (json.errors && json.errors.length > 0) {
      // Check if auth error
      if (json.errors[0].extensions?.code === "UNAUTHORIZED") {
        // Attempt to refresh the session
        const isSuccessful = await attemptRefreshingSession();

        if (!isSuccessful) {
          signOut();
          window.location.href = "/login";
          return;
        }

        // Retry request
        return fetch(url, options);
      }
    }

    return res;
  },
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 1000,
    },
  },
});
