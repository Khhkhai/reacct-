import React, { useState } from "react"
import axios from 'axios';
import { Button } from '../components/Button'
import { Input } from '../components/InputFields/Input'
import { Link } from 'react-router-dom';
import { BACKEND_PORT } from '../../backend.config.json'
import { useErrorModal } from "../utils/useErrorModal";

type LoginPageProps = {
    successCallBack: (_token: string) => void;
};

export const LoginPage = ({successCallBack} : LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { showError } = useErrorModal();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(`http://localhost:${BACKEND_PORT}/admin/auth/login`, {
        email,
        password,
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

  return (
    <div className="max-w-sm mx-auto flex flex-col items-center min-h-screen p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Login</h1>
      <form 
        id="login-form" 
        onSubmit={handleSubmit} 
        className="fieldset bg-base-200 rounded-box w-xs border p-4"
      >   
        <Input name="email" id="email" label="Email" type="email" value={email} onChange={setEmail} required={true}/> 
        <Input name="password" id="password" label="Password" type="password" value={password} onChange={setPassword} required={true}/> 
        <Button name="login-submit" type="submit">login</Button>
        <p className="text-center text-sm">
            No account yet? <Link to='/register' className="link link-primary">Register</Link>
        </p>
      </form>
    </div>
  );
};