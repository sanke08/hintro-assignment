import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { loginSchema, type LoginForm } from "../schemas/auth.schema";
import { login } from "../api/auth.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SignIn = ({ onToggle }: { onToggle: () => void }) => {
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => navigate("/"),
  });

  return (
    <form
      onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
      className="md:w-1/3 w-full flex flex-col gap-2 border p-5 bg-white rounded-lg"
    >
      <div className="text-xl font-semibold">Welcome back!</div>

      <Input placeholder="Email" {...form.register("email")} />
      <Input
        type="password"
        placeholder="Password"
        {...form.register("password")}
      />

      {mutation.error && (
        <p className="text-xs text-red-500">Invalid credentials</p>
      )}

      <Button isLoading={mutation.isPending} type="submit">
        Sign In
      </Button>

      <Button type="button" variant="ghost" onClick={onToggle}>
        Sign up <ChevronRight />
      </Button>
    </form>
  );
};

export default SignIn;
