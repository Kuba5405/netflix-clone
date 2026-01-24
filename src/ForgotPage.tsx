import ForgotHeader from './components/Forgot/Header';
import ForgotForm from './components/Forgot/Form';

function Forgot() {


  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-black/80 via-white/20" />
 
      <div className="relative z-10">
        <ForgotHeader />
        <ForgotForm />
      </div>
    </div>
  );
}

export default Forgot;
