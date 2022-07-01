import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/Auth";

import Button from "../../components/Button";
import TextInput from "../../components/TextInput";

import "./styles.css";

function Login({ history }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const { Login } = useAuth();

  async function HandleLogin() {
    await Login(email, password);
    history.push("/");
  }

  return (
    <div className="Login-container">
      <div>
        <h1>A</h1>
        <h1>SCENDANCE</h1>
      </div>
      <h4>Ferramentas D&amp;D 5</h4>
      <form onSubmit={HandleLogin}>
        <TextInput label="E-mail" value={email} onChange={setEmail} />
        <TextInput label="Password" value={password} type="password" onChange={setPassword} />
        <footer>
          <Button text="Entrar" onClick={HandleLogin} />
        </footer>
      </form>
      <span>
        Não possui uma conta? <Link to="/signup">Criar Conta</Link>
      </span>
    </div>
  );
}

export default Login;
