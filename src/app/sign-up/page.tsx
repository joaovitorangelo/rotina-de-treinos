'use client'

import React from "react";
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/firebaseAppConfig";
import './page.css';

export default function SignUp() {
    const [displayname, setDisplayName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const router = useRouter();

    const handleForm = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            // Criar o usuário no Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Atualizar o perfil do usuário com o displayName
            await updateProfile(user, { displayName: displayname });

            // Redirecionar para a página de login
            router.push("/sign-in");
        } catch (error) {
            console.log("Erro ao cadastrar:", error);
        }
    };

    return (
        <section>
            <h1>Cadastrar</h1>
            <form className="access-form" onSubmit={handleForm}>
                <label htmlFor="displayname">
                    <p>Name</p>
                    <input 
                        onChange={(e) => setDisplayName(e.target.value)} 
                        required 
                        type="text" 
                        name="displayname" 
                        id="displayname" 
                        placeholder="name" 
                    />
                </label>
                <label htmlFor="email">
                    <p>Email</p>
                    <input 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        type="email" 
                        name="email" 
                        id="email" 
                        placeholder="example@mail.com" 
                    />
                </label>
                <label htmlFor="password">
                    <p>Password</p>
                    <input 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        type="password" 
                        name="password" 
                        id="password" 
                        placeholder="password" 
                    />
                </label>
                <button type="submit">Cadastrar</button>
                <button type="button" onClick={() => router.push("/sign-in")}>Entrar</button>
            </form>
        </section>
    );
}
