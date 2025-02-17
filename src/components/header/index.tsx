import Link from 'next/link';
import './index.css'

export function Header() {
  return (
    <header>
      <div>
        <Link href="/">
          <h1>Treinos</h1>
        </Link>
        <nav>
          <ul>
            <li>
              <Link href="/account">
                Minha conta
              </Link>
            </li>
            {/* <li>
              <Link href="/sign-up">
                Login
              </Link>
            </li> */}
          </ul>
        </nav>
      </div>
    </header>
  );
}