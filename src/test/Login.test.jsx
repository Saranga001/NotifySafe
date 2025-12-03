import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../../pages/Login";

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
  useAuth: () => ({
    login: vi.fn(),
    signup: vi.fn(),
  }),
}));

describe("Login Component", () => {
  it("renders login form", () => {
    render(<Login />);
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  });

  it("has email and password inputs", () => {
    render(<Login />);
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
  });

  it("toggles between login and signup", () => {
    render(<Login />);
    const toggleBtn = screen.getByText(/Create Account/i);
    fireEvent.click(toggleBtn);
    expect(screen.getByText(/Back to Login/i)).toBeInTheDocument();
  });
});
