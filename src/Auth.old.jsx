import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from './api';

const LIME_GRAD = 'linear-gradient(148deg, #c6f135 0%, #e2f55c 55%, #d4ef3a 100%)';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   try {
  //     if (isLogin) {
  //       const { data } = await apiCall('/login', 'POST', { email: formData.email, password: formData.password });
  //       // const { account } = await apiCall('/account/create', 'POST', { email: formData.email, password: formData.password });
  //       console.log("data:",data)
  //       localStorage.setItem("token",data.data.token)
  //       const { account_data } = await apiCall('/account/create', 'POST', {
  //         method: 'POST',
  //         headers: {
  //           Authorization: `Bearer ${data.data.token}`,
  //         },
  //       });
  //       console.log("account: ",account_data)
  //       if (data.message === "Loged In Successfully") {
  //         localStorage.setItem('token', data.data);
  //         navigate('/dashboard');
  //       } else {
  //         setError(data.message || data.msg || 'Login failed');
  //       }
  //     } else {
  //       const { data } = await apiCall('/register', 'POST', formData);
  //       if (data.msg === "User Registered Successfully") {
  //         setIsLogin(true);
  //         setError("Registration successful! Please login.");
  //       } else {
  //         setError(data.msg || data.message || 'Registration failed');
  //       }
  //     }
  //   } catch (err) {
  //     setError("Network error. Is the server running?");
  //   }
  // };
  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  try {
    if (isLogin) {
      // 1. Login request
      const { data } = await apiCall('/login', 'POST', {
        email: formData.email,
        password: formData.password,
      });

      if (data.message === "Loged In Successfully") {
        const token = data.data;   // adjust path to your actual token field
        console.log("token: ",token)
        localStorage.setItem('token', token);

        // 2. After login, create account (send token in Authorization header)
        // Assuming apiCall supports custom headers; if not, you'll need to modify it.
        const accountResp = await apiCall('/account/create', 'POST');

        console.log("Account creation response:", accountResp.data);

        // Optional: check account creation success, but you can still proceed
        // if it's not critical for dashboard access.
        navigate('/dashboard');
      } else {
        setError(data.message || data.msg || 'Login failed');
      }
    } else {
      // Registration branch (unchanged from your original)
      const { data } = await apiCall('/register', 'POST', formData);
      if (data.msg === "User Registered Successfully") {
        setIsLogin(true);
        setError("Registration successful! Please login.");
      } else {
        setError(data.msg || data.message || 'Registration failed');
      }
    }
  } catch (err) {
    setError("Network error. Is the server running?");
  }
};

  return (
    <div className="d-flex flex-column vh-100" style={{ background: LIME_GRAD }}>

      {/* Top branding */}
      <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1">
        <h1 className="fw-bold text-dark mb-1" style={{ letterSpacing: '-1px' }}>Finance</h1>
        <small className="text-black-50 text-uppercase fw-semibold" style={{ letterSpacing: '0.2em', fontSize: '0.6rem' }}>Pro</small>
      </div>

      {/* White panel */}
      <div className="bg-white rounded-top-4 px-4 pt-4 pb-5">

        <h5 className="fw-bold text-dark mb-4">{isLogin ? 'Welcome back' : 'Create account'}</h5>

        {error && (
          <div className={`alert py-2 small ${error.includes('successful') ? 'alert-success' : 'alert-danger'}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary">Name</label>
              <input type="text" name="name" required onChange={handleChange} className="form-control border-0 bg-light shadow-none rounded-3" />
            </div>
          )}
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Email</label>
            <input type="email" name="email" required onChange={handleChange} className="form-control border-0 bg-light shadow-none rounded-3" />
          </div>
          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary">Password</label>
            <input type="password" name="password" required onChange={handleChange} className="form-control border-0 bg-light shadow-none rounded-3" />
          </div>

          <button type="submit" className="btn w-100 fw-bold rounded-3 py-3"
            style={{ background: '#111', color: '#c6f135' }}>
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-3 mb-0 small">
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="btn btn-link text-dark fw-semibold text-decoration-none p-0">
            {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
          </button>
        </p>

      </div>
    </div>
  );
}