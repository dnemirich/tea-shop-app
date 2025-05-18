import React from 'react';

export const NotFound: React.FC = () => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f9f9f9',
    fontFamily: 'sans-serif',
    textAlign: 'center',
    color: '#333',
  };

  const headingStyle: React.CSSProperties = {
    fontSize: '96px',
    fontWeight: 'bold',
    color: '#6b7280',
    margin: 0,
  };

  const messageStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 500,
    marginTop: '16px',
  };

  const subtextStyle: React.CSSProperties = {
    fontSize: '16px',
    marginTop: '8px',
    color: '#666',
  };

  const buttonStyle: React.CSSProperties = {
    marginTop: '24px',
    padding: '12px 24px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
  };

  const goHome = () => {
    window.location.href = '/';
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>404</h1>
      <div style={messageStyle}>Sorry, we could not find this page.</div>
      <div style={subtextStyle}>
        But do not worry, you can find plenty of other things on our homepage.
      </div>
      <button style={buttonStyle} onClick={goHome}>
        Back to homepage
      </button>
    </div>
  );
};
