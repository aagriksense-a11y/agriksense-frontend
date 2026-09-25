import { useEffect, useState } from "react";
import { requireSession, type SessionUser } from "./api";

export { userDisplay, userInitial } from "./api";

/**
 * Session as the browser sees it. Renders `null` on the server and on the first
 * client paint so authenticated shells never hydrate mismatched role markup.
 */
export function useSession(): { user: SessionUser | null; ready: boolean } {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // One pass after mount is deliberate: requireSession() redirects when the
    // token is missing, so it cannot be a render-phase or store snapshot read.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- see above
    setUser(requireSession());
    setReady(true);
  }, []);

  return { user, ready };
}
