// -----------------------------------------------------------------------------
// Variant selection state for the Personas and Consumer Journey pages.
//
// WHY A HOOK AND NOT useState
// These variants exist to be compared in a live review. Two things follow:
//
//   1. A reload must not throw away the choice, so it persists to localStorage.
//   2. A specific view must be linkable, so a query param wins over storage.
//      There is no router in this app, and adding one to support two query
//      params would be the wrong trade. URLSearchParams is enough.
//
// THIS IS REVIEW SCAFFOLDING. Once a direction is chosen, delete the losing
// variant files, drop the registry down to one entry, and this hook and
// VariantSwitcher go with them.
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';

export interface VariantOption<T extends string> {
  id: T;
  /** Button label. Keep it to one or two words. */
  label: string;
  /** One line on what this view argues. Shown as a title attribute. */
  hint?: string;
}

const readInitial = <T extends string>(
  paramKey: string,
  storageKey: string,
  ids: readonly T[],
  fallback: T,
): T => {
  if (typeof window === 'undefined') return fallback;

  const isValid = (v: string | null): v is T => !!v && (ids as readonly string[]).includes(v);

  // A query param wins, so a link can pin a specific view for someone else.
  try {
    const fromUrl = new URLSearchParams(window.location.search).get(paramKey);
    if (isValid(fromUrl)) return fromUrl;
  } catch {
    // Malformed search string. Fall through to storage.
  }

  try {
    const fromStorage = window.localStorage.getItem(storageKey);
    if (isValid(fromStorage)) return fromStorage;
  } catch {
    // Storage can throw in private browsing. Not worth failing a page load over.
  }

  return fallback;
};

/**
 * @param paramKey    Query param name, e.g. 'pv'.
 * @param storageKey  localStorage key, e.g. 'lyka.personaVariant'.
 * @param ids         Valid ids. Anything else in the URL or storage is ignored.
 * @param fallback    Default view.
 */
export function useVariant<T extends string>(
  paramKey: string,
  storageKey: string,
  ids: readonly T[],
  fallback: T,
): [T, (id: T) => void] {
  const [variant, setVariantState] = useState<T>(() =>
    readInitial(paramKey, storageKey, ids, fallback),
  );

  const setVariant = useCallback(
    (id: T) => {
      setVariantState(id);
      if (typeof window === 'undefined') return;

      try {
        window.localStorage.setItem(storageKey, id);
      } catch {
        // Non fatal.
      }

      // Keep the URL shareable without a navigation. replaceState leaves the
      // back button alone, which matters because this is not a real route.
      try {
        const url = new URL(window.location.href);
        url.searchParams.set(paramKey, id);
        window.history.replaceState(null, '', url.toString());
      } catch {
        // Non fatal.
      }
    },
    [paramKey, storageKey],
  );

  return [variant, setVariant];
}
