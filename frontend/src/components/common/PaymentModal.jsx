import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentsIcon from '@mui/icons-material/Payments';
import LockIcon from '@mui/icons-material/Lock';
import CircularProgress from '@mui/material/CircularProgress';

const PaymentModal = ({ course, onClose, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [processing, setProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: '',
  });
  const [upiId, setUpiId] = useState('');

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4);
    }

    setCardDetails((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const validateForm = () => {
    if (paymentMethod === 'credit_card') {
      const cardNum = cardDetails.cardNumber.replace(/\s/g, '');
      if (cardNum.length < 16) {
        return 'Please enter a valid card number';
      }
      if (cardDetails.expiryDate.length < 5) {
        return 'Please enter a valid expiry date';
      }
      if (cardDetails.cvv.length < 3) {
        return 'Please enter a valid CVV';
      }
      if (!cardDetails.cardHolder.trim()) {
        return 'Please enter cardholder name';
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId.includes('@')) {
        return 'Please enter a valid UPI ID';
      }
    }
    return null;
  };

  const handlePayment = async () => {
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate transaction ID
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    onPaymentSuccess({
      paymentMethod: paymentMethod === 'credit_card' ? 'Credit Card' : paymentMethod === 'upi' ? 'UPI' : 'Net Banking',
      transactionId,
      amount: course.C_price,
    });
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <div className="payment-modal-header">
          <h5 className="mb-0">Complete Payment</h5>
          <button className="btn btn-link text-dark p-0" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="payment-modal-body">
          {/* Order Summary */}
          <div className="order-summary mb-4">
            <h6 className="text-muted mb-2">Order Summary</h6>
            <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
              <div>
                <p className="mb-0 fw-semibold">{course.C_title}</p>
                <small className="text-muted">By {course.C_educator}</small>
              </div>
              <h5 className="mb-0 text-primary">${course.C_price}</h5>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="payment-methods mb-4">
            <h6 className="text-muted mb-3">Select Payment Method</h6>
            <div className="row g-2">
              <div className="col-4">
                <div
                  className={`payment-method-card ${paymentMethod === 'credit_card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('credit_card')}
                >
                  <CreditCardIcon />
                  <span>Card</span>
                </div>
              </div>
              <div className="col-4">
                <div
                  className={`payment-method-card ${paymentMethod === 'upi' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <PaymentsIcon />
                  <span>UPI</span>
                </div>
              </div>
              <div className="col-4">
                <div
                  className={`payment-method-card ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('netbanking')}
                >
                  <AccountBalanceIcon />
                  <span>Net Banking</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="payment-form">
            {paymentMethod === 'credit_card' && (
              <div className="card-form">
                <div className="mb-3">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="1234 5678 9012 3456"
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleCardChange}
                    maxLength="19"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Cardholder Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="John Doe"
                    name="cardHolder"
                    value={cardDetails.cardHolder}
                    onChange={handleCardChange}
                  />
                </div>
                <div className="row g-3">
                  <div className="col-6">
                    <label className="form-label">Expiry Date</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="MM/YY"
                      name="expiryDate"
                      value={cardDetails.expiryDate}
                      onChange={handleCardChange}
                      maxLength="5"
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label">CVV</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="•••"
                      name="cvv"
                      value={cardDetails.cvv}
                      onChange={handleCardChange}
                      maxLength="4"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="upi-form">
                <div className="mb-3">
                  <label className="form-label">UPI ID</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </div>
                <div className="d-flex gap-2 flex-wrap">
                  {['@paytm', '@gpay', '@phonepe', '@ybl'].map((suffix) => (
                    <button
                      key={suffix}
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setUpiId((prev) => prev.split('@')[0] + suffix)}
                    >
                      {suffix}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="netbanking-form">
                <div className="mb-3">
                  <label className="form-label">Select Bank</label>
                  <select className="form-select">
                    <option value="">Choose your bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                    <option value="kotak">Kotak Mahindra Bank</option>
                    <option value="pnb">Punjab National Bank</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Security Note */}
          <div className="security-note d-flex align-items-center gap-2 mt-4 p-2 bg-light rounded">
            <LockIcon fontSize="small" className="text-success" />
            <small className="text-muted">
              Your payment information is secure and encrypted
            </small>
          </div>
        </div>

        <div className="payment-modal-footer">
          <button className="btn btn-outline-secondary" onClick={onClose} disabled={processing}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handlePayment}
            disabled={processing}
          >
            {processing ? (
              <>
                <CircularProgress size={16} color="inherit" className="me-2" />
                Processing...
              </>
            ) : (
              `Pay $${course.C_price}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
