import React from 'react';
import Background from './components/Login/Background';
import Header from './components/Login/Header';
import LoginForm from './components/Login/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full text-white flex flex-col">
      <Background />
      <Header />
      <main className="relative z-10 flex justify-center items-start sm:items-center grow">
        <LoginForm />
      </main>
    </div>
  );
};

export default LoginPage;
