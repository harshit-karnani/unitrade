import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { LogIn, AlertCircle, School } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  const handleSimpleLogin = () => {
    setError(null);

    // 1. Check if the field is empty
    if (!email) {
      setError("Please enter your college email.");
      return;
    }

    // 2. Check if it ends with @bmsit.in
    // (We convert to lowercase to make sure Harshit@bmsit.in works too)
    if (!email.toLowerCase().endsWith("@bmsit.in")) {
      setError("Access Denied: You must use a @bmsit.in email address.");
      return;
    }

    // 3. Success! Let the user in.
    console.log("Logged in via Dev Mode:", email);
    onLoginSuccess(email);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl bg-white border-t-4 border-slate-900">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center">
            <School className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-slate-900">UniTrade</CardTitle>
          <p className="text-slate-500 font-medium">BMSIT Student Portal</p>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 flex gap-3 items-start animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">College Email ID</label>
              <Input 
                type="email" 
                placeholder="e.g. harshit@bmsit.in" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-slate-300"
              />
            </div>

            <Button 
              className="w-full h-12 text-lg bg-slate-900 hover:bg-slate-800 text-white flex gap-2"
              onClick={handleSimpleLogin}
            >
              <LogIn className="w-5 h-5" />
              Enter Campus
            </Button>
            
            <p className="text-xs text-center text-slate-400">
              Developer Mode: No password required for testing.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}