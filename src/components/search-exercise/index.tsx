import { useState, useEffect } from "react";
import Link from "next/link";
import LoopExercisesGrid from "../loop-exercises-grid/index";
import { db } from "../../firebase/firebaseAppConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./index.css";

export default function SearchExercise() {
    const [selectedMuscle, setSelectedMuscle] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [firebaseExercises, setFirebaseExercises] = useState<any[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const auth = getAuth();

    const muscles = {
        abdominals: "Abdominal",
        abductors: "Abdutores",
        adductors: "Adutores",
        biceps: "Bíceps",
        calves: "Panturrilhas",
        chest: "Peitoral",
        forearms: "Antebraços",
        glutes: "Glúteos",
        hamstrings: "Posterior da coxa",
        lats: "Dorsais",
        lower_back: "Parte inferior das costas",
        middle_back: "Parte média das costas",
        neck: "Pescoço",
        quadriceps: "Quadríceps",
        traps: "Trapézio",
        triceps: "Tríceps",
      };

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

    const handleMuscleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const muscle = event.target.value;
        setSelectedMuscle(muscle);
        setShowResults(true);
    };

    useEffect(() => {
        if (!selectedMuscle || !userId) return;

        const fetchFirebaseExercises = async () => {
            try {
                const exercisesCollection = collection(db, "exercises");
                const q = query(
                    exercisesCollection,
                    where("muscle", "==", selectedMuscle),
                    where("userId", "==", userId)
                );
                const querySnapshot = await getDocs(q);
                const firestoreExercises: any[] = [];
                querySnapshot.forEach((doc) => {
                    firestoreExercises.push(doc.data());
                });
                setFirebaseExercises(firestoreExercises);
            } catch (error) {
                console.error("Erro ao buscar exercícios do Firebase:", error);
            }
        };

        fetchFirebaseExercises();
    }, [selectedMuscle, userId]);

    return (
        <>
            <section className="search-container">
                <h1 className="search-title">Pesquisar</h1>
                <div>
                <select id="muscle-select" onChange={handleMuscleSelect} value={selectedMuscle}>
                    <option value="">Selecionar...</option>
                    {Object.entries(muscles).map(([key, value], index) => (
                        <option key={index} value={key}>
                            {value}
                        </option>
                    ))}
                </select>
                </div>
                {showResults && selectedMuscle && (
                    <>
                        <LoopExercisesGrid muscle={selectedMuscle} />
                        {firebaseExercises.length > 0 && (
                            <section className="loop-exercises-grid">
                                <ul>
                                    {firebaseExercises.map((exercise, index) => (
                                        <Link                 
                                            key={index}
                                            href={`/muscle/?exercise=${encodeURIComponent(exercise.name)}`}
                                        >
                                            <li>
                                                <strong>{exercise.name}</strong>
                                                <div className="exercise-img" style={{ backgroundImage: `url(${exercise.image})` }}></div>
                                                <p className="ellipsis">{exercise.instructions}</p>
                                            </li>
                                        </Link>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </>
                )}
            </section>
        </>
    );
}
