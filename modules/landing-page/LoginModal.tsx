import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, ArrowRight, User, Building2, Users, ArrowLeft } from 'lucide-react';

type UserType = 'patient' | 'doctor' | 'hospital' | null;
type AuthView = 'type-selection' | 'login' | 'forgot-password' | 'signup-personal' | 'signup-medical';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [userType, setUserType] = useState<UserType>(null);
  const [view, setView] = useState<AuthView>('type-selection');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // Reset form state when modal is opened/closed
  useEffect(() => {
    if (!isOpen) {
      // Reset all state when modal is closed
      setUserType(null);
      setView('type-selection');
      setEmail('');
      setPassword('');
      setRememberMe(false);
      setSignupForm({
        name: '',
        age: '',
        gender: 'male',
        address: '',
        mobile: '',
        email: '',
        password: '',
        confirmPassword: '',
        bloodGroup: '',
        allergies: '',
        chronicConditions: '',
        currentMedications: '',
        emergencyContact: '',
        emergencyPhone: '',
        agreeToTerms: false,
        agreeToPrivacy: false,
      });
    }
  }, [isOpen]);
  
  // Signup form states
  const [signupForm, setSignupForm] = useState({
    // Personal Details
    name: '',
    age: '',
    gender: 'male',
    address: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Medical Details
    bloodGroup: '',
    allergies: '',
    chronicConditions: '',
    currentMedications: '',
    emergencyContact: '',
    emergencyPhone: '',
    
    // Terms
    agreeToTerms: false,
    agreeToPrivacy: false,
  });

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would implement actual login logic
    console.log('Logging in as:', userType, { email, password, rememberMe });
    // For demo purposes, we'll just close the modal
    onClose();
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would implement password reset logic
    console.log('Password reset requested for:', email);
    alert('Password reset link has been sent to your email!');
    setView('login');
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (view === 'signup-personal') {
      setView('signup-medical');
    } else {
      // Here you would implement actual signup logic
      console.log('Signing up:', signupForm);
      // For demo purposes, we'll just close the modal
      onClose();
    }
  };

  const handleSignupInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setSignupForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleBack = () => {
    if (view === 'login' || view === 'forgot-password') {
      setView('type-selection');
      setUserType(null);
    } else if (view === 'signup-medical') {
      setView('signup-personal');
    } else if (view === 'signup-personal') {
      setView('login');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        {view !== 'type-selection' && (
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span className="text-sm">Back</span>
          </button>
        )}

        {view === 'type-selection' && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select User Type</h2>
            <div className="space-y-4">
              <button
                onClick={() => {
                  setUserType('patient');
                  setView('login');
                }}
                className="w-full p-4 bg-blue-50 hover:bg-blue-100 rounded-xl flex items-center justify-between transition"
              >
                <div className="flex items-center">
                  <Users className="w-6 h-6 text-blue-600 mr-3" />
                  <span className="font-medium">Patient</span>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-600" />
              </button>
              
              <button
                onClick={() => {
                  setUserType('doctor');
                  setView('login');
                }}
                className="w-full p-4 bg-green-50 hover:bg-green-100 rounded-xl flex items-center justify-between transition"
              >
                <div className="flex items-center">
                  <User className="w-6 h-6 text-green-600 mr-3" />
                  <span className="font-medium">Doctor</span>
                </div>
                <ArrowRight className="w-5 h-5 text-green-600" />
              </button>
              
              <button
                onClick={() => {
                  setUserType('hospital');
                  setView('login');
                }}
                className="w-full p-4 bg-purple-50 hover:bg-purple-100 rounded-xl flex items-center justify-between transition"
              >
                <div className="flex items-center">
                  <Building2 className="w-6 h-6 text-purple-600 mr-3" />
                  <span className="font-medium">Hospital</span>
                </div>
                <ArrowRight className="w-5 h-5 text-purple-600" />
              </button>
            </div>
          </>
        )}

        {view === 'login' && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-6">
              Login as {userType?.charAt(0).toUpperCase() + userType?.slice(1)}
            </h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email or Mobile Number
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email or mobile"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setView('forgot-password')}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
              >
                Login
              </button>

              {userType === 'patient' && (
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setView('signup-personal')}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              )}
            </form>
          </>
        )}

        {view === 'forgot-password' && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-6">Reset Password</h2>
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="email"
                    id="reset-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
              >
                Send Reset Link
              </button>
            </form>
          </>
        )}

        {(view === 'signup-personal' || view === 'signup-medical') && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-6">
              {view === 'signup-personal' ? 'Personal Details' : 'Medical Information'}
            </h2>
            <form onSubmit={handleSignup} className="space-y-6">
              {view === 'signup-personal' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={signupForm.name}
                        onChange={handleSignupInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        id="age"
                        name="age"
                        value={signupForm.age}
                        onChange={handleSignupInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={signupForm.gender}
                      onChange={handleSignupInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={signupForm.address}
                      onChange={handleSignupInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        id="mobile"
                        name="mobile"
                        value={signupForm.mobile}
                        onChange={handleSignupInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="signup-email"
                        name="email"
                        value={signupForm.email}
                        onChange={handleSignupInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        id="signup-password"
                        name="password"
                        value={signupForm.password}
                        onChange={handleSignupInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirm-password"
                        name="confirmPassword"
                        value={signupForm.confirmPassword}
                        onChange={handleSignupInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-2">
                        Blood Group
                      </label>
                      <input
                        type="text"
                        id="bloodGroup"
                        name="bloodGroup"
                        value={signupForm.bloodGroup}
                        onChange={handleSignupInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-2">
                        Allergies (if any)
                      </label>
                      <input
                        type="text"
                        id="allergies"
                        name="allergies"
                        value={signupForm.allergies}
                        onChange={handleSignupInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="chronicConditions" className="block text-sm font-medium text-gray-700 mb-2">
                      Chronic Conditions (if any)
                    </label>
                    <textarea
                      id="chronicConditions"
                      name="chronicConditions"
                      value={signupForm.chronicConditions}
                      onChange={handleSignupInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label htmlFor="currentMedications" className="block text-sm font-medium text-gray-700 mb-2">
                      Current Medications (if any)
                    </label>
                    <textarea
                      id="currentMedications"
                      name="currentMedications"
                      value={signupForm.currentMedications}
                      onChange={handleSignupInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact
                      </label>
                      <input
                        type="text"
                        id="emergencyContact"
                        name="emergencyContact"
                        value={signupForm.emergencyContact}
                        onChange={handleSignupInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Phone
                      </label>
                      <input
                        type="tel"
                        id="emergencyPhone"
                        name="emergencyPhone"
                        value={signupForm.emergencyPhone}
                        onChange={handleSignupInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={signupForm.agreeToTerms}
                        onChange={handleSignupInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        required
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        I agree to the <a href="#" className="text-blue-600 hover:text-blue-800">Terms of Service</a>
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="agreeToPrivacy"
                        checked={signupForm.agreeToPrivacy}
                        onChange={handleSignupInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        required
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        I agree to the <a href="#" className="text-blue-600 hover:text-blue-800">Privacy Policy</a>
                      </span>
                    </label>
                  </div>
                </>
              )}

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
                >
                  {view === 'signup-personal' ? 'Next' : 'Sign Up'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}