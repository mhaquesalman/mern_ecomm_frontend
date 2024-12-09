const PurchaseItem = ({ purchase }) => {
    return (
    <div className="card mb-2" style={{textAlign: "left", padding: "8px", background: "lightgrey"}}>
        <p>Products: {purchase.productNames}</p>
        <p>Amount: {purchase.purchaseAmount} TK</p>
        <p>No. of Product: {purchase.purchaseCount}</p>
        { purchase.validatePayment ? (<p>Payment: Paid</p>) : (<p>Payment: Unpaid</p>) }
        { purchase.status === "Complete" ? <p>Status: {purchase.status}</p> : "" }
    </div>
    )
}

export default PurchaseItem;