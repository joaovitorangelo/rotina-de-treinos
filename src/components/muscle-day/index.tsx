'use client';

import { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseAppConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import './index.css'

interface MuscleDayProps {
    muscle: string;
    weekday: string;
}

interface ExerciseData {
    name: string;
    muscle: string;
    instructions: string;
    image?: string;
}

export default function MuscleDay({ muscle, weekday }: MuscleDayProps) {
    const [exercises, setExercises] = useState<ExerciseData[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
            }
        });

        return () => unsubscribe();
    }, [auth]);

    useEffect(() => {
        const fetchExercises = async () => {
            if (!userId) return;

            try {
                const exercisesCollection = collection(db, "exercises");
                const q = query(
                    exercisesCollection,
                    where("userId", "==", userId),
                    where("muscle", "==", muscle),
                    where("weekday", "==", weekday)
                );
                const querySnapshot = await getDocs(q);
                const fetchedExercises: ExerciseData[] = [];
                
                querySnapshot.forEach((doc) => {
                    fetchedExercises.push(doc.data() as ExerciseData);
                });

                setExercises(fetchedExercises);
            } catch (error) {
                console.error("Erro ao buscar exercícios:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExercises();
    }, [muscle, weekday, userId]);

    return (
        <>
            <section className="muscle-day-container">
                <h1>Exercícios para {muscle} na {weekday}</h1>
                {loading ? (
                    <p>Carregando...</p>
                ) : exercises.length > 0 ? (
                    <ul>
                        {exercises.map((exercise, index) => (
                            <li key={index}>
                                <h2>{exercise.name}</h2>
                                <strong>Instruções:</strong> 
                                <p>{exercise.instructions}</p>
                                {exercise.image && <img src={exercise.image} alt={exercise.name} />}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Nenhum exercício encontrado.</p>
                )}
            </section>
        </>
    );
}
