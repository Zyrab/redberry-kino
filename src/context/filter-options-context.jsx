import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../utils/api";

const FilterOptionsContext = createContext(null);

export function FilterOptionsProvider({ children }) {
  const [options, setOptions] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api("/filter-options")
      .then((res) => setOptions(res.data))
      .catch(setError);
  }, []);

  return <FilterOptionsContext.Provider value={{ ...options, loading: !options && !error, error }}>{children}</FilterOptionsContext.Provider>;
}

export const useFilterOptions = () => useContext(FilterOptionsContext);
