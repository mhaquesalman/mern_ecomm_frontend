import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Layout from '../Layout';
import { showError, showLoading } from '../../utils/messages';
import { login } from '../../api/apiAuth';
import { authenticate, isAuthenticated, userInfo, 
    resetLogout, getLogout, getLogin } from '../../utils/auth';
import { API, FACEBOOK_LOGIN, GOOGLE_LOGIN } from '../../utils/config';
import "./styles/SocialLogin.css"

const Login = () => {
    const [userData, setUserData] = useState({})
    const [values, setValues] = useState({
        email: '',
        password: '',
        error: false,
        loading: false,
        disabled: false,
        redirect: false
    });

    const { email, password, loading, error, redirect, disabled } = values;


    const handleChange = e => {
        setValues({
            ...values,
            error: false,
            [e.target.name]: e.target.value
        })
    }

    const getGoogleSignInUser = () => {
        fetch(`${API}/user/googleSignin`, {
            method: "GET",
        })
        .then(res => {
            if (res.status === 200) return res.json()
            throw new Error("Authentication failed!")
        })
        .then(data => {
            // console.log("google data ", data)
            setUserData(data)
        })
        .catch(err => {
            console.log("google err ", err.message)
        })
    }

    const getFacebookSignInUser = () => {
        fetch(`${API}/user/facebookSignin`, {
            method: "GET",
        })
        .then(res => {
            if (res.status === 200) return res.json()
            throw new Error("Authentication failed!")
        })
        .then(data => {
            // console.log("facebook data ", data)
            setUserData(data)
        })
        .catch(err => {
            console.log("facebook err ", err.message)
        })
    }


    useEffect(() => {

        if (getLogout() === "") {
            if (getLogin() === "GOOGLE") getGoogleSignInUser()
            if (getLogin() === "FACEBOOK") getFacebookSignInUser()
        }
        
    }, [])

    useEffect(() => {
        if (JSON.stringify(userData) === '{}') {
            return
        } else {
            // console.log("user ", userData)
            authenticate(userData.token, () => {
                setValues({
                    ...values,
                    redirect: true
                })
            })
        }
    }, [userData])

    const handleSubmit = e => {
        e.preventDefault();
        setValues({ ...values, error: false, loading: true, disabled: true });

        login({ email, password })
            .then(response => {
                authenticate(response.data.token, () => {
                    setValues({
                        email: '',
                        password: '',
                        success: true,
                        disabled: false,
                        loading: false,
                        redirect: true
                    })
                })
            })
            .catch(err => {
                let errMsg = 'Something went wrong!';
                if (err.response) {
                    errMsg = err.response.data;
                } else {
                    errMsg = 'Something went wrong!';
                }
                setValues({ ...values, error: errMsg, disabled: false, loading: false })
            })
    }

    const handleGoogleSignin = () => {
        window.open(GOOGLE_LOGIN, "_self")
        resetLogout("GOOGLE")
/*         fetch(GOOGLE_LOGIN, {
                mode: 'no-cors',
                method: 'GET',
                credentials: 'include'
            
            })
            .then(res => res.json())
            .then(data => console.log("google login ", data))
            .catch(err => console.log("google err ", err.message)) */
    }

    const handleFacebookSignin = () => {
        window.open(FACEBOOK_LOGIN, "_self")
        resetLogout("FACEBOOK")
    }

    const signInForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="text-muted">Email:</label>
                <input name='email' type="email" className="form-control"
                    value={email} required onChange={handleChange} />
            </div>
            <div className="form-group">
                <label className="text-muted">Password:</label>
                <input name="password" type="password" onChange={handleChange} className="form-control"
                    value={password} required />
            </div>
            <button type="submit" className="btn btn-outline-primary" disabled={disabled}>Login</button>
        </form>
    );

    const redirectUser = () => {
        if (redirect) return <Redirect to={`${userInfo().role}/dashboard`} />
        if (isAuthenticated()) return <Redirect to="/" />
    }
    return (
        <Layout title="Login" className="container col-md-8 offset-md-2">
            {redirectUser()}
            {showLoading(loading)}
            {showError(error, error)}
            <h3>Login Here,</h3>
            <hr />
            {signInForm()}
            <hr />
            <div className='container row'>
                           
                    <div className='google-btn' onClick={handleGoogleSignin}>
                        <div className='google-icon-wrapper'>
                             <img className='google-icon'
                             src='https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' alt='google'/>
                        </div>
                        <p className='btn-text'><b>Sign in with Google</b></p>
                    </div>
                                   
                <div style={{marginRight: "10px"}}></div>
                
                    <div className='facebook-btn' onClick={handleFacebookSignin}>
                        <div className='google-icon-wrapper'>
                             <img className='google-icon'
                             src='https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg' alt='facebook'/>
                        </div>
                        <p className='btn-text'><b>Sign in with Facebook</b></p>
                    </div>
                
            </div>
        </Layout>
    );
}

export default Login;
