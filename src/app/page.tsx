'use client'
import { useRouter } from "next/navigation";
import { useAuthContext } from "../context/AuthContext";
import { useEffect } from 'react';
import { NotificationPermission } from '../context/NotificationPermission';
import { SendNotification } from '../context/SendNotification';

// import LoopExercisesGrid from "../components/loop-exercises-grid"
import LoopMyExercisesGrid from "../components/loop-my-exercises-grid"
import SearchExercise from "../components/search-exercise/index";
import ExerciseToday from "@/components/exercise-today";
import PersonalSuggestion from "@/components/personal-suggestion";

export default function Home() {
  const { userAuth, logout } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (userAuth == null) {
      router.push("/sign-in");
    }

    NotificationPermission().then(token => {
      if (token) {
        SendNotification(token);
      }
    });
  }, [userAuth]);

  return (
    <>
      {/* {userAuth && (
        <section>
          <h1 >Only logged in users can view this page</h1>
          <button onClick={() => logout()}>Sign Out</button>
        </section>
      )} */}
      <SearchExercise />
      <ExerciseToday />
      <PersonalSuggestion />
      {/* <LoopExercisesGrid muscle='triceps' />
      <LoopExercisesGrid muscle='biceps' />
      <LoopExercisesGrid muscle='chest' />
      <LoopExercisesGrid muscle='lower_back' /> */}
      <LoopMyExercisesGrid />
    </>
  );
}
