'use client'
import { useEffect, useState } from "react";
import Link from 'next/link';
import './index.css';

interface LoopExercisesGridProps {
  muscle: string;
}

export default function LoopExercisesGrid({ muscle }: LoopExercisesGridProps) {
    const [exercises, setExercises] = useState<any[]>([]);
    
    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await fetch(
                    `https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`,
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
                setExercises(data);
            } catch (error) {
                console.error("Erro ao buscar exercícios:", error);
            }
        };

        fetchExercises();
    }, [muscle]); // Adicionado muscle no array de dependências para garantir que a API seja chamada quando o muscle mudar

    return (
        <>
            <section className="loop-exercises-grid">
                <h1>{muscle.charAt(0).toUpperCase() + muscle.slice(1).replace("_", " ")}</h1>
                <ul>
                    {exercises.slice(0, 6).map((exercise, index) => (
                        // Melhorar código abaixo
                        <li key={exercise.id || `${exercise.name}-${index}`}> 
                            <Link href={`/muscle/?category=${muscle}&exercise=${encodeURIComponent(exercise.name)}`}>
                                <strong>{exercise.name}</strong>
                                <p className="ellipsis">{exercise.instructions}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        </>
    );
}
