import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

export let useAuth = () => {
  let navigate = useNavigate();
    
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onLogin = async (data) => {
    console.log("login data", data);
  };

  const onRegister = async (data) => {
    console.log("register data", data);
  };

  return {
    register,
    handleSubmit,
    errors,
    navigate,
    onLogin,
    onRegister,
  };
};