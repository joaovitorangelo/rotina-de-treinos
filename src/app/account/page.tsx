'use client'

import { useState } from "react";
import { db, auth } from "../../firebase/firebaseAppConfig";
import { collection, addDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import './page.css'

export default function ExerciseForm() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [instructions, setInstructions] = useState("");
  const [muscle, setMuscle] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [user] = useAuthState(auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Você precisa estar logado para cadastrar um exercício.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "exercises"), {
        userId: user.uid,
        name,
        image,
        instructions,
        muscle: muscle.toLowerCase(),
        createdAt: new Date(),
      });

      setName("");
      setImage("");
      setInstructions("");
      setMuscle("");
      alert("Exercício cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar exercício:", error);
      alert("Erro ao cadastrar exercício.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section>
        <h1>Cadastrar Exercício</h1>
        <form className="register-exercise" onSubmit={handleSubmit}>
          <label htmlFor="exercise_name">Exercício:
            <input
              type="text"
              id="exercise_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label htmlFor="muscle">Músculo:
            <input
              type="text"
              id="muscle"
              value={muscle}
              onChange={(e) => setMuscle(e.target.value)}
              required
            />
          </label>
          <label htmlFor="exercise_image_url">URL da imagem:
            <input
              type="text"
              id="exercise_image_url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </label>
          <label htmlFor="exercise_instructions">Instruções:
            <textarea
              id="exercise_instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
            />
          </label>
          <div className="submit-container">
            <button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
