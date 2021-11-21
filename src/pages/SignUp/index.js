import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/Auth";

import Button from "../../components/Button";
import TextInput from "../../components/TextInput";

import "./styles.css";

function SignUp({ history }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const { SignUp } = useAuth();

  async function HandleSignUp() {
    await SignUp(email, password);
    history.push("/");
  }

  return (
    <div className="SignUp-container">
      <div>
        <h1>A</h1>
        <h1>SCENDANCE</h1>
      </div>
      <h4>Ferramentas D&amp;D 5</h4>
      <form>
        <div>
          <TextInput
            label="E-mail"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div>
          <TextInput
            label="Password"
            value={email}
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <footer>
          <Button text="Criar Conta" onClick={HandleSignUp} />
        </footer>
      </form>
      <span>
        Já possui uma conta? <Link to="/login">Entrar</Link>
      </span>
    </div>
  );
}

export default SignUp;
