import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock Firebase modules for testing
vi.mock("../lib/firebase", () => ({
  auth: {},
  firestore: {},
  functions: {},
}));
