import { useContext, createContext } from "react";

type ErrorModalContextType = {
    showError: (_message: string) => void;
  };

export const ErrorModalContext = createContext<ErrorModalContextType | null>(null);

export const useErrorModal = () => {
  const errorModal = useContext(ErrorModalContext);
  if (!errorModal) throw new Error("useErrorModal must be used within ErrorModalProvider");
  return errorModal;
};