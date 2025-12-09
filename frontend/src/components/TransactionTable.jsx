import React from "react";
import "../styles/TransactionTable.css";

const TransactionTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="no-results">
        <p>No transactions found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="transaction-table-container">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer Name</th>
            <th>Phone</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Region</th>
            <th>Product</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price/Unit</th>
            <th>Discount %</th>
            <th>Final Amount</th>
            <th>Payment</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((transaction, index) => (
            <tr key={index}>
              <td>{new Date(transaction.date).toLocaleDateString()}</td>
              <td>{transaction.customerName}</td>
              <td>{transaction.phoneNumber}</td>
              <td>{transaction.gender}</td>
              <td>{transaction.age}</td>
              <td>{transaction.customerRegion}</td>
              <td>{transaction.productName}</td>
              <td>{transaction.productCategory}</td>
              <td>{transaction.quantity}</td>
              <td>${transaction.pricePerUnit}</td>
              <td>{transaction.discountPercentage}%</td>
              <td>${transaction.finalAmount}</td>
              <td>{transaction.paymentMethod}</td>
              <td>
                <span
                  className={`status ${transaction.orderStatus?.toLowerCase()}`}
                >
                  {transaction.orderStatus}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
