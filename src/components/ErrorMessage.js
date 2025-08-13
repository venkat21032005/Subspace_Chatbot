import React from 'react';

const ErrorMessage = ({ 
  error, 
  title = 'Error', 
  onRetry = null,
  showDetails = false 
}) => {
  const getErrorMessage = (error) => {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error?.message) {
      return error.message;
    }
    
    if (error?.graphQLErrors?.length > 0) {
      return error.graphQLErrors[0].message;
    }
    
    if (error?.networkError) {
      return 'Network error. Please check your connection.';
    }
    
    return 'An unexpected error occurred.';
  };

  const errorMessage = getErrorMessage(error);

  return (
    <div style={{
      backgroundColor: '#fdf2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      padding: '1rem',
      margin: '1rem 0'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem'
      }}>
        <div style={{
          color: '#e74c3c',
          fontSize: '1.25rem',
          lineHeight: 1
        }}>
          ⚠️
        </div>
        
        <div style={{ flex: 1 }}>
          <h4 style={{
            color: '#e74c3c',
            margin: '0 0 0.5rem 0',
            fontSize: '1rem',
            fontWeight: '600'
          }}>
            {title}
          </h4>
          
          <p style={{
            color: '#991b1b',
            margin: '0 0 1rem 0',
            fontSize: '0.875rem',
            lineHeight: 1.4
          }}>
            {errorMessage}
          </p>
          
          {onRetry && (
            <button
              onClick={onRetry}
              style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
                marginRight: '0.5rem'
              }}
            >
              Try Again
            </button>
          )}
          
          {showDetails && error && process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '1rem' }}>
              <summary style={{ 
                cursor: 'pointer', 
                fontSize: '0.875rem',
                color: '#666'
              }}>
                Technical Details
              </summary>
              <pre style={{
                backgroundColor: '#f8f9fa',
                padding: '0.75rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                overflow: 'auto',
                marginTop: '0.5rem',
                color: '#333'
              }}>
                {JSON.stringify(error, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;