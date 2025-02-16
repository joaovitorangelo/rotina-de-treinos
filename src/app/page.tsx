'use client'
import { useRouter } from "next/navigation";
import { useAuthContext } from "../context/AuthContext";
import LoopExercisesGrid from "../components/loop-exercises-grid"
import SearchExercise from "../components/search-exercise/index";

export default function Home() {
  const { userAuth, logout } = useAuthContext();
  const router = useRouter();

  if (userAuth == null) {
    router.push("/sign-in");
  }

  return (
    <>
      {/* {userAuth && (
        <section>
          <h1 >Only logged in users can view this page</h1>
          <button onClick={() => logout()}>Sign Out</button>
        </section>
      )} */}
      <SearchExercise />
      <LoopExercisesGrid muscle='triceps' />
      <LoopExercisesGrid muscle='biceps' />
      <LoopExercisesGrid muscle='chest' />
      <LoopExercisesGrid muscle='lower_back' />
    </>
  );
}
