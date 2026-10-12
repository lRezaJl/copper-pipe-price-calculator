export function useMediaQuery(query) {
  let matches = $state(
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  $effect(() => {
    const media = window.matchMedia(query);
    matches = media.matches;

    const listener = (e) => {
      matches = e.matches;
    };

    media.addEventListener('change', listener);
    return () => {
      media.removeEventListener('change', listener);
    };
  });

  return {
    get current() {
      return matches;
    }
  };
}
