'use client';

import { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseAppConfig";
import { 
    collection, 
    getDocs, 
    query, 
    where, 
    deleteDoc, 
    doc 
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { TbTrashX } from "react-icons/tb";
import './index.css';

interface MuscleDayProps {
    weekday: string;
}

interface ExerciseData {
    id: string;
    name: string;
    muscle: string;
    instructions: string;
    image?: string;
}

export default function MuscleDay({ weekday }: MuscleDayProps) {
    const [exercises, setExercises] = useState<ExerciseData[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUserId(user ? user.uid : null);
        });

        return () => unsubscribe();
    }, [auth]);

    useEffect(() => {
        const fetchExercises = async () => {
            if (!userId) return;
    
            setLoading(true);
            try {
                const exercisesCollection = collection(db, "exercises");
                const q = query(
                    exercisesCollection,
                    where("userId", "==", userId),
                    where("weekday", "==", weekday)
                );
                const querySnapshot = await getDocs(q);
                const fetchedExercises: ExerciseData[] = [];
    
                querySnapshot.forEach((doc) => {
                    fetchedExercises.push({ id: doc.id, ...doc.data() } as ExerciseData);
                });
    
                // Ordenar os exercícios primeiro por músculo e depois por nome
                fetchedExercises.sort((a, b) => {
                    // Primeiro compara os músculos
                    if (a.muscle < b.muscle) return -1;
                    if (a.muscle > b.muscle) return 1;
    
                    // Se o músculo for o mesmo, compara os nomes dos exercícios
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
    }, [weekday, userId]);

    const handleDelete = async (exerciseId: string) => {
        setDeleting(true);
        try {
            await deleteDoc(doc(db, "exercises", exerciseId));
            setExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
        } catch (error) {
            console.error("Erro ao excluir exercício:", error);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <section className="muscle-day-container">
                {loading ? (
                    <div></div>
                ) : exercises.length > 0 ? (
                    <ul>
                        <h1>{weekday}</h1>
                        {exercises.map((exercise) => (
                            <li key={exercise.id}>
                                <h2>{exercise.name} ({exercise.muscle})
                                    <TbTrashX
                                        style={{ marginBottom: '-3px', cursor: 'pointer' }}
                                        onClick={!deleting ? () => handleDelete(exercise.id) : undefined}
                                        className={deleting ? 'opacity-50 cursor-not-allowed' : ''}
                                    />
                                </h2>
                                <strong>Instruções:</strong> 
                                <p>{exercise.instructions}</p>
                                {exercise.image && <img src={exercise.image} alt={exercise.name} />}
                            </li>
                        ))}
                    </ul>
                ) : (
                    null
                )}
            </section>
        </>
    );
}
