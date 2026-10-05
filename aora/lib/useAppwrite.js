import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";

export default function useAppwrite(fetchFunction, { refetchOnFocus = false } = {}) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchFunction();
      setData(result);
      return result;
    } catch (fetchError) {
      setError(fetchError);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction]);

  useEffect(() => {
    if (!refetchOnFocus) refetch();
  }, [refetch, refetchOnFocus]);

  useFocusEffect(
    useCallback(() => {
      if (refetchOnFocus) refetch();
    }, [refetch, refetchOnFocus]),
  );

  return { data, isLoading, error, refetch };
}
