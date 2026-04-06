const FALLBACK_API_URL = 'https://interviewprep-and-consistency-tracker.onrender.com';

const trimTrailingSlash = (value) => value.replace(/\/+$/, '');

export const resolveApiBaseUrl = () => {
  const viteApiUrl = import.meta.env?.VITE_API_URL;
  const nextApiUrl = globalThis.process?.env?.NEXT_PUBLIC_API_URL;
  const legacyReactApiUrl = globalThis.process?.env?.REACT_APP_API_URL;

  const apiBaseUrl = viteApiUrl || nextApiUrl || legacyReactApiUrl || FALLBACK_API_URL;

  return trimTrailingSlash(apiBaseUrl);
};

export const API_BASE_URL = resolveApiBaseUrl();
