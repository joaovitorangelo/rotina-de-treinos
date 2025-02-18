'use client'

import { useRouter } from "next/navigation";
import { useAuthContext } from "../../context/AuthContext";
import { useState } from "react";
import { db, auth } from "../../firebase/firebaseAppConfig";
import { collection, addDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import MuscleDay from "@/components/muscle-day";
import './page.css'

export default function ExerciseForm() {
  const { userAuth, logout } = useAuthContext();
  const router = useRouter();

  if (userAuth == null) {
    router.push("/sign-in");
  }

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [instructions, setInstructions] = useState("");
  const [muscle, setMuscle] = useState("");
  const [weekday, setWeekday] = useState("");
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
        weekday,
        createdAt: new Date(),
      });

      setName("");
      setImage("");
      setInstructions("");
      setMuscle("");
      setWeekday("");
      alert("Exercício cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar exercício:", error);
      alert("Erro ao cadastrar exercício.");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <>
      <section>
        <h1>Cadastrar rotina de treino</h1>
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
            <select
              id="muscle"
              value={muscle}
              onChange={(e) => setMuscle(e.target.value)}
              required
            >
              <option value="">Selecionar...</option>
              {Object.entries(muscles).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
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
          <label htmlFor="weekday">Dia da semana:
            <select
              id="weekday"
              value={weekday}
              onChange={(e) => setWeekday(e.target.value)}
              required
            >
              <option value="">Selecionar...</option>
              <option value="Domingo">Domingo</option>
              <option value="Segunda-feira">Segunda-feira</option>
              <option value="Terça-feira">Terça-feira</option>
              <option value="Quarta-feira">Quarta-feira</option>
              <option value="Quinta-feira">Quinta-feira</option>
              <option value="Sexta-feira">Sexta-feira</option>
              <option value="Sábado">Sábado</option>
            </select>
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
      <MuscleDay weekday='Segunda-feira' /> 
      <MuscleDay weekday='Terça-feira' /> 
      <MuscleDay weekday='Quarta-feira' /> 
      <MuscleDay weekday='Quinta-feira' /> 
      <MuscleDay weekday='Sexta-feira' /> 
      <MuscleDay weekday='Sábado' /> 
      <MuscleDay weekday='Domingo' /> 
    </>
  );
}
