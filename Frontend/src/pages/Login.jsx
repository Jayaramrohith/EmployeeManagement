import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

function Login() {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');

const navigate = useNavigate();

const handleSubmit = async (e) => {
e.preventDefault();


try {
  const data = await login(email, password);

  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));

  navigate('/dashboard');
} catch (err) {
  setError(err.response?.data?.message || 'Login failed');
}


};

return ( <div className="container mt-5"> <div className="row justify-content-center"> <div className="col-md-4"> <div className="card p-4 shadow"> <h3 className="text-center mb-4">Employee Login</h3>


        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  </div>
</div>


);
}

export default Login;
