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
              <td>{transaction["Date"]}</td>
              <td>{transaction["Customer Name"]}</td>
              <td>{transaction["Phone Number"]}</td>
              <td>{transaction["Gender"]}</td>
              <td>{transaction["Age"]}</td>
              <td>{transaction["Customer Region"]}</td>
              <td>{transaction["Product Name"]}</td>
              <td>{transaction["Product Category"]}</td>
              <td>{transaction["Quantity"]}</td>
              <td>${transaction["Price per Unit"]}</td>
              <td>{transaction["Discount Percentage"]}%</td>
              <td>${transaction["Final Amount"]}</td>
              <td>{transaction["Payment Method"]}</td>
              <td>
                <span
                  className={`status ${transaction[
                    "Order Status"
                  ]?.toLowerCase()}`}
                >
                  {transaction["Order Status"]}
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
