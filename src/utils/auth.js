import jwt_decode from 'jwt-decode';
import { API } from './config';

export const authenticate = (token, cb) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('jwt', JSON.stringify(token));
        localStorage.setItem('logout', 'NO');
        cb();
    }
}

export const isAuthenticated = () => {
    if (typeof window === 'undefined') return false;
    if (localStorage.getItem('logout') === null) localStorage.setItem('logout', '')
    if (localStorage.getItem('jwt')) {
        const { exp } = jwt_decode(JSON.parse(localStorage.getItem('jwt')));
        if ((new Date()).getTime() <= exp * 1000) {
            return true;
        } else {
            localStorage.removeItem('jwt');
            localStorage.removeItem('login');
            localStorage.setItem('logout', 'YES');
            return false;
        }
    } else return false;
}

export const resetLogout = (param) => {
    localStorage.setItem('logout', '')
    localStorage.setItem('login', param)
}

export const getLogout = () => localStorage.getItem('logout')

export const getLogin = () => localStorage.getItem('login')

export const userInfo = () => {
    const jwt = JSON.parse(localStorage.getItem('jwt'));
    const decoded = jwt_decode(jwt);
    return { ...decoded, token: jwt }
}

export const singout = async (cb) => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt');
        localStorage.removeItem('login');
        localStorage.setItem('logout','YES')
        cb();
    }
}
