import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from './api';
import './style.css'

function formatRelativeDate(isoString) {
  const date = new Date(isoString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const pad = (n) => n.toString().padStart(2, '0');

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // hour '0' becomes '12'
  const timeStr = `${pad(hours)}:${pad(minutes)} ${ampm}`;
  if (isToday) {
    return `Today, ${timeStr}`;
  }
  const day = pad(date.getDate());
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear().toString().slice(-2); // last two digits

  return `${day} ${month} ${year}, ${timeStr}`;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      let accRes = await apiCall('/account/me');
      if (accRes.data.msg === "User Account Not Found") {
        accRes = await apiCall('/account/create', 'POST');
      }
      setAccount(accRes.data.data);
      const txRes = await apiCall('/transaction/view');
      if (txRes.data.data) setTransactions(txRes.data.data);
    } catch (error) {
      console.error("Dashboard fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    const amount = prompt("Enter amount to deposit:");
    if (!amount) return;
    await apiCall('/transaction/deposit', 'POST', { amount: Number(amount) });
    fetchDashboardData();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) return <div className="p-6 text-center">Loading your wallet...</div>;

  return (
  <div className="container">
<div class="phone">
    <div class="header">
      <span class="header-title">Finance</span>
      <div class="header-right">
        <button class="bell-btn">
          <svg viewBox="0 0 24 24" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </button>
        <div class="avatar">JD</div>
      </div>
    </div>

    <div class="balance-section">
      <div class="balance-label">Available Balance</div>
      <div class="balance-amount">
        <span class="balance-main">${account?.balance?.toFixed(2) || '0.00'}</span>
        <span class="balance-cents">.00</span>
      </div>
      <div>
        <span class="vs-text">{account?.iban || 'No IBAN'}</span>
      </div>
    </div>

    <div class="actions">
      <div class="action-btn">
        <div class="action-icon primary" onClick={() => navigate('/transfer')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
          </svg>
        </div>
        <span class="action-label">Send</span>
      </div>
      <div class="action-btn">
        <div class="action-icon secondary" >
          {/* <svg viewBox="0 0 24 24" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 21V9"/></svg> */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="17" y1="7" x2="7" y2="17"></line>
            <polyline points="17 17 7 17 7 7"></polyline>
          </svg>
        </div>
        <span class="action-label">Request</span>
      </div>
      <div class="action-btn">
        <div class="action-icon secondary" onClick={handleDeposit}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </div>
        <span class="action-label">Top Up</span>
      </div>
    </div>

    <div class="divider"></div>

    <div class="history-section">
      <div class="history-header">
        <span class="history-title">History</span>
        <button class="search-btn">
          <svg viewBox="0 0 24 24" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
      </div>
  <div class="scroll-area">
      
      {transactions.length === 0 && <p className="text-sm text-gray-500 px-3">No transactions yet.</p>}
      {/* <div class="txn-item">
        <div class="txn-icon">☕</div>
        <div class="txn-info">
          <div class="txn-name">Coffeehouse</div>
          <div class="txn-date">Today, 08:45 AM</div>
        </div>
        <span class="txn-amount neg">-$4.50</span>
      </div> */}
        {transactions.length === 0 && <p className="text-sm text-gray-500 px-3">No transactions yet.</p>}
        {transactions.map(tx => {
          const isIncoming = tx.type === 'TRANSFER_IN' || tx.type === 'DEPOSIT';
          return (
            <div key={tx._id} className="txn-item" style={{display:'flex',flexDirection:'row'}}>
              <div class="txn-icon">☕</div>
              <div className="txn-info">
                <p class="txn-name" style={{ fontSize: '16px', fontWeight: 700 }}>
                  {tx.note && tx.note !== "na" ? tx.note.charAt(0).toUpperCase() + tx.note.slice(1) : 'NA'}
                  <span class="txn-date"> - {formatRelativeDate(tx.createdAt)}</span>
                </p>
                <span style={{ fontSize: '9px', color: '#949494' }}>
                  {isIncoming ? tx.sender_iban : tx.receiver_iban}
                </span>
              </div>
              <p class="txn-amount neg" style={{ color: isIncoming ? 'green' : 'red' }}>
                {isIncoming ? '+' : '$-'}{tx.amount}
              </p>
            </div>
          );
        })}
      {/* <div class="txn-item">
        <div class="txn-icon">🏀</div>
        <div class="txn-info">
          <div class="txn-name">Sport Store</div>
          <div class="txn-date">Yesterday, 04:20 PM</div>
        </div>
        <span class="txn-amount neg">-$89.00</span>
      </div>

      <div class="txn-item">
        <div class="txn-icon">🏦</div>
        <div class="txn-info">
          <div class="txn-name">Dividend Payout</div>
          <div class="txn-date">Oct 24, 09:12 AM</div>
        </div>
        <span class="txn-amount pos">+$1,240.50</span>
      </div>

      <div class="txn-item">
        <div class="txn-icon">🛍️</div>
        <div class="txn-info">
          <div class="txn-name">Apple Store</div>
          <div class="txn-date">Oct 22, 11:30 AM</div>
        </div>
        <span class="txn-amount neg">-$1,299.00</span>
      </div> */}
    </div>
  </div>

  <div class="bottom-nav">
    <div class="nav-item active">
      <svg viewBox="0 0 24 24" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    </div>
    <div class="nav-item">
      <svg viewBox="0 0 24 24" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
    </div>
    <div class="nav-item">
      <svg viewBox="0 0 24 24" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
    </div>
    <div class="nav-item">
      <svg viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
    </div>
  </div>
</div>
</div>
  );
}