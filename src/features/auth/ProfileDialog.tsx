import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { Dialog } from '@/components/Dialog';
import { Field, Input } from '@/components/Field';
import { Icon } from '@/components/Icon';
import { cx } from '@/lib/cx';

import styles from './ProfileDialog.module.css';
import { useUserProfile } from './useUserProfile';

type Props = {
  onClose: () => void;
};

export function ProfileDialog({ onClose }: Props) {
  const { t } = useTranslation();
  const { profile, signIn, signOut } = useUserProfile();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    signIn(name, email);
    onClose();
  };

  const handleSignOut = () => {
    signOut();
    onClose();
  };

  return (
    <Dialog
      title={
        profile?.signedIn ? t('auth.myAccount', 'My Account') : t('auth.title', 'Account & Profile')
      }
      onClose={onClose}
    >
      <div className={styles.content}>
        {profile?.signedIn ? (
          <>
            <div className={styles.info}>
              <div className={styles.avatar}>
                {profile.name ? profile.name.slice(0, 2).toUpperCase() : <Icon name="user" />}
              </div>
              <div className={styles.meta}>
                <span className={styles.name}>{profile.name}</span>
                <span className={styles.email}>{profile.email}</span>
                <span className={styles.badge}>
                  <Icon name="check" /> {t('auth.activeMember', 'Member · Sync active')}
                </span>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.row}>
                <span className={styles.rowLabel}>{t('auth.storage', 'Storage')}</span>
                <span className={styles.rowValue}>
                  {t('auth.indexedDbCloud', 'IndexedDB + Cloud Backup')}
                </span>
              </div>
              <div className={styles.row}>
                <span className={styles.rowLabel}>{t('auth.status', 'Workout Plan')}</span>
                <span className={styles.rowValue}>{t('auth.synced', 'Synced')}</span>
              </div>
            </div>

            <p className={styles.hint}>
              {t(
                'auth.syncHint',
                'Your exercise history, dumbbell settings, and workout splits are automatically preserved.',
              )}
            </p>

            <div className={styles.actions}>
              <Button variant="danger" block onClick={handleSignOut}>
                {t('auth.signOut', 'Sign Out')}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.tabs} role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'signin'}
                className={cx(styles.tab, mode === 'signin' && styles.tabActive)}
                onClick={() => setMode('signin')}
              >
                {t('auth.signIn', 'Sign In')}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'signup'}
                className={cx(styles.tab, mode === 'signup' && styles.tabActive)}
                onClick={() => setMode('signup')}
              >
                {t('auth.signUp', 'Create Account')}
              </button>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <Field label={t('auth.nameLabel', 'Full Name or Nickname')}>
                  {(props) => (
                    <Input
                      {...props}
                      type="text"
                      placeholder="e.g. Alex"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  )}
                </Field>
              )}

              <Field label={t('auth.emailLabel', 'Email')}>
                {(props) => (
                  <Input
                    {...props}
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                )}
              </Field>

              <Field label={t('auth.passwordLabel', 'Password')}>
                {(props) => (
                  <Input
                    {...props}
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                )}
              </Field>

              <p className={styles.hint}>
                {t(
                  'auth.guestNotice',
                  'Currently storing training data locally. Signing in connects your workout logs across devices.',
                )}
              </p>

              <div className={styles.actions}>
                <Button variant="primary" type="submit" block>
                  {mode === 'signin'
                    ? t('auth.signIn', 'Sign In')
                    : t('auth.createAccount', 'Create Account')}
                </Button>
                <Button variant="ghost" block onClick={onClose}>
                  {t('auth.continueAsGuest', 'Continue as Guest')}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </Dialog>
  );
}
