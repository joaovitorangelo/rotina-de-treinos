'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaRegUserCircle } from 'react-icons/fa';
import ThemeChangeButton from '../theme-change-button';
import { auth } from '../../firebase/firebaseAppConfig';
import { onAuthStateChanged } from 'firebase/auth';
import './index.css';

export function Header() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setUserName(user.displayName?.trim() ? user.displayName : user.email);
      } else {
        setUserId(null);
        setUserName(null);
      }
    });

    return () => unsubscribe();
  }, []);

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
                <FaRegUserCircle className="user-icon" fontSize={'24px'} />
                {userId ? <h1>Olá, {userName}!</h1> : null}
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
