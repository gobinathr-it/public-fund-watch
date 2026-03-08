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
import { Eye, EyeOff, User, Building2, ShieldCheck } from "lucide-react";
import logo from "@/assets/logo.png";
import ashokaEmblem from "@/assets/ashoka-emblem.png";

const DEPARTMENTS = [
  "Agriculture",
  "Education",
  "Health",
  "Social Welfare",
  "Labour Welfare",
  "Housing",
  "Women & Child Development",
  "Rural Development",
] as const;

const publicSchema = z.object({
  mobileNumber: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
  password: z.string().min(1, "Password is required"),
});

const govSchema = z.object({
  email: z.string().trim().email("Enter a valid government email"),
  password: z.string().min(1, "Password is required"),
  department: z.string().min(1, "Select a department"),
});

const adminSchema = z.object({
  email: z.string().trim().email("Enter a valid admin email"),
  password: z.string().min(1, "Password is required"),
});

type PublicForm = z.infer<typeof publicSchema>;
type GovForm = z.infer<typeof govSchema>;
type AdminForm = z.infer<typeof adminSchema>;

type LoginRole = "public" | "government" | "admin";

const ROLE_TABS: { key: LoginRole; label: string; icon: typeof User }[] = [
  { key: "public", label: "Public User", icon: User },
  { key: "government", label: "Govt Authority", icon: Building2 },
  { key: "admin", label: "Admin", icon: ShieldCheck },
];

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [role, setRole] = useState<LoginRole>("public");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const publicForm = useForm<PublicForm>({ resolver: zodResolver(publicSchema) });
  const govForm = useForm<GovForm>({ resolver: zodResolver(govSchema) });
  const adminForm = useForm<AdminForm>({ resolver: zodResolver(adminSchema) });

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  const handleLogin = async (email: string, password: string) => {
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({ title: "Welcome back!" });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const onPublicSubmit = (data: PublicForm) => {
    handleLogin(`${data.mobileNumber}@mobile.local`, data.password);
  };

  const onGovSubmit = (data: GovForm) => {
    handleLogin(data.email, data.password);
  };

  const onAdminSubmit = (data: AdminForm) => {
    handleLogin(data.email, data.password);
  };

  const handleGoogleSignIn = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast({ title: "Google sign in failed", description: String(error), variant: "destructive" });
    }
  };

  const PasswordField = ({ id, registerProps, error }: { id: string; registerProps: any; error?: string }) => (
    <div>
      <Label htmlFor={id}>Password</Label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          {...registerProps}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );

  const GoogleDivider = () => (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or</span></div>
      </div>
      <Button type="button" variant="outline" className="w-full rounded-xl" onClick={handleGoogleSignIn}>
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
        Continue with Google
      </Button>
    </>
  );

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-10 overflow-hidden" style={{ background: "linear-gradient(145deg, hsl(145 65% 28%) 0%, hsl(145 50% 18%) 25%, hsl(210 15% 10%) 55%, hsl(0 0% 5%) 100%)" }}>
      {/* Layer 1: subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-white/[0.03]" />
      {/* Layer 2: Ashoka Chakra watermark */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
        <svg viewBox="0 0 200 200" className="h-[280px] w-[280px] md:h-[420px] md:w-[420px] lg:h-[520px] lg:w-[520px] text-white/[0.06]" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      {/* Layer 3 */}
      <div className="relative z-10 w-full max-w-md space-y-5">
        {/* Header */}
        <div className="text-center">
          <img src={logo} alt="India Fund & Scheme Tracker" className="mx-auto mb-3 h-16 w-16" />
          <h1 className="font-display text-2xl font-bold text-white">Welcome Back</h1>
          <p className="mt-1 text-sm text-white/60">Login to India Fund & Scheme Tracker</p>
        </div>

        {/* Role Tabs */}
        <div className="flex rounded-xl border border-white/10 bg-white/[0.06] backdrop-blur-sm p-1 gap-1">
          {ROLE_TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => { setRole(key); setShowPassword(false); }}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-xs font-medium transition-all ${
                role === key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-white/50 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{label.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        {/* Public User Form */}
        {role === "public" && (
          <form onSubmit={publicForm.handleSubmit(onPublicSubmit)} className="space-y-4 rounded-2xl border border-border bg-card/95 backdrop-blur-sm p-6 shadow-lg">
            <div>
              <Label htmlFor="pub-mobile">Mobile Number</Label>
              <Input id="pub-mobile" placeholder="10-digit mobile number" {...publicForm.register("mobileNumber")} />
              {publicForm.formState.errors.mobileNumber && <p className="mt-1 text-xs text-destructive">{publicForm.formState.errors.mobileNumber.message}</p>}
            </div>
            <PasswordField id="pub-pw" registerProps={publicForm.register("password")} error={publicForm.formState.errors.password?.message} />
            <Button type="submit" className="w-full rounded-xl font-semibold" disabled={submitting}>
              {submitting ? "Logging in…" : "Login as Public User"}
            </Button>
            <GoogleDivider />
          </form>
        )}

        {/* Government Authority Form */}
        {role === "government" && (
          <form onSubmit={govForm.handleSubmit(onGovSubmit)} className="space-y-4 rounded-2xl border border-border bg-card/95 backdrop-blur-sm p-6 shadow-lg">
            <div>
              <Label htmlFor="gov-email">Government Email ID</Label>
              <Input id="gov-email" type="email" placeholder="name@gov.in" {...govForm.register("email")} />
              {govForm.formState.errors.email && <p className="mt-1 text-xs text-destructive">{govForm.formState.errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="gov-dept">Department</Label>
              <select
                id="gov-dept"
                {...govForm.register("department")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {govForm.formState.errors.department && <p className="mt-1 text-xs text-destructive">{govForm.formState.errors.department.message}</p>}
            </div>
            <PasswordField id="gov-pw" registerProps={govForm.register("password")} error={govForm.formState.errors.password?.message} />
            <Button type="submit" className="w-full rounded-xl font-semibold" disabled={submitting}>
              {submitting ? "Logging in…" : "Login as Govt Authority"}
            </Button>
            <GoogleDivider />
          </form>
        )}

        {/* Admin Form */}
        {role === "admin" && (
          <form onSubmit={adminForm.handleSubmit(onAdminSubmit)} className="space-y-4 rounded-2xl border border-border bg-card/95 backdrop-blur-sm p-6 shadow-lg">
            <div>
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input id="admin-email" type="email" placeholder="admin@platform.gov.in" {...adminForm.register("email")} />
              {adminForm.formState.errors.email && <p className="mt-1 text-xs text-destructive">{adminForm.formState.errors.email.message}</p>}
            </div>
            <PasswordField id="admin-pw" registerProps={adminForm.register("password")} error={adminForm.formState.errors.password?.message} />
            <Button type="submit" className="w-full rounded-xl font-semibold" disabled={submitting}>
              {submitting ? "Logging in…" : "Login as Admin"}
            </Button>
            <GoogleDivider />
          </form>
        )}

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
