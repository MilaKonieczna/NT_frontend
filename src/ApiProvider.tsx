import { GetUserDto } from './dto/user/getUser.dto';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { LibraryClient } from './library-client';
const ApiContext = createContext<LibraryClient | null>(null);
const UserContext = createContext<GetUserDto | null>(null);

export default function ApiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [apiClient, setApiClient] = useState<LibraryClient | null>(null);
  const [user, setUser] = useState<GetUserDto | null>(null);

  useEffect(() => {
    const client = new LibraryClient();
    setApiClient(client);

    client
      .getMe()
      .then((response) => {
        if (response.success) {
          setUser(response.data);
        } else {
          console.error(`Failed to fetch user: ${response.statusCode}`);
        }
      })
      .catch((error) => {
        console.error(`An error occurred: ${error}`);
      });
  }, []);

  if (!apiClient) {
    return null;
  }

  return (
    <ApiContext.Provider value={apiClient}>
      <UserContext.Provider value={user}>{children}</UserContext.Provider>
    </ApiContext.Provider>
  );
}

export function useApi() {
  return useContext(ApiContext);
}

export function useUser() {
  return useContext(UserContext);
}
