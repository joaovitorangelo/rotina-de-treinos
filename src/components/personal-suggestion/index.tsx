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

export default function PersonalSuggestion() {
    const [exercises, setExercises] = useState<ExerciseData[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>(""); // Estado para armazenar o nome do usuário
    const auth = getAuth();

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

        const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
        return weekdays[now.getDay()];
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                // Se o e-mail for igual a "jvangellss@gmail.com", define o nome como "João Vitor"
                setUserName(user.email === "jvangellss@gmail.com" ? "João Vitor" : user.displayName || "Usuário");
            } else {
                setUserId(null);
                setUserName(""); // Limpa o nome do usuário se não estiver logado
            }
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
                    where("userId", "==", "KU1BeElHnTVIAzGmW3c9B4khTSz1"), // Usuário fixo, pode ser alterado conforme necessidade
                    where("weekday", "==", today)
                );

                const querySnapshot = await getDocs(q);
                const fetchedExercises: ExerciseData[] = [];

                querySnapshot.forEach((doc) => {
                    fetchedExercises.push({ id: doc.id, ...doc.data() } as ExerciseData);
                });

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
        <section className="loop-exercises-grid">
            {loading ? (
                    <div></div>
                ) : exercises.length > 0 ? (
                <div>
                    <h1>Sugestões de {userName}</h1> {/* Exibe o nome do usuário ou João Vitor */}
                    <ul>
                        {exercises.map((exercise) => (
                            <Link
                                key={exercise.id}
                                href={`/muscle/?exercise=${encodeURIComponent(exercise.name)}`}
                            >
                                <li>
                                    <strong>{exercise.name} ({exercise.muscle})</strong>
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
                null
            )}
        </section>
    );
}
