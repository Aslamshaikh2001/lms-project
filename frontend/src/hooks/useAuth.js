import {
  useAuth as useAuthContext,
} from "../context/AuthContext.jsx";


// ======================================================
// USE AUTH HOOK
// ======================================================

export default function useAuth() {
  return useAuthContext();
}