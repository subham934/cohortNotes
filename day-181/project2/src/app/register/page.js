"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
const page = () => {
  let router = useRouter();
  const [formData, setFormData] = useState({});
  let handleChange = (e) => {
    let { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await api.post("/api/auth/register", formData);
      router.push("/home");
    } catch (error) {
      console.log("Error in Registration", error);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md shadow-lg">

        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">
            Create an Account
          </CardTitle>
          <CardDescription>
            Enter your details to create a new account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                name="name"
                onChange={handleChange}
                id="name"
                type="text"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                name="email"
                onChange={handleChange}
                id="email"
                type="email"
                placeholder="name@example.com"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                name="password"
                onChange={handleChange} 
                id="password"
                type="password"
                placeholder="Create a password"
                required
              />
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full">
              Create Account
            </Button>

          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Login
            </Link>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default page;
