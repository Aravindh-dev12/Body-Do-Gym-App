import { useTranslation } from 'react-i18next';

import { Icon } from '@/components/Icon';
import { Logo } from '@/components/Logo';
import type { UserProfile } from '@/features/auth/useUserProfile';
import { cx } from '@/lib/cx';
import { routeHref, type TabName, TABS } from '@/lib/router';

import styles from './TabBar.module.css';

type Props = {
  current: TabName | undefined;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenProfile: () => void;
  profile: UserProfile | null;
};

/** Bottom navigation on phones, collapsible sidebar on wide screens. */
export function TabBar({ current, collapsed, onToggleCollapse, onOpenProfile, profile }: Props) {
  const { t } = useTranslation();

  return (
    <aside className={cx(styles.sidebar, collapsed && styles.collapsed)}>
      <div className={styles.top}>
        <a className={styles.brand} href={routeHref({ name: 'plan' })} title="Body Do">
          <Logo />
          {!collapsed && <span className={styles.wordmark}>{t('app.name').toLowerCase()}</span>}
        </a>
        <button
          type="button"
          className={styles.collapseToggle}
          onClick={onToggleCollapse}
          aria-label={
            collapsed
              ? t('nav.expandSidebar', 'Expand sidebar')
              : t('nav.collapseSidebar', 'Collapse sidebar')
          }
          title={
            collapsed
              ? t('nav.expandSidebar', 'Expand sidebar')
              : t('nav.collapseSidebar', 'Collapse sidebar')
          }
        >
          <Icon name={collapsed ? 'chevronRight' : 'chevronLeft'} />
        </button>
      </div>

      <nav className={styles.nav} aria-label={t('nav.label')}>
        <ul className={styles.list}>
          {TABS.map((tab) => (
            <li key={tab} className={styles.item}>
              <a
                className={styles.link}
                href={routeHref({ name: tab })}
                aria-current={tab === current ? 'page' : undefined}
                title={t(`nav.${tab}`)}
              >
                <span className={styles.iconWrap}>
                  <Icon name={tab} />
                </span>
                <span className={styles.label}>{t(`nav.${tab}`)}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.bottom}>
        <button
          type="button"
          className={styles.profileButton}
          onClick={onOpenProfile}
          aria-label={profile?.signedIn ? profile.name : t('auth.signIn', 'Sign in')}
          title={profile?.signedIn ? profile.name : t('auth.signIn', 'Sign in')}
        >
          <span className={cx(styles.avatarBadge, profile?.signedIn && styles.avatarActive)}>
            {profile?.signedIn && profile.name ? (
              profile.name.slice(0, 1).toUpperCase()
            ) : (
              <Icon name="user" />
            )}
          </span>
          {!collapsed && (
            <span className={styles.profileInfo}>
              <span className={styles.profileName}>
                {profile?.signedIn ? profile.name : t('auth.signInOrUp', 'Sign in / Sign up')}
              </span>
              <span className={styles.profileSub}>
                {profile?.signedIn ? t('auth.synced', 'Synced') : t('auth.guest', 'Guest profile')}
              </span>
            </span>
          )}
        </button>

        {!collapsed && (
          <button
            type="button"
            className={styles.bottomCollapseButton}
            onClick={onToggleCollapse}
            aria-label={t('nav.collapseSidebar', 'Collapse sidebar')}
          >
            <Icon name="chevronLeft" />
            <span>{t('nav.collapse', 'Collapse sidebar')}</span>
          </button>
        )}
      </div>
    </aside>
  );
}
