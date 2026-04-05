import { Link, useNavigate } from "react-router";
import { login as authLogin } from "../features/auth/authSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { authService } from "../../appwrite";
import { useAppDispatch } from "../hooks";
import Logo from "./Logo";
import Input from "./Input";
import Button from "./Button";

const LoginSchema = z.object({
  email: z.email("Email address must be a valid address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof LoginSchema>;

function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { register, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });
  const [error, setError] = useState("");

  const login = async (data: LoginFormData) => {
    setError("");
    try {
      const session = await authService.login(data.email, data.password);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(authLogin({ userData }));
          navigate("/");
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login failed";
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
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-base text-stone-600 dark:text-stone-400">
          Don&apos;t have any account?&nbsp;
          <Link
            to={`/signup`}
            className="font-medium text-emerald-700 transition duration-200 hover:underline dark:text-emerald-400"
          >
            Signup
          </Link>
        </p>
        {error && <p className="mt-8 text-center text-red-500">{error}</p>}
        <form onSubmit={handleSubmit(login)} className="mt-8">
          <div className="space-y-4">
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
              Sign In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
