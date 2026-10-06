import { useEffect, useState } from "react";
import { api } from "../utils/api";

export default function useMovie(slug) {
  const [state, setState] = useState({ movie: null, loading: true, error: null });

  useEffect(() => {
    let ignore = false;
    setState({ movie: null, loading: true, error: null });
    api(`/movies/${slug}`)
      .then((res) => !ignore && setState({ movie: res.data, loading: false, error: null }))
      .catch((error) => !ignore && setState({ movie: null, loading: false, error }));
    return () => {
      ignore = true;
    };
  }, [slug]);

  return state;
}
