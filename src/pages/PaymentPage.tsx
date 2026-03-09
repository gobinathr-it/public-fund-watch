import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, QrCode, ArrowRight, Heart, Shield, Users, IndianRupee } from "lucide-react";
import logo from "@/assets/logo.png";

const PaymentPage = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  const upiId = "gobinathr735-1@okicici";
  const upiQrUrl = `upi://pay?pa=${upiId}&pn=India%20Fund%20Tracker&am=&cu=INR`;

  const paymentApps = [
    { name: "Google Pay", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png" },
    { name: "PhonePe", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/512px-PhonePe_Logo.svg.png" },
    { name: "Paytm", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/512px-Paytm_Logo_%28standalone%29.svg.png" },
  ];

  const features = [
    { icon: Shield, title: "Verified Schemes", desc: "All government schemes verified from official sources" },
    { icon: Users, title: "Pan-India Coverage", desc: "Schemes from all 28 states and 8 UTs" },
    { icon: Heart, title: "Community Driven", desc: "Built for citizens, by citizens" },
  ];

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-10 overflow-hidden bg-hero">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-white/[0.03]" />
      
      {/* Ashoka Chakra watermark */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
        <svg viewBox="0 0 200 200" className="h-[85vw] w-[85vw] max-h-[750px] max-w-[750px] md:h-[80vw] md:w-[80vw] md:max-h-[850px] md:max-w-[850px] lg:h-[90vh] lg:w-[90vh] lg:max-h-[950px] lg:max-w-[950px] text-white/[0.04] animate-slow-spin" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
          <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="100" cy="100" r="20" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
          <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="0.3" opacity="0.3" />
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 15 * Math.PI) / 180;
            const x1 = 100 + 22 * Math.cos(angle);
            const y1 = 100 + 22 * Math.sin(angle);
            const x2 = 100 + 88 * Math.cos(angle);
            const y2 = 100 + 88 * Math.sin(angle);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.7" />;
          })}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 15 * Math.PI) / 180;
            const cx = 100 + 90 * Math.cos(angle);
            const cy = 100 + 90 * Math.sin(angle);
            return <circle key={`d${i}`} cx={cx} cy={cy} r="1.5" fill="currentColor" opacity="0.5" />;
          })}
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl space-y-6 px-2 sm:px-0">
        {/* Header */}
        <div className="text-center">
          <img src={logo} alt="India Fund & Scheme Tracker" className="mx-auto mb-4 h-20 w-20" />
          <h1 className="font-display text-3xl font-bold text-white">Support India Fund & Scheme Tracker</h1>
          <p className="mt-3 text-base text-white/70 max-w-lg mx-auto">
            This platform helps citizens discover government schemes, scholarships, agriculture programs, and welfare benefits across India in one place.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col items-center text-center p-4 rounded-xl border border-white/10 backdrop-blur-sm" style={{ background: "rgba(0,0,0,0.25)" }}>
              <feature.icon className="h-8 w-8 text-primary mb-2" />
              <h3 className="text-sm font-semibold text-white">{feature.title}</h3>
              <p className="text-xs text-white/60 mt-1">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Payment Card */}
        <Card className="border-white/10 backdrop-blur-xl" style={{ background: "rgba(0,0,0,0.35)" }}>
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-white flex items-center justify-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Support the Platform
            </CardTitle>
            <CardDescription className="text-white/60">
              Your small contribution helps us maintain and improve the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Minimum contribution */}
            <div className="text-center p-4 rounded-lg border border-primary/30 bg-primary/10">
              <p className="text-sm text-white/70">Minimum Contribution</p>
              <p className="text-3xl font-bold text-primary flex items-center justify-center gap-1">
                <IndianRupee className="h-7 w-7" />2
              </p>
            </div>

            {/* UPI Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-white/80">
                <QrCode className="h-5 w-5" />
                <span className="font-medium">Scan QR or use UPI ID</span>
              </div>

              {/* QR Code placeholder */}
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-xl">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiQrUrl)}`}
                    alt="UPI QR Code"
                    className="h-36 w-36"
                  />
                </div>
              </div>

              {/* UPI ID */}
              <div className="text-center">
                <p className="text-sm text-white/60">UPI ID</p>
                <p className="font-mono text-lg text-primary font-semibold">{upiId}</p>
              </div>

              {/* Payment Apps */}
              <div className="flex justify-center gap-6 pt-2">
                {paymentApps.map((app) => (
                  <div key={app.name} className="flex flex-col items-center gap-1">
                    <div className="h-12 w-12 rounded-full bg-white p-2 flex items-center justify-center">
                      <Smartphone className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <span className="text-xs text-white/60">{app.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <Button asChild className="w-full rounded-xl font-semibold h-12 text-base">
                <a href={upiQrUrl}>
                  <IndianRupee className="h-5 w-5 mr-2" />
                  Pay Now
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full rounded-xl border-white/15 bg-white/[0.08] text-white hover:bg-white/15 hover:text-white h-12 text-base">
                <Link to="/">
                  Skip & Continue
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-white/40">
          All contributions are voluntary. You can use the platform for free.
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;
