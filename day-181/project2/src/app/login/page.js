'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/authContext';

const page = () => {
  let router = useRouter();
  const { user, setUser, loading } = useAuth();

  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!loading && user) {
      router.replace('/home');
    }
  }, [user, loading, router]);

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
      let res = await api.post('/api/auth/login', formData);
      setUser(res.data.user);
      router.push('/home');
    } catch (error) {
      console.log("Error in Login", error);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="font-semibold text-primary hover:underline"
            >
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
