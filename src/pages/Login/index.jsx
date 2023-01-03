import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";
import { useForm } from "react-hook-form";
import styles from "./Login.module.scss";
import { Navigate } from "react-router-dom";

export const Login = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "testim5@test.ru",
      password: "8569403",
    },
    mode: 'all',
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchAuth(values));
    console.log(data);

    if (!data.payload) {
      return alert('Не вдалося авторизуватися!');
    }

    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    }
  };


  if (isAuth) {
    return <Navigate to="/"/>
  };

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          type="email"
          {...register('email', { required: 'Вкажіть пошту'})}
          fullWidth
        />
        <TextField 
          className={styles.field} 
          label="Пароль"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Введіть пароль'})}
          fullWidth 
        />
        <Button
          disabled={!isValid}
          type="submit" 
          size="large" 
          variant="contained" 
          fullWidth
        >
          Войти
        </Button>
      </form>
    </Paper>
  );
};
