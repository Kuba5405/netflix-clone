import React from 'react';
import Background from './components/Login/Background';
import Header from './components/Login/Header';
import CodeForm from './components/Login/CodeForm';

const LoginPage: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full text-white flex flex-col">
      <Background />
      <Header />
      <main className="relative z-10 flex justify-center items-start sm:items-center px-4 sm:px-0 pb-16 sm:pb-24 grow">
        <CodeForm />
      </main>
    </div>
  );
};

export default LoginPage;
