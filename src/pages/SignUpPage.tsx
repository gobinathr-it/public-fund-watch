import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import logo from "@/assets/logo.png";
import ashokaEmblem from "@/assets/india-emblem.png";

const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(100),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  age: z.coerce.number().min(1, "Age is required").max(150),
  gender: z.string().min(1, "Gender is required"),
  mobileNumber: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
  password: z
    .string()
    .min(8, "Minimum 8 characters")
    .regex(/[a-zA-Z]/, "Must include letters")
    .regex(/[0-9]/, "Must include numbers"),
});

type SignUpForm = z.infer<typeof signUpSchema>;

const SignUpPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({ resolver: zodResolver(signUpSchema) });

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  const onSubmit = async (data: SignUpForm) => {
    setSubmitting(true);
    try {
      const email = `${data.mobileNumber}@mobile.local`;
      const { error } = await supabase.auth.signUp({
        email,
        password: data.password,
        options: { data: { full_name: data.fullName } },
      });
      if (error) throw error;

      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        await supabase.from("profiles").update({
          full_name: data.fullName,
          date_of_birth: data.dateOfBirth,
          age: data.age,
          gender: data.gender,
          mobile_number: data.mobileNumber,
        }).eq("id", sessionData.session.user.id);
      }

      toast({ title: "Account created!", description: "Welcome to the platform." });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Sign up failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast({ title: "Google sign in failed", description: String(error), variant: "destructive" });
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-10 overflow-hidden" style={{ background: "linear-gradient(145deg, hsl(145 65% 28%) 0%, hsl(145 50% 18%) 25%, hsl(210 15% 10%) 55%, hsl(0 0% 5%) 100%)" }}>
      {/* Layer 1: subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-white/[0.03]" />
      {/* Layer 2: Ashoka Chakra watermark */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
        <svg viewBox="0 0 200 200" className="h-[280px] w-[280px] md:h-[420px] md:w-[420px] lg:h-[520px] lg:w-[520px] text-ashoka-blue/[0.06]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="20" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 15 * Math.PI) / 180;
            const x1 = 100 + 22 * Math.cos(angle);
            const y1 = 100 + 22 * Math.sin(angle);
            const x2 = 100 + 88 * Math.cos(angle);
            const y2 = 100 + 88 * Math.sin(angle);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.8" />;
          })}
        </svg>
      </div>
      {/* Layer 3: Form card */}
      <div className="relative z-10 w-full max-w-md space-y-6">
        <div className="text-center">
          <img src={logo} alt="India Fund & Scheme Tracker" className="mx-auto mb-4 h-16 w-16" />
          <h1 className="font-display text-2xl font-bold text-white">Create Account</h1>
          <p className="mt-1 text-sm text-white/60">Join India Fund & Scheme Tracker</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-border bg-card/95 backdrop-blur-sm p-6 shadow-lg">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" placeholder="Enter your full name" {...register("fullName")} />
            {errors.fullName && <p className="mt-1 text-xs text-destructive">{errors.fullName.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
              {errors.dateOfBirth && <p className="mt-1 text-xs text-destructive">{errors.dateOfBirth.message}</p>}
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" placeholder="Age" {...register("age")} />
              {errors.age && <p className="mt-1 text-xs text-destructive">{errors.age.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              {...register("gender")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="mt-1 text-xs text-destructive">{errors.gender.message}</p>}
          </div>

          <div>
            <Label htmlFor="mobileNumber">Mobile Number</Label>
            <Input id="mobileNumber" placeholder="10-digit mobile number" {...register("mobileNumber")} />
            {errors.mobileNumber && <p className="mt-1 text-xs text-destructive">{errors.mobileNumber.message}</p>}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min 8 chars, letters & numbers"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full rounded-xl font-semibold" disabled={submitting}>
            {submitting ? "Creating account…" : "Sign Up"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or</span></div>
          </div>

          <Button type="button" variant="outline" className="w-full rounded-xl" onClick={handleGoogleSignIn}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
