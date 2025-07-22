"use client"

import { useState, useEffect } from 'react'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react"
import { useApp } from "../contexts/AppContext"
import { toast } from "sonner"
import { useRouter } from 'next/navigation'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "login" | "register"
  onModeChange: (mode: "login" | "register") => void
}

// Custom hook to check if component has mounted (client only)
function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
}

export default function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useApp()
  const router = useRouter()
  const hasMounted = useHasMounted()

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  })

  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const [registerMessage, setRegisterMessage] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token); // Store JWT
        localStorage.setItem('userId', data.user._id); // Store userId
        toast.success('Logged in successfully!');
        setIsLoading(false);
        onClose();
        router.replace('/buyer');
        setLoginForm({ email: '', password: '' });
      } else {
        setLoginError(data.error || 'Login failed');
        toast.error(data.error || 'Login failed');
        setIsLoading(false);
      }
    } catch (err) {
      setLoginError('Login failed. Please try again.');
      toast.error('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterMessage('');
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    setIsLoading(true);
    const payload = {
      name: `${registerForm.firstName} ${registerForm.lastName}`,
      email: registerForm.email,
      password: registerForm.password,
      role: 'buyer',
    };
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('userId', data.user._id);
        setRegisterMessage('Registration successful! Please check your email for a welcome message.');
        toast.success('Account created successfully!');
        setIsLoading(false);
        onClose();
        router.replace('/buyer/');
        setRegisterForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
        });
      } else {
        setRegisterMessage(data.error || 'Registration failed');
        toast.error(data.error || 'Registration failed');
        setIsLoading(false);
      }
    } catch (err) {
      setRegisterMessage('Registration failed. Please try again.');
      toast.error('Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setLoginForm({
      email: "demo@example.com",
      password: "demo123",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md mx-4 sm:mx-auto bg-white border-2 border-gray-200 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-black text-center">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {mode === "login"
              ? "Sign in to access your account and continue shopping"
              : "Join Clothy Virtual and start your shopping journey"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {mode === "login" && loginError && (
            <div className="text-red-600 text-center font-medium mb-2">{loginError}</div>
          )}
          {mode === "register" && registerMessage && (
            <div className="text-green-600 text-center font-medium mb-2">{registerMessage}</div>
          )}
          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="pl-10 border-2 border-gray-200 rounded-xl focus:border-black transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="pl-10 pr-10 border-2 border-gray-200 rounded-xl focus:border-black transition-colors"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white hover:bg-gray-800 rounded-xl py-2.5 sm:py-3 font-medium"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleDemoLogin}
                className="w-full border-2 border-gray-200 rounded-xl py-2.5 sm:py-3 font-medium hover:bg-gray-50"
              >
                Try Demo Account
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="firstName"
                      type="text"
                      value={registerForm.firstName}
                      onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                      className="pl-10 border-2 border-gray-200 rounded-xl focus:border-black transition-colors"
                      placeholder="First name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={registerForm.lastName}
                    onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                    className="border-2 border-gray-200 rounded-xl focus:border-black transition-colors"
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registerEmail" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="registerEmail"
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    className="pl-10 border-2 border-gray-200 rounded-xl focus:border-black transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                    className="pl-10 border-2 border-gray-200 rounded-xl focus:border-black transition-colors"
                    placeholder="+94 77 123 4567"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registerPassword" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="registerPassword"
                    type={showPassword ? "text" : "password"}
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    className="pl-10 pr-10 border-2 border-gray-200 rounded-xl focus:border-black transition-colors"
                    placeholder="Create a password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    className="pl-10 pr-10 border-2 border-gray-200 rounded-xl focus:border-black transition-colors"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white hover:bg-gray-800 rounded-xl py-2.5 sm:py-3 font-medium"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-600">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => {
                  onModeChange(mode === 'login' ? 'register' : 'login');
                  setLoginError('');
                  setRegisterMessage('');
                }}
                className="font-medium text-black hover:underline"
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
