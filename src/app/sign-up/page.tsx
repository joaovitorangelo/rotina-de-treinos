'use client'

import React from "react";
import signUp from "../../firebase/auth/signUp";
import { useRouter } from 'next/navigation';
import './page.css';

export default function SignUp() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const router = useRouter()

    const handleForm = async (event: React.FormEvent) => {
        event.preventDefault()

        const { result, error } = await signUp(email, password);

        if (error) {
            return console.log(error)
        }

        return router.push("/sign-in")
    }
    return (
        <>
            <section>
                <h1>Cadastrar</h1>
                <form className="access-form" onSubmit={handleForm}>
                    <label htmlFor="email">
                        <p>Email</p>
                        <input onChange={(e) => setEmail(e.target.value)} required type="email" name="email" id="email" placeholder="example@mail.com" />
                    </label>
                    <label htmlFor="password">
                        <p>Password</p>
                        <input onChange={(e) => setPassword(e.target.value)} required type="password" name="password" id="password" placeholder="password" />
                    </label>
                    <button type="submit">Cadastrar</button>
                    <button type="button" onClick={() => router.push("/sign-in")}>Entrar</button>
                </form>
            </section>
        </>
    );
}
