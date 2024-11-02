"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from 'sonner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  otp: z.string().min(6, { message: "OTP must be 6 characters" }),
});

export function OtpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await fetch('http://127.0.0.1:8000/verify-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      console.log("Response: ", response)
      const data = await response.json();
      console.log("Data: ", data)
      if (data.isok) {
        toast.success('OTP verified successfully');
        localStorage.setItem('authToken', data.token);
        router.push('/');
      } else {
        throw new Error('Failed to verify OTP. Server responded with status: ' + response.status);
      }
    } catch (data: any) {
        toast.error(data.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 ">
      <Toaster position="top-center" />
      <Card className="w-full max-w-md bg-foreground">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold text-white">Authentication</CardTitle>
          <p className="text-2xl font-semibold text-white">Welcome! 👋</p>
          <p className="text-white">
            Please enter the OTP sent to your email
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">OTP</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your OTP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" variant="outline" disabled={isLoading}>
                {isLoading ? 'Verifying OTP...' : 'Verify OTP'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}