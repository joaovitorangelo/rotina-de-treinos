import Link from 'next/link';
import './index.css'
import { MdAccountCircle } from "react-icons/md";

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
                <h1>
                  Minha conta
                </h1>
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