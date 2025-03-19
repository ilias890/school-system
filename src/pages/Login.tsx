import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext.tsx";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const { loginUser, user, loading } = useAuth(); // Access AuthContext
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
      setEmail("");
      setPassword("");
    } catch (error: any) {
      console.error("Fout bij inloggen:", error.message);
      alert("Inloggen mislukt: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <span className="loading loading-dots loading-lg flex item-center mx-auto"></span>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1>Login</h1>
      <div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            E-mailadres
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Wachtwoord
          </label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary me-2" onClick={handleLogin}>
          Inloggen
        </button>
      </div>
    </div>
  );
};

export default Login;
