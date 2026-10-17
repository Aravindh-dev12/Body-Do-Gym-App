import { useEffect, useState } from 'react';

export type UserProfile = {
  name: string;
  email: string;
  signedIn: boolean;
};

const STORAGE_KEY = 'bodydo_profile';

function loadProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === 'object' &&
      'signedIn' in parsed &&
      Boolean((parsed as Record<string, unknown>).signedIn)
    ) {
      return parsed as UserProfile;
    }
  } catch {
    // Ignore corrupt storage
  }
  return null;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(() => loadProfile());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setProfile(loadProfile());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const signIn = (name: string, email: string) => {
    const fallbackName = email.split('@')[0] ?? 'Athlete';
    const trimmed = name.trim();
    const user: UserProfile = {
      name: trimmed !== '' ? trimmed : fallbackName,
      email: email.trim(),
      signedIn: true,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setProfile(user);
    window.dispatchEvent(new Event('bodydo:profile_change'));
  };

  const signOut = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(null);
    window.dispatchEvent(new Event('bodydo:profile_change'));
  };

  useEffect(() => {
    const onLocalChange = () => setProfile(loadProfile());
    window.addEventListener('bodydo:profile_change', onLocalChange);
    return () => window.removeEventListener('bodydo:profile_change', onLocalChange);
  }, []);

  return { profile, signIn, signOut };
}
