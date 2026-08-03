import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

type LocationValue = { pathname: string; search: string; hash: string };
type RouterValue = { location: LocationValue; navigate: (to: string) => void };

const RouterContext = createContext<RouterValue | null>(null);

function parseLocation(value: string): LocationValue {
  const url = new URL(value, "https://groupsum.xyz");
  return { pathname: url.pathname, search: url.search, hash: url.hash };
}

export function BrowserRouter({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<LocationValue>(() => parseLocation(window.location.href));
  useEffect(() => {
    const update = () => setLocation(parseLocation(window.location.href));
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);
  const value = useMemo<RouterValue>(
    () => ({
      location,
      navigate(to) {
        window.history.pushState({}, "", to);
        setLocation(parseLocation(window.location.href));
      },
    }),
    [location],
  );
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function StaticRouter({ location, children }: { location: string; children: ReactNode }) {
  const value = useMemo<RouterValue>(
    () => ({ location: parseLocation(location), navigate() {} }),
    [location],
  );
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useLocation(): LocationValue {
  const router = useContext(RouterContext);
  if (!router) throw new Error("useLocation must be used within a Groupsum router");
  return router.location;
}

export function useNavigate(): (to: string) => void {
  const router = useContext(RouterContext);
  if (!router) throw new Error("useNavigate must be used within a Groupsum router");
  return router.navigate;
}

export function useSearchParams(): [
  URLSearchParams,
  (next: URLSearchParams | Record<string, string>, options?: { replace?: boolean }) => void,
] {
  const router = useContext(RouterContext);
  if (!router) throw new Error("useSearchParams must be used within a Groupsum router");
  const params = useMemo(() => new URLSearchParams(router.location.search), [router.location.search]);
  const setParams = (next: URLSearchParams | Record<string, string>, options?: { replace?: boolean }) => {
    const search = new URLSearchParams(next).toString();
    const target = `${router.location.pathname}${search ? `?${search}` : ""}${router.location.hash}`;
    if (typeof window !== "undefined" && options?.replace) {
      window.history.replaceState({}, "", target);
      window.dispatchEvent(new PopStateEvent("popstate"));
      return;
    }
    router.navigate(target);
  };
  return [params, setParams];
}
