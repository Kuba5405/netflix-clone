import React from 'react';
import Background from './components/Register/Background';
import Header from './components/Register/Header';
import RegisterForm from './components/Register/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full text-white flex flex-col">
      <Background />
      <Header />
      <main className="relative z-10 flex justify-center items-start sm:items-center grow">
        <RegisterForm />
      </main>
    </div>
  );
};

export default RegisterPage;
