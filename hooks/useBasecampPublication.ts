"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BASECAMP_PUBLICATION_EVENT,
  BASECAMP_PUBLICATION_STORAGE_KEY,
  type BasecampPublicationId,
  basecampPublicationOptions,
} from "@/lib/basecamp/publication";

function isPublicationId(value: string | null | undefined): value is BasecampPublicationId {
  return value === "madeinvt" || value === "southernvt";
}

export function useBasecampPublication() {
  const [activePublication, setActivePublicationState] = useState<BasecampPublicationId>(() => {
    if (typeof window === "undefined") {
      return "madeinvt";
    }
    const storedValue = window.localStorage.getItem(BASECAMP_PUBLICATION_STORAGE_KEY);
    return isPublicationId(storedValue) ? storedValue : "madeinvt";
  });
  const [hasSelectedPublication, setHasSelectedPublication] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }
    const storedValue = window.localStorage.getItem(BASECAMP_PUBLICATION_STORAGE_KEY);
    return isPublicationId(storedValue);
  });

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key !== BASECAMP_PUBLICATION_STORAGE_KEY) {
        return;
      }
      if (isPublicationId(event.newValue)) {
        setActivePublicationState(event.newValue);
        setHasSelectedPublication(true);
      } else {
        setActivePublicationState("madeinvt");
        setHasSelectedPublication(false);
      }
    }

    function handlePublicationChange(event: Event) {
      const customEvent = event as CustomEvent<BasecampPublicationId>;
      if (isPublicationId(customEvent.detail)) {
        setActivePublicationState(customEvent.detail);
        setHasSelectedPublication(true);
      }
    }

    window.addEventListener("storage", handleStorage);
    window.addEventListener(BASECAMP_PUBLICATION_EVENT, handlePublicationChange as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(BASECAMP_PUBLICATION_EVENT, handlePublicationChange as EventListener);
    };
  }, []);

  const setActivePublication = useCallback((publication: BasecampPublicationId) => {
    setActivePublicationState(publication);
    setHasSelectedPublication(true);
    window.localStorage.setItem(BASECAMP_PUBLICATION_STORAGE_KEY, publication);
    window.dispatchEvent(new CustomEvent<BasecampPublicationId>(BASECAMP_PUBLICATION_EVENT, { detail: publication }));
  }, []);

  return {
    activePublication,
    hasSelectedPublication,
    setActivePublication,
    options: basecampPublicationOptions,
  };
}
