'use client';

import { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseAppConfig";
import { 
    collection, 
    getDocs, 
    query, 
    where 
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

interface ExerciseData {
    id: string;
    name: string;
    muscle: string;
    instructions: string;
    image?: string;
}

export default function ExerciseToday() {
    const [exercises, setExercises] = useState<ExerciseData[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const auth = getAuth();

    // Função para obter o nome do dia da semana
    const getTodayWeekday = (): string => {
        const weekdays = [
            "Domingo",
            "Segunda-feira",
            "Terça-feira",
            "Quarta-feira",
            "Quinta-feira",
            "Sexta-feira",
            "Sábado"
        ];
    

        const now = new Date( new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    
        return weekdays[now.getDay()];
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUserId(user ? user.uid : null);
        });

        return () => unsubscribe();
    }, [auth]);

    useEffect(() => {
        const fetchExercises = async () => {
            if (!userId) return;

            const today = getTodayWeekday();
            setLoading(true);
            try {
                const exercisesCollection = collection(db, "exercises");
                const q = query(
                    exercisesCollection,
                    where("userId", "==", userId),
                    where("weekday", "==", today)
                );
                console.log(today);
                const querySnapshot = await getDocs(q);
                const fetchedExercises: ExerciseData[] = [];

                querySnapshot.forEach((doc) => {
                    fetchedExercises.push({ id: doc.id, ...doc.data() } as ExerciseData);
                });

                // Ordenar os exercícios primeiro por músculo e depois por nome
                fetchedExercises.sort((a, b) => {
                    if (a.muscle < b.muscle) return -1;
                    if (a.muscle > b.muscle) return 1;
                    return a.name.localeCompare(b.name);
                });

                setExercises(fetchedExercises);
            } catch (error) {
                console.error("Erro ao buscar exercícios:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExercises();
    }, [userId]);

    return (
        <>
            <section className="loop-exercises-grid">
                {loading ? (
                    <div className="loading"></div>
                ) : exercises.length > 0 ? (
                    <div>
                        <h1>Hoje</h1>
                    <ul>
                        {exercises.slice(0, 6).map((exercise, index) => (
                            <Link
                                key={index}
                                href={`/muscle/?exercise=${encodeURIComponent(exercise.name)}`}
                            >
                            <li>
                                <strong>{exercise.name}</strong>
                                <div
                                className="exercise-img"
                                style={{ backgroundImage: `url(${exercise.image})` }}
                                ></div>
                                <p className="ellipsis">{exercise.instructions}</p>
                            </li>
                            </Link>
                        ))}
                    </ul>
                    </div>
                ) : (
                    <p style={{ textAlign: 'center' }}>Descanse um pouco por hoje...</p>
                )}
            </section>
        </>
    );
}
