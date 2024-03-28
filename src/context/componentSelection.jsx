import { createContext, useState } from "react";

export const ComponentSelection = createContext({
    current: 'home'
});

export const ComponentSelectionProvider = ({ children }) => {
    const [currentComponent, setCurrentComponent] = useState('Home');

    return (
        <ComponentSelection.Provider value={{currentComponent, setCurrentComponent}}>
            {children}
        </ComponentSelection.Provider>
    )
}
