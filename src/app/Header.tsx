import { ReactComponent as Logo } from './assets/logo.svg';
import styles from './Header.module.scss';

export function Header() {
  return (
    <header>
      <h1 className={styles.title}>
        strip
        <Logo className={styles.logo} />
        ansi.dev
      </h1>
      <h2 className={styles.subtitle}>
        Strip&nbsp;
        <a href="https://en.wikipedia.org/wiki/ANSI_escape_code" target="wiki">
          ANSI escape sequences
        </a>
        &nbsp;from text, locally in your browser 🚫🕵️
      </h2>
    </header>
  );
}
