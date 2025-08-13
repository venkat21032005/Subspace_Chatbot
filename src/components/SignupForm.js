import React, { useState, useEffect } from "react";
import { useSignUpEmailPassword, useAuthenticationStatus } from "@nhost/react";
import { Link, useNavigate } from "react-router-dom";
import {
  validateEmail,
  validatePassword,
  sanitizeInput,
} from "../utils/validation";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [signupSuccess, setSignupSuccess] = useState(false);
  const { signUpEmailPassword, isLoading, error } = useSignUpEmailPassword();
  const { isAuthenticated } = useAuthenticationStatus();
  const navigate = useNavigate();

  // Cleanup effect to reset form state when component unmounts
  useEffect(() => {
    return () => {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setValidationErrors({});
      setSignupSuccess(false);
    };
  }, []);

  const validateForm = () => {
    const errors = {};

    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;

    const passwordError = validatePassword(password);
    if (passwordError) errors.password = passwordError;

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Monitor authentication status after signup
  useEffect(() => {
    if (signupSuccess && isAuthenticated) {
      // User is now authenticated after signup, redirect to dashboard
      console.log("User authenticated after signup, redirecting to dashboard");
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1500);
    }
  }, [signupSuccess, isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const sanitizedEmail = sanitizeInput(email);

      // Sign up the user - Nhost will automatically sign them in
      const signupResult = await signUpEmailPassword(sanitizedEmail, password);
      console.log("Signup result:", signupResult);

      // Check if signup was successful
      if (signupResult.isSuccess || (!signupResult.isError && !error)) {
        setSignupSuccess(true);
        // The useEffect above will handle the redirect when isAuthenticated becomes true
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2
          style={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}
        >
          Sign Up
        </h2>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (validationErrors.email) {
                setValidationErrors((prev) => ({ ...prev, email: null }));
              }
            }}
            required
            placeholder="Enter your email"
          />
          {validationErrors.email && (
            <div className="error">{validationErrors.email}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (validationErrors.password) {
                setValidationErrors((prev) => ({ ...prev, password: null }));
              }
            }}
            required
            placeholder="Enter your password (min 6 characters)"
          />
          {validationErrors.password && (
            <div className="error">{validationErrors.password}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (validationErrors.confirmPassword) {
                setValidationErrors((prev) => ({
                  ...prev,
                  confirmPassword: null,
                }));
              }
            }}
            required
            placeholder="Confirm your password"
          />
          {validationErrors.confirmPassword && (
            <div className="error">{validationErrors.confirmPassword}</div>
          )}
        </div>

        {signupSuccess && (
          <div
            style={{
              backgroundColor: "#d4edda",
              border: "1px solid #c3e6cb",
              color: "#155724",
              padding: "0.75rem",
              borderRadius: "5px",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            ✅ Account created successfully!
            <br />
            <small>Redirecting to dashboard...</small>
          </div>
        )}

        {error && (
          <div className="error">
            {error?.message || "An error occurred during sign up"}
          </div>
        )}

        <button
          type="submit"
          className="btn"
          disabled={
            isLoading ||
            signupSuccess ||
            !email ||
            !password ||
            !confirmPassword
          }
        >
          {isLoading
            ? "Creating Account..."
            : signupSuccess
            ? "Success!"
            : "Sign Up"}
        </button>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "#667eea", textDecoration: "none" }}
          >
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
