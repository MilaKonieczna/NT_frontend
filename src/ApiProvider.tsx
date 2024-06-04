import { createContext, useContext, useEffect, useState } from 'react';
import { LibraryClient } from './library-client';

const ApiContext = createContext<LibraryClient | null>(null);

export default function ApiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [apiClient, setApiClient] = useState<LibraryClient | null>(null);

  useEffect(() => {
    const client = new LibraryClient();
    setApiClient(client);
  }, []);

  if (!apiClient) {
    return null;
  }

  return (
    <ApiContext.Provider value={apiClient}>{children}</ApiContext.Provider>
  );
}

export function useApi() {
  return useContext(ApiContext);
}
