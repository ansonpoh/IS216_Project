import { createContext, useContext, useEffect, useState, useMemo } from "react";

const DEFAULT_ORG = { org_id: "" };

const OrgContext = createContext({
    org: DEFAULT_ORG,
    setOrg: () => {},
    logout: () => {},
});

export const OrgProvider = ({ children }) => {
    const [org, setOrg] = useState(() => {
        try {
            const storedOrg = sessionStorage.getItem("org");
            return storedOrg ? JSON.parse(storedOrg) : DEFAULT_ORG;
        } catch {
            return DEFAULT_ORG;
        }
    });

    useEffect(() => {
        sessionStorage.setItem("org", JSON.stringify(org));
    }, [org]);

    const logout = () => {
        setOrg(DEFAULT_ORG);
        sessionStorage.removeItem("org");
    };

    const value = useMemo(() => ({ org, setOrg, logout }), [org]);

    return (    
        <OrgContext.Provider value={value}>
            {children}
        </OrgContext.Provider>
    );
};

export const useOrg = () => {
    const context = useContext(OrgContext);
    if (!context) {
        throw new Error("useOrg must be used within OrgProvider.");
    }
    return context;
};
