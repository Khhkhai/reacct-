import React, { useState } from "react";
import { Modal } from "../components/Modal";
import { ErrorModalContext } from "./useErrorModal"
import { Button } from "../components/Button";

export const ErrorModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const showError = (message: string) => {
    setErrorMessage(message);
    setIsOpen(true);
  };

  return (
    <ErrorModalContext.Provider value={{ showError }}>
      {children}
      <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Error">
        <p>{errorMessage}</p>
        <div className="flex justify-end">
          <Button name="error-cancel" onClick={() => setIsOpen(false)}>Cancel</Button>
        </div>
      </Modal>
    </ErrorModalContext.Provider>
  );
};

