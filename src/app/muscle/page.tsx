'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import { db } from "../../firebase/firebaseAppConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import './page.css';

interface ExerciseData {
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
  image?: string;
}

export default function Muscle() {
    const searchParams = useSearchParams();
    const muscleName = searchParams.get('category');
    const exerciseName = searchParams.get('exercise');
    const [exercise, setExercise] = useState<ExerciseData | null>(null);
    
    useEffect(() => {
        const fetchExercises = async () => {
            if (exerciseName) {
                try {
                    // Se não houver muscleName, fazemos a busca no Firebase por exercício
                    if (!muscleName) {
                        const exercisesCollection = collection(db, "exercises");
                        const q = query(exercisesCollection, where("name", "==", exerciseName));
                        const querySnapshot = await getDocs(q);
                        const firestoreExercises: ExerciseData[] = [];
                        querySnapshot.forEach((doc) => {
                            firestoreExercises.push(doc.data() as ExerciseData);
                        });

                        const foundExercise = firestoreExercises[0] || null;
                        setExercise(foundExercise);
                    } else {
                        // Busca na API se muscleName estiver presente
                        const response = await fetch(
                            `https://api.api-ninjas.com/v1/exercises?muscle=${muscleName}`,
                            {
                                headers: {
                                    "X-Api-Key": "7z6mOFNgv/UzAlTxNviWCw==2mZi5EB0WWdyOiAF",
                                },
                            }
                        );

                        if (!response.ok) {
                            throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
                        }

                        const data = await response.json();
                        const foundExercise = data.find((item: ExerciseData) =>
                            item.name.toLowerCase() === exerciseName?.toLowerCase()
                        );
                        setExercise(foundExercise || null);
                    }
                } catch (error) {
                    console.error("Erro ao buscar exercícios:", error);
                }
            }
        };

        fetchExercises();
    }, [exerciseName, muscleName]);

    return (
        <section className="muscle-section">
            {exercise ? (
                <div>
                    <h1>{exercise.name}</h1>
                    {exercise.type && <p><strong>Tipo:</strong> {exercise.type}</p>}
                    {exercise.muscle && <p><strong>Músculo:</strong> {exercise.muscle}</p>}
                    {exercise.equipment && <p><strong>Equipamento:</strong> {exercise.equipment}</p>}
                    {exercise.difficulty && <p><strong>Dificuldade:</strong> {exercise.difficulty}</p>}
                    {exercise.instructions && (
                        <>
                            <p><strong>Instruções:</strong></p>
                            <p>{exercise.instructions}</p>
                        </>
                    )}
                    {exercise.image && <img src={exercise.image} alt={exercise.name} />}
                </div>
            ) : (
                null
            )}
        </section>
    );
};

