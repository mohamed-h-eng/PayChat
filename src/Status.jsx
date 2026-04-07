import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const LIME = '#c6f135';
const LIME_GRAD = 'linear-gradient(148deg, #c6f135 0%, #e2f55c 55%, #d4ef3a 100%)';

export default function Status() {
  const location = useLocation();
  const navigate = useNavigate();
  const stateData = location.state;
  
  if (!stateData) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: '#f8f9fa' }}>
        <div className="text-center">
          <p className="text-secondary mb-4">No transaction data found</p>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="btn btn-outline-dark rounded-pill px-4 py-2"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { result, amount } = stateData;
  const isSuccess = result?.message === "Transfer is Successful";
  const errorMessage = result?.msg || result?.message || "An unknown error occurred.";

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ background: '#f8f9fa' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              
              {/* Gradient Accent Bar */}
              <div style={{ height: '4px', background: LIME_GRAD }} />
              
              <div className="card-body p-4 p-sm-5 text-center">
                
                {/* Status Icon with Clean Design */}
                <div className={`d-flex align-items-center justify-content-center mx-auto mb-4 rounded-circle ${isSuccess ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'}`} 
                     style={{ width: '88px', height: '88px', transition: 'all 0.3s ease' }}>
                  {isSuccess ? (
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-danger">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  )}
                </div>
                
                {/* Title */}
                <h3 className={`fw-semibold mb-2 ${isSuccess ? 'text-dark' : 'text-danger'}`}>
                  {isSuccess ? 'Transfer Successful' : 'Transfer Failed'}
                </h3>
                
                {/* Success Message */}
                {isSuccess && (
                  <>
                    <div className="mb-3">
                      <span className="display-6 fw-bold text-dark">${parseFloat(amount).toLocaleString()}</span>
                      <p className="text-secondary small mt-2 mb-0">successfully sent</p>
                    </div>
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <div className="rounded-circle" style={{ width: 4, height: 4, background: '#dee2e6' }} />
                      <small className="text-secondary">Transaction ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</small>
                    </div>
                  </>
                )}
                
                {/* Error Message */}
                {!isSuccess && (
                  <div className="mt-3">
                    <p className="text-secondary small mb-2">Error Details</p>
                    <div className="bg-light rounded-3 p-3">
                      <p className="text-danger fw-medium mb-0" style={{ fontSize: '0.9rem' }}>
                        {errorMessage}
                      </p>
                    </div>
                    {result?.data && typeof result.data === 'string' && (
                      <p className="text-secondary small mt-2 mb-0">
                        {result.data}
                      </p>
                    )}
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="mt-4 pt-3">
                  <button 
                    onClick={() => navigate('/dashboard')} 
                    className="btn w-100 fw-semibold rounded-3 py-3 mb-2"
                    style={{ 
                      background: '#111', 
                      color: LIME,
                      transition: 'all 0.2s ease',
                      border: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Back to Dashboard
                  </button>
                  
                  {!isSuccess && (
                    <button 
                      onClick={() => navigate('/transfer')} 
                      className="btn w-100 fw-semibold rounded-3 py-3"
                      style={{ 
                        background: 'transparent', 
                        color: '#111',
                        border: '1px solid #e9ecef',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f8f9fa';
                        e.currentTarget.style.borderColor = '#dee2e6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = '#e9ecef';
                      }}
                    >
                      Try Again
                    </button>
                  )}
                </div>
                
                {/* Subtle Footer */}
                <div className="mt-4 pt-2">
                  <small className="text-secondary" style={{ fontSize: '0.7rem' }}>
                    {isSuccess ? 'Receipt sent to your email' : 'Need help? Contact support'}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}