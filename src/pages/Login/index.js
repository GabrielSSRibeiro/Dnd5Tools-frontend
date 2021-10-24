import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/Auth";
// import { useHistory } from "react-router-dom";
//  import api from "../../services/api";

import "./styles.css";

function Login({ history }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const { Login } = useAuth();
  // const history = useHistory();

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  async function HandleLogin(e) {
    e.preventDefault();

    await Login(email, password);
    history.push("/");
  }

  return (
    <div className="Login-container">
      <h1>ASCENDANCE</h1>
      <h3>Ferramentas D&amp;D 5</h3>
      <form onSubmit={HandleLogin}>
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
        <button>Entrar</button>
      </form>
      <span>
        Não possui uma conta? <Link to="/signup">Criar Conta</Link>
      </span>
    </div>
  );
}

export default Login;
