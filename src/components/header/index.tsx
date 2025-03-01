'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import "./index.css";
import ThemeChangeButton from "../theme-change-button";
import { FaRegUserCircle } from "react-icons/fa";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

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
                <FaRegUserCircle className="user-icon" fontSize={'24px'}/>
                <h1>
                  { user ? `Olá ${user.displayName || user.email}!` : null }
                </h1>
              </Link>
            </li>
            <li>
              <ThemeChangeButton />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
