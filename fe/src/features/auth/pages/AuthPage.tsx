import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import { twMerge } from "tailwind-merge";
import useAuthUser from "../hooks/useAuthUser";

const AuthPage = () => {
  const [toggle, setToggle] = useState(false);
  const { isLoading, user } = useAuthUser();

  if (isLoading) return <div>Loading...</div>;

  if (user) return <Navigate to="/" replace />;

  return (
    <div className="fixed h-full w-full">
      <div className="w-full border-b border-neutral-500/20 p-3 px-5">
        <Link to="/" className="text-xl font-bold">
          Task
        </Link>
      </div>

      <div className="min-h-[90%] px-10 fixed w-full flex justify-center items-center">
        <div
          className={twMerge(
            "w-full justify-center transition-all",
            toggle ? "hidden" : "flex"
          )}
        >
          <SignIn onToggle={() => setToggle(true)} />
        </div>

        <div
          className={twMerge(
            "w-full justify-center transition-all",
            toggle ? "flex" : "hidden"
          )}
        >
          <SignUp onToggle={() => setToggle(false)} />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
