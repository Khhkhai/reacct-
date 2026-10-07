import React, { useState } from "react"
import axios from 'axios';
import { Button } from '../components/Button'
import { Input } from '../components/InputFields/Input'
import { Link } from 'react-router-dom';
import { BACKEND_PORT } from '../../backend.config.json'
import { useErrorModal } from "../utils/useErrorModal";

type RegisterPageProps = {
    successCallBack: (_token: string) => void;
};

export const RegisterPage = ({successCallBack} : RegisterPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  const { showError } = useErrorModal();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(`http://localhost:${BACKEND_PORT}/admin/auth/register`, {
        email,
        password,
        name,
      });
      successCallBack(response.data.token);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        showError(error.response?.data?.error || "Something went wrong");
      } else {
        showError("Unexpected error");
      }
    }
  } 
  const passwordsMatch = password === confirmPassword;

  return (
    <div className="max-w-sm mx-auto flex flex-col items-center min-h-screen p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Register</h1>
      
      <form 
        id="register-form" 
        onSubmit={handleSubmit} 
        className="fieldset bg-base-200 rounded-box w-xs border p-4"
      >   
        <Input name="name" id="name" label="Name" type="text" value={name} onChange={setName} required={true}/> 
        <Input name="email" id="email" label="Email" type="email" value={email} onChange={setEmail} required={true}/> 
        <Input name="password" id="password" label="Password" type="password" value={password} onChange={setPassword} required={true}/>
        <Input name="confirm-password" id="confirm-password" label="Confirm Password" type="password" value={confirmPassword} onChange={setConfirmPassword} required={true}/> 
        {!passwordsMatch && (
          <p className="text-red-500 text-xs">Passwords do not match</p>
        )}
        <Button name="register" type="submit" disabled={!passwordsMatch}>Register</Button>
        <p className="text-center text-sm">
            Already have an account? 
          <Link to='/login' className="link link-primary">Login</Link>
        </p>
      </form>
    </div>    
  );
};