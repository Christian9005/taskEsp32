import React, {FC, useState} from 'react';
import './LoginForm.scss';
interface LoginFormProps {
    handleLogin: (username: string, password: string) => void;
}

const LoginForm: FC<LoginFormProps> = ({ handleLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleLogin(username, password);
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="form-group">
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button className="submit-btn" type="submit">Iniciar sesión</button>
        </form>
    );
};

export default LoginForm;
