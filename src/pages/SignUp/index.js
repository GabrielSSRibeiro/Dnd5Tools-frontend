import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/Auth";
// import { useHistory } from "react-router-dom";
//  import api from "../../services/api";

import "./styles.css";

function SignUp({ history }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const { SignUp } = useAuth();
  // const history = useHistory();

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  async function HandleSignUp(e) {
    e.preventDefault();

    await SignUp(email, password);
    history.push("/");
  }

  return (
    <div className="SignUp-container">
      <h1>ASCENDANCE</h1>
      <h3>Ferramentas D&amp;D 5</h3>
      <form onSubmit={HandleSignUp}>
        <div>
          <label>E-mail</label>
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <button>Criar Conta</button>
      </form>
      <span>
        Já possui uma conta? <Link to="/login">Entrar</Link>
      </span>
    </div>
  );
}

export default SignUp;
