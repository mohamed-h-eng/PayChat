import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from './api';

const LIME = '#c6f135';
const LIME_GRAD = 'linear-gradient(148deg, #c6f135 0%, #e2f55c 55%, #d4ef3a 100%)';

export default function Transfer() {
  const navigate = useNavigate();
  const [transferData, setTransferData] = useState({ receiverIban: '', amount: '', note: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const isSubmitting = useRef(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting.current) return;
    isSubmitting.current = true;
    setIsProcessing(true);
    try {
      const response = await apiCall('/transaction/send', 'POST', {
        receiver_iban: transferData.receiverIban,
        amount: Number(transferData.amount),
        note: transferData.note || ""
      });
      navigate('/status', { state: { result: response.data, amount: transferData.amount } });
    } catch (error) {
      navigate('/status', { state: { result: { msg: "Network Error" } } });
    } finally {
      isSubmitting.current = false;
      setIsProcessing(false);
    }
  };

  const handleNumClick = (num) => setTransferData(prev => ({ ...prev, amount: prev.amount + num }));
  const handleBackspace = () => setTransferData(prev => ({ ...prev, amount: prev.amount.slice(0, -1) }));

  return (
    <div className="container">
    <div class="phone">
    <div className="d-flex flex-column vh-100" style={{ background: LIME_GRAD }}>

      <div className="d-flex justify-content-between align-items-center px-3 pt-4 pb-2">
        <button onClick={() => navigate('/dashboard')} className="btn btn-dark rounded-circle p-0 d-flex align-items-center justify-content-center" style={{ width: 38, height: 38 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
        <span className="fw-semibold small text-black-50 text-uppercase ls-wide">Send Money</span>
      </div>

      <div className="d-flex flex-column align-items-center py-3">
        <div className="rounded-circle bg-black bg-opacity-10 border border-dark border-opacity-25 d-flex align-items-center justify-content-center mb-2" style={{ width: 56, height: 56 }}>
          <svg width="26" height="26" fill="rgba(0,0,0,0.45)" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        </div>
        <small className="text-uppercase text-black-50 fw-semibold" style={{ letterSpacing: '0.15em', fontSize: '0.6rem' }}>Sending to</small>
        <span className="fw-semibold text-dark small mt-1">{transferData.receiverIban || 'New Recipient'}</span>
      </div>

      <div className="d-flex gap-2 px-3 pb-3">
        <input type="text" required placeholder="Receiver IBAN" value={transferData.receiverIban}
          onChange={e => setTransferData({ ...transferData, receiverIban: e.target.value })}
          className="form-control form-control-sm bg-white bg-opacity-50 border-0 rounded-3 text-dark shadow-none" />
        <input type="text" placeholder="Note (opt)" value={transferData.note}
          onChange={e => setTransferData({ ...transferData, note: e.target.value })}
          className="form-control form-control-sm bg-white bg-opacity-50 border-0 rounded-3 text-dark shadow-none" />
      </div>

      <form onSubmit={handleSubmit} className="flex-grow-1 bg-white rounded-top-4 d-flex flex-column align-items-center px-4 pt-4 pb-3" style={{ marginTop: -12 }}>

        <div className="d-flex align-items-start mb-1">
          <span className="fs-4 fw-bold text-black-25 mt-2 me-1" style={{ color: 'rgba(0,0,0,0.2)' }}>$</span>
          <span className="fw-bold" style={{ fontSize: '4.5rem', letterSpacing: '-3px', color: transferData.amount ? '#111' : 'rgba(0,0,0,0.12)', lineHeight: 1 }}>
            {transferData.amount || '0'}
          </span>
        </div>
        <div className="mb-3" style={{ width: 40, height: 2, background: 'rgba(0,0,0,0.12)', borderRadius: 2 }} />

        <div className="d-flex align-items-center gap-2 rounded-pill px-3 py-1 mb-3" style={{ background: '#f7f7f5', border: '1px solid #ebebea' }}>
          <div className="rounded-circle" style={{ width: 6, height: 6, background: '#8bc34a' }} />
          <small className="text-secondary" style={{ fontSize: '0.68rem' }}>Balance: $12,450.00</small>
        </div>

        <div className="row w-100 text-center mb-3 flex-grow-1 align-content-center" style={{ rowGap: '4px' }}>
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <div className="col-4" key={n}>
              <button type="button" onClick={() => handleNumClick(n.toString())}
                className="btn btn-link text-dark text-decoration-none fw-normal p-2" style={{ fontSize: '1.6rem' ,fontWeight:800}}>{n}</button>
            </div>
          ))}
          <div className="col-4">
            <button type="button" onClick={() => handleNumClick('.')} className="btn btn-link text-secondary text-decoration-none p-2" style={{ fontSize: '1.8rem' }}>·</button>
          </div>
          <div className="col-4">
            <button type="button" onClick={() => handleNumClick('0')} className="btn btn-link text-dark text-decoration-none fw-normal p-2" style={{ fontSize: '1.6rem' }}>0</button>
          </div>
          <div className="col-4 d-flex justify-content-center align-items-center">
            <button type="button" onClick={handleBackspace} className="btn btn-link text-secondary text-decoration-none p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/></svg>
            </button>
          </div>
        </div>

        <button type="submit" disabled={isProcessing || !transferData.amount || !transferData.receiverIban}
          className="btn w-100 fw-bold rounded-3 py-3 d-flex align-items-center justify-content-center gap-2"
          style={{ background: '#111', color: LIME, opacity: (isProcessing || !transferData.amount || !transferData.receiverIban) ? 0.35 : 1 }}>
          {isProcessing ? 'Processing...' : <>Send Money <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></>}
        </button>

      </form>
    </div>
    </div>
    </div>
  );
}