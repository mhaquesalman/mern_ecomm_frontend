import { useEffect, useState } from 'react';
import Layout from '../Layout';
import { Link } from 'react-router-dom';
import { userInfo } from '../../utils/auth';
import { getPurchase, updateProductQuantityAndSold } from '../../api/apiOrder';
import PurchaseItem from '../PurchaseItem';

const Dashboard = () => {
    const { name, email, role, token } = userInfo();
    const [purchase, setPurchase] = useState([])
    // console.log("token ", token)


    useEffect(() => {
        getPurchase(token)
            .then(response => {
                const data = response.data
                setPurchase(data.reverse())
            })
            .catch(err => console.log("err ", err))
    }, [])

    useEffect(() => {
        if (purchase.length > 0) {
            purchase.forEach(element => {
                if (element.status !== "Complete") {
                    const tranId = element.transaction_id
                    const purchaseProducts = element.items
                    let toBeUpdateProducts = []
                    purchaseProducts.forEach(pp => {
                        toBeUpdateProducts.push({ id: pp.product, count: pp.count})
                    })
                    const bodyData = {
                        tid: tranId,
                        pids: toBeUpdateProducts
                    }
                    // console.log("bodyData ", bodyData) 
                    updateProductQuantityAndSold(token, bodyData)
                        .then(res => console.log(res.data))
                }
            })
        }
    }, [purchase])

    const UserLinks = () => {
        return (
            <div className="card">
                <h4 className="card-header">User Links</h4>
                <ul className="list-group">
                    <li className="list-group-item">
                        <Link className="nav-link" to="#">My Cart</Link>
                    </li>
                    <li className="list-group-item">
                        <Link className="nav-link" to="#">Update Profile</Link>
                    </li>
                    <li className="list-group-item">
                        <Link className="nav-link" to="/check/coupon">Check Coupons</Link>
                    </li>
                </ul>
            </div>
        )
    };

    const PurchaseHistory = () => (
        <div>
            <div className="card mb-3">
                <h3 className="card-header">Purchase History</h3>
            </div>
            {purchase.length > 0 ? purchase.map(p => (<PurchaseItem key={p._id} purchase={p} />)) 
            : <div>No Purchase found</div>}
        </div>
    );

    const UserInfo = () => (
        <div className="card mb-5">
            <h3 className="card-header">User Information</h3>
            <ul className="list-group">
                <li className="list-group-item">{name}</li>
                <li className="list-group-item">{email}</li>
                <li className="list-group-item">{role}</li>
            </ul>
        </div>
    );

    return (
        <Layout title="Dashboard" className="container-fluid">
            <div className="row">
                <div className="col-sm-3">
                    <UserLinks />
                </div>
                <div className="col-sm-9">
                    <UserInfo />
                    <PurchaseHistory />
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard;