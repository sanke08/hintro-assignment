import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { registerSchema, type RegisterForm } from "../schemas/auth.schema";
import { register } from "../api/auth.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SignUp = ({ onToggle }: { onToggle: () => void }) => {
  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: () => navigate("/"),
  });

  return (
    <form
      onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
      className="md:w-1/3 w-full flex flex-col gap-2 border p-5 bg-white rounded-lg"
    >
      <div className="text-xl font-semibold">Create account</div>

      <Input placeholder="Name" {...form.register("name")} />
      <Input placeholder="Email" {...form.register("email")} />
      <Input
        type="password"
        placeholder="Password"
        {...form.register("password")}
      />

      {mutation.error && (
        <p className="text-xs text-red-500">Registration failed</p>
      )}

      <Button isLoading={mutation.isPending} type="submit">
        Sign Up
      </Button>

      <Button type="button" variant="ghost" onClick={onToggle}>
        Sign in <ChevronRight />
      </Button>
    </form>
  );
};

export default SignUp;
