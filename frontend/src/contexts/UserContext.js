import { createContext, useContext, useEffect, useState, useMemo } from "react";

const DEFAULT_USER = {user_id:""};

const UserContext = createContext({
    user:DEFAULT_USER,
    setUser:() => {},
    logout: () => {},
});

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const storedUser = sessionStorage.getItem("user")
            return storedUser ? JSON.parse(storedUser) : DEFAULT_USER;
        } catch {
            return DEFAULT_USER
        }
    });
    
    useEffect(() => {
        sessionStorage.setItem("user", JSON.stringify(user))
    }, [user])

    const logout = () => {
        setUser(DEFAULT_USER)
        sessionStorage.removeItem("user")
    }

    const value = useMemo(() => ({user, setUser, logout}), [user])

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if(!context) {
        throw new Error("useUser must be used within UserProvider.");
    }
    return context
}
