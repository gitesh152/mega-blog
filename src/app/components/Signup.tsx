import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAppDispatch } from "../hooks";
import Logo from "./Logo";
import { authService } from "../../appwrite";
import { login as authLogin } from "../features/auth/authSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "./Input";
import Button from "./Button";

const SignupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Email address must be a valid address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormData = z.infer<typeof SignupSchema>;

function Signup() {
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
  });

  const signup = async (data: SignupFormData) => {
    setError("");
    try {
      const session = await authService.signup(
        data.email,
        data.password,
        data.name,
      );
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(authLogin({ userData }));
          navigate("/");
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Signup failed";
      setError(message);
    }
  };

  return (
    <div className="flex w-full items-center justify-center px-4">
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-stone-300 bg-stone-50 p-6 shadow-sm dark:border-stone-700 dark:bg-stone-900 sm:p-10">
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-25">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight text-stone-900 dark:text-stone-100">
          Sign up to create an account
        </h2>
        <p className="mt-2 text-center text-base text-stone-600 dark:text-stone-400">
          Already have an account?&nbsp;
          <Link
            to={`/login`}
            className="font-medium text-emerald-700 transition duration-200 hover:underline dark:text-emerald-400"
          >
            Sign In
          </Link>
        </p>
        {error && <p className="mt-8 text-center text-red-500">{error}</p>}
        <form onSubmit={handleSubmit(signup)} className="mt-8">
          <div className="space-y-4">
            <Input
              label="Name"
              placeholder="Enter your name ..."
              {...register("name")}
            />
            <Input
              label="Email:"
              placeholder="Enter your email ..."
              type="email"
              {...register("email")}
            />
            <Input
              label="Password:"
              placeholder="Enter your password ..."
              type="password"
              {...register("password")}
            />
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
