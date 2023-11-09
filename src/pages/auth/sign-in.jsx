import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Navigate, Link } from "react-router-dom";

const apiUrl = 'https://api.abdullajonov.uz/legend-backend-api/api/admin/login';


export function SignIn() {
  const [loginType, setLoginType] = useState();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [tokens, setToken] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login: name, password }),
      });
      toast.success('Ro\'yhatdan muoffaqiyatli o\'tdingiz', {
        position: toast.POSITION.TOP_RIGHT
      });
      if (response.ok) {
        const data = await response.json();
        setToken(data.data.remember_token);
        sessionStorage.setItem('token', data.data.remember_token);
      } else {
      }
    } catch (error) {

    }
    toast.error('Ro\'yhatdan o\'tmadingiz', {
      position: toast.POSITION.TOP_RIGHT
    });
  };
  if (sessionStorage.getItem('token')) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <img
        src="https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 z-0 h-full w-full bg-black/50" />
      <div className="container mx-auto p-4">
        <Card className="absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Sign In
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <Input type="text" label="Name" size="lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input type="password" label="Password" size="lg" placeholder={"Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required />
            <div className="-ml-2.5">
              <h2 className=' ml-2 font-sans text-xl'></h2>
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button type="button" onClick={handleLogin} variant="gradient" fullWidth>
              Sign In
            </Button>

          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default SignIn;
