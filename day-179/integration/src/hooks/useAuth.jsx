import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { axiosInstance } from "../config/axiosInstance";
import { useDispatch } from "react-redux";
import { addUser } from "../state/authReducer";
export let useAuth = () => {
  let navigate = useNavigate();
    let dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onLogin = async (data) => {
    // console.log("login data", data);
    try {
        let res = await axiosInstance.post("/api/auth/login", data)
        console.log("login response", res);
        dispatch(addUser(res.data.user));
    } catch (error) {
        console.log("error in login", error)
    }
  };

  const onRegister = async (data) => {
    // console.log("register data", data);
    try {
        let res = await axiosInstance.post("/api/auth/register", data)
        console.log("register response", res);
    } catch (error) {
        console.log("error in register", error)
    }
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