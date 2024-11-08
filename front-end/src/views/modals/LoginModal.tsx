import React, { useEffect, useContext, useState } from "react";
import "./LoginModal.scss"; // Ensure this import is correct
import { UserContext } from "../../UserContext";

type Props = {
  type: string;
  show: boolean;
  handleClose: () => void;
  setModalType: (type: string) => void;
};

const LoginModal: React.FC<Props> = ({
  type,
  show,
  handleClose,
  setModalType,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [error, setError] = useState('');
    const [newPassword, setNewPassword] = useState("");
    const { setUser } = useContext(UserContext);
  useEffect(() => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setOldPassword("");
    setNewPassword("");
    setError('');

    if (show) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [show, type]);

  if (!show) {
    return null;
  }

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          alert("User created successfully");
          setUser(data.user);
          handleClose();
        } else {
          setError(data.error);
        }
      });
  };
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
            alert("User logged in successfully");
            setUser(data.user);
            handleClose();
        } else {
            setError(data.error);
        }
      });
  };
  const handleReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        oldPassword,
        newPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
            alert("Password reset successfully");
            handleClose();
        } else {
            setError(data.error);
        }
      });
  };
  return (
    <div
      className="modal-background position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ zIndex: 1000 }}
    >
      {type === "login" && (
        <section
          className="modal-content"
          style={{
            background:
              "linear-gradient(to right, rgba(0,15,38,100), rgba(4,86,133,100), rgba(0,15,38,100))",
            borderRadius: "10px",
            padding: "20px",
            width: "600px",
            color: "#FCAF00",
            maxWidth: "90%",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.8)",
            position: "relative",
          }}
        >
          <span className="close-button" onClick={handleClose}>
            &times;
          </span>
          <h2>Logga in</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">E-post</label>
              <input type="email" value={email} onChange={(e)=> setEmail(e.target.value)} id="email" name="email" required />
                {error.includes("User") && <p className="text-danger mt-2 shake">{error}!</p>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)} id="password" name="password" required />
                {error.includes("password") && <p className="text-danger mt-2 shake">{error}!</p>}
            </div>
            <button type="submit" className="submit-button">
              Logga in
            </button>
            <div className="my-3">
              <p>
                Har du glömt lösenordet? Klicka <span
                className="text-decoration-underline pe-auto"
                onClick={() => setModalType("reset")}
                >här</span>
              </p>
            </div>
            <button
              onClick={() => setModalType("register")}
              type="button"
              className="submit-button"
            >
              Skapa användare
            </button>
          </form>
        </section>
      )} 
      { type === "register" && (
        <div
        className="modal-content"
        style={{
          background:
            "linear-gradient(to right, rgba(0,15,38,100), rgba(4,86,133,100), rgba(0,15,38,100))",
          borderRadius: "10px",
          padding: "20px",
          width: "600px",
          color: "#FCAF00",
          maxWidth: "90%",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.8)",
          position: "relative",
        }}
      >
        <span className="close-button" onClick={handleClose}>
          &times;
        </span>
        <h2>Skapa användare</h2>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="email">E-post</label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              name="email"
              required
            />
            {error && <p className="text-danger mt-2 shake">{error}!</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Lösenord</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              name="password"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="firstname">Förnamn</label>
            <input type="text" id="firstname" onChange={(e)=>setFirstName(e.target.value)} value={firstName} name="firstname" required />
          </div>
          <div className="form-group">
            <label htmlFor="lastname">Efternamn</label>
            <input type="text" onChange={(e)=>setLastName(e.target.value)} value={lastName} id="lastname" name="lastname" required />
          </div>
          <button type="submit" className="submit-button">
            Skapa användare
          </button>
          <div className="my-3">
            <p>
              Har du redan ett konto? Klicka <span>här</span>
            </p>
          </div>
          <button
            onClick={() => setModalType("login")}
            type="button"
            className="submit-button"
          >
            Logga in
          </button>
        </form>
      </div>
      )}
    { type === "reset" && (
        <div
        className="modal-content"
        style={{
            background:
            "linear-gradient(to right, rgba(0,15,38,100), rgba(4,86,133,100), rgba(0,15,38,100))",
            borderRadius: "10px",
            padding: "20px",
            width: "600px",
            color: "#FCAF00",
            maxWidth: "90%",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.8)",
            position: "relative",
        }}
        >
        <span className="close-button" onClick={handleClose}>
            &times;
        </span>
        <h2>Återställ lösenord</h2>
        <form onSubmit={handleReset}>
            <div className="form-group">
            <label htmlFor="email">E-post</label>
            <input type="email" id="email" onChange={(e)=>setEmail(e.target.value)} value={email} name="email" required />
            {error.includes("User") && <p className="text-danger mt-2 shake">{error}!</p>}
            </div>
            <div className="form-group">
            <label htmlFor="oldpassword">Gammalt lösenord</label>
            <input type="password" id="oldpassword" onChange={(e)=>setOldPassword(e.target.value)} value={oldPassword} name="oldpassword" required />
            {error.includes("password") && <p className="text-danger mt-2 shake">{error}!</p>}
            </div>
            <div className="form-group">
            <label htmlFor="newpassword">Nytt lösenord</label>
            <input type="password" id="newpassword" onChange={(e)=>setNewPassword(e.target.value)} value={newPassword} name="newpassword" required />
            </div>
            <button type="submit" className="submit-button">
            Återställ lösenord
            </button>
        </form>
        </div>
    )}
      
    </div>
  );
};

export default LoginModal;