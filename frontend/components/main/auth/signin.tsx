"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    // .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" }),
    // .regex(/[0-9]/, { message: "Password must contain at least one number" }),
});

export function SigninForm() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch('http://127.0.0.1:8000/sign-up/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        console.log('OTP sent to your email');
      } else {
        throw new Error('Failed to send OTP. Server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 ">
      <Card className="w-full max-w-md bg-foreground">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold text-white">Authentication</CardTitle>
          <p className="text-2xl font-semibold text-white">Welcome! 👋</p>
          <p className="text-white">
            Please sign-in to your account to continue
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your Email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="8 + characters"
                          type={showPassword ? "text" : "password"}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" variant="outline">
                SIGN IN
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <a href="/sign-up" className="text-muted-foreground hover:underline hover:text-white">
                Sign Up
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}