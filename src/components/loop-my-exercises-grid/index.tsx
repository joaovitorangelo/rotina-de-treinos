import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "../../firebase/firebaseAppConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../loop-exercises-grid/index.css";

export default function LoopMyExercisesGrid() {
  const [exercises, setExercises] = useState<any[]>([]);
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
        const q = query(exercisesCollection, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        const firestoreExercises: any[] = [];
        querySnapshot.forEach((doc) => {
          firestoreExercises.push(doc.data());
        });

        setExercises(firestoreExercises);
      } catch (error) {
        console.error("Erro ao buscar exercícios:", error);
      }
    };

    fetchExercises();
  }, [userId]);

  return (
    <>
      <section className="loop-exercises-grid">
        <h1>Meus exercícios</h1>
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
      </section>
    </>
  );
}
