"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { signUpSchemaValidation } from "@/schemas/signUpSchema";
import { useDebounceValue } from "usehooks-ts";
import { ApiResponse } from "@/types/ApiResponse";

const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedUsername = useDebounceValue(username, 300);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchemaValidation>>({
    resolver: zodResolver(signUpSchemaValidation),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // useEffect(() => {
  //   const checkUsernameUnique = async () => {
  //     if (debouncedUsername) {
  //       setIsCheckingUsername(true);
  //       setUsernameMessage("");
  //       try {
  //         const response = await axios.get<ApiResponse>(
  //           `/api/check-username?username=${debouncedUsername}`
  //         );
  //         setUsernameMessage(response.data.message);
  //       } catch (error) {
  //         const axiosError = error as AxiosError<ApiResponse>;
  //         setUsernameMessage(
  //           axiosError.response?.data.message ?? "Error checking username"
  //         );
  //       } finally {
  //         setIsCheckingUsername(false);
  //       }
  //     }
  //   };
  //   checkUsernameUnique();
  // }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchemaValidation>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message ?? "There was a problem with your sign-up. Please try again.";
      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setUsername(e.target.value);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* {isCheckingUsername && <Loader2 className="animate-spin" />}
            {!isCheckingUsername && usernameMessage && (
              <p
                className={`text-sm ${
                  usernameMessage === "username"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {usernameMessage}
              </p>
            )} */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" {...field} />
                  <p className="text-muted text-gray-400 text-sm">
                    We will send you a verification code
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full mt-5"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?
            <Link
              href={"/sign-in"}
              className="text-blue-600 hover:text-blue-800"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
