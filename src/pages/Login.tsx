import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Shield, Phone, ArrowRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

const roles: { value: UserRole; label: string; desc: string }[] = [
  { value: 'customer', label: 'Customer', desc: 'Search & request workers' },
  { value: 'worker', label: 'Worker', desc: 'Accept jobs & track attendance' },
  { value: 'admin', label: 'Admin', desc: 'Manage the entire platform' },
];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState<'role' | 'phone' | 'otp'>('role');
  const [role, setRole] = useState<UserRole>('customer');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOtp = () => {
    if (phone.length >= 10) setStep('otp');
  };

  const handleVerify = () => {
    if (otp.length >= 4) {
      login(role, phone);
      navigate(role === 'admin' ? '/admin' : `/${role}`);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-8">
            <Shield className="w-10 h-10 text-accent-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-primary-foreground mb-4">Hanvika Manpower Supply</h1>
          <p className="text-primary-foreground/70 text-lg">Complete manpower & security services platform. Connecting businesses with verified workforce.</p>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
              <Shield className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-lg font-bold">Hanvika</span>
          </div>

          <AnimatePresence mode="wait">
            {step === 'role' && (
              <motion.div key="role" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
                <p className="text-muted-foreground mb-6">Select your role to continue</p>
                <div className="space-y-3 mb-6">
                  {roles.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setRole(r.value)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                        role === r.value
                          ? 'border-primary bg-primary/5 shadow-card'
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        role === r.value ? 'border-primary' : 'border-muted-foreground'
                      }`}>
                        {role === r.value && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{r.label}</p>
                        <p className="text-xs text-muted-foreground">{r.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <Button className="w-full" onClick={() => setStep('phone')}>
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {step === 'phone' && (
              <motion.div key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold mb-2">Enter your number</h2>
                <p className="text-muted-foreground mb-6">We'll send an OTP to verify</p>
                <div className="relative mb-4">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="Enter mobile number"
                    className="pl-10"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    maxLength={10}
                  />
                </div>
                <Button className="w-full" onClick={handleSendOtp} disabled={phone.length < 10}>
                  Send OTP <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <button className="w-full text-center text-sm text-muted-foreground mt-4 hover:text-foreground" onClick={() => setStep('role')}>
                  ← Back to role selection
                </button>
              </motion.div>
            )}

            {step === 'otp' && (
              <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold mb-2">Verify OTP</h2>
                <p className="text-muted-foreground mb-6">Enter the 4-digit code sent to +91 {phone}</p>
                <div className="relative mb-4">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter OTP"
                    className="pl-10 text-center text-lg tracking-[0.5em]"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    maxLength={4}
                  />
                </div>
                <Button className="w-full" onClick={handleVerify} disabled={otp.length < 4}>
                  Verify & Login <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Didn't receive? <button className="text-primary font-medium hover:underline">Resend OTP</button>
                </p>
                <button className="w-full text-center text-sm text-muted-foreground mt-2 hover:text-foreground" onClick={() => setStep('phone')}>
                  ← Change number
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-xs text-muted-foreground text-center mt-8">
            Demo: Enter any 10-digit number, then any 4-digit OTP
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
