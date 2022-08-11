import { BehaviorSubject } from 'rxjs'
import getConfig from "next/config";
import Router from "next/router";

import { fetchWrapper } from '../helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;
const user = typeof window !== 'undefined' && localStorage.getItem('user')
console.log(`user: ${user}`)
const userSubject = new BehaviorSubject(user && '');

const login = (email: string, password: string) => {
    return fetchWrapper.post(`${baseUrl}/login`, { email, password })
        .then(user => {
            // publish user to subscribers and store in local storage to stay logged in between page refreshes
            userSubject.next(user);
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

const logout = () => {
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('user');
    userSubject.next(null);
    Router.push('/signin');
}

const getAll = () => {
    return fetchWrapper.get(baseUrl);
}

export const userService = {
    user: userSubject.asObservable(),
    get userValue() {
        console.log(`userSubject: ${userSubject.value}`)
        return userSubject.value
    },
    login,
    logout,
    getAll
};