// import { createContext, useContext, useState, useEffect } from 'react';

// const BusinessContext = createContext();

// export const BusinessProvider = ({ children }) => {
//     // Hardcoded Business ID as requested
//     const [businessId] = useState('da81a423-2230-4586-b47b-07268479cb24');
    
//     // Global state for shared data (like categories) so we don't fetch them on every page
//     const [globalCategories, setGlobalCategories] = useState([]);
    
//     // Simple way to trigger re-fetches across components
//     const [refreshTrigger, setRefreshTrigger] = useState(0);

//     const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

//     return (
//         <BusinessContext.Provider value={{ 
//             businessId, 
//             globalCategories, 
//             setGlobalCategories,
//             refreshTrigger,
//             triggerRefresh
//         }}>
//             {children}
//         </BusinessContext.Provider>
//     );
// };

// export const useBusiness = () => useContext(BusinessContext);



// import { createContext, useContext, useState, useEffect } from 'react';
// import { apiGet } from '../services/api';

// const BusinessContext = createContext();

// export const BusinessProvider = ({ children }) => {
//     const [businessId, setBusinessId] = useState(null);
//     const [globalCategories, setGlobalCategories] = useState([]);
//     const [refreshTrigger, setRefreshTrigger] = useState(0);

//     const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

//     const fetchBusiness = async () => {
//         try {
//             const response = await apiGet('/open/business/info');

//             if (response.data?.success && response.data?.data?.id) {
//                 setBusinessId(response.data.data.id);
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     useEffect(() => {
//         fetchBusiness();
//     }, []);

//     return (
//         <BusinessContext.Provider value={{ 
//             businessId,
//             globalCategories,
//             setGlobalCategories,
//             refreshTrigger,
//             triggerRefresh
//         }}>
//             {children}
//         </BusinessContext.Provider>
//     );
// };

// export const useBusiness = () => useContext(BusinessContext);


import { createContext, useContext, useState, useEffect } from 'react';
import { apiGet } from '../services/api';

const BusinessContext = createContext();

export const BusinessProvider = ({ children }) => {
    const [businessId, setBusinessId] = useState(null);
    const [globalCategories, setGlobalCategories] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

    const fetchBusiness = async () => {
        try {
            const response = await apiGet('/open/business/info');

            if (response.data?.success && response.data?.data?.id) {
                const id = response.data.data.id;

                setBusinessId(id);
                localStorage.setItem('businessId', id);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const storedBusinessId = localStorage.getItem('businessId');

        if (storedBusinessId) {
            setBusinessId(storedBusinessId);
        } else {
            fetchBusiness();
        }
    }, []);

    return (
        <BusinessContext.Provider value={{ 
            businessId,
            globalCategories,
            setGlobalCategories,
            refreshTrigger,
            triggerRefresh
        }}>
            {children}
        </BusinessContext.Provider>
    );
};

export const useBusiness = () => useContext(BusinessContext);