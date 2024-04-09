import { useState, useEffect, createContext, useContext } from "react";
import { useJwt } from "react-jwt";
import { AuthContext } from "../context/AuthContext";

export const DataContext = createContext();

export default function DataContextProvider(props) {
    const [tranData, setTranData] = useState([]);
    const [budgetData, setBudgetData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [timePeriod, setTimePeriod] = useState("");
    const [categoriesObj, setCategoriesObj] = useState({});
    const { token } = useContext(AuthContext);
    const { decodedToken } = useJwt(token);
    const timeperiod = "all";

// FETCH ALL TRANSACTIONS FOR A USER W/IN SPECIFIC PERIOD

    useEffect( () => {
        const getData = async function () {
            try {
                const res = await fetch(
                    `http://localhost:8080/transaction/?timeperiod=all`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();
                Array.isArray(data) ? setTranData(data) : console.log(data);
            } catch (error) {
                console.log(error);
            }
        }

        if (token) {
            getData();
        }

    }, [token, timeperiod, refresh])

// FETCH ALL BUDGET PLAN FOR A USER

    useEffect(() => {
        const getBudget = async () => {
            try {
                const res = await fetch(`http://localhost:8080/user/${decodedToken._id}`);
                const data = await res.json();
                console.log("###budget data", data);

                Array.isArray(data) ? setBudgetData(data) : console.log(data);
            } catch (error) {
                console.log(error);
            }
        }

        if (decodedToken){
            getBudget();
        };
    }, [decodedToken, refresh]);

// REFACTOR DATA INTO CATEGORIES

    useEffect(() => {
        if (tranData.length > 0) {
            const refactorData = function () {
                const debitTrans = tranData.filter((trans) => trans.tran_sign === "DR");
                
                const groupedObjects = debitTrans.reduce((result, obj) => {
                    const { category_name, tran_amount } = obj;

                    if (!result[category_name]) {
                        
                        result[category_name] = {
                            name: category_name,
                            spent: 0,
                            limit: 0,
                            transactions: 0,
                        }
                    };

                    result[category_name].spent += Number(tran_amount);
                    result[category_name].transactions += 1;
                    
                    return result;
                }, {});

                budgetData?.map((budget) => {

                    if (groupedObjects[budget.category_name]) {
                        groupedObjects[budget.category_name].limit = 
                        Number(budget.limit_amount)
                        console.log("##categoryobject: ", groupedObjects[budget.category_name]);
                    }
                });

                const filteredArray = Object.values(groupedObjects);

                setCategoriesObj(groupedObjects);
                setCategories(filteredArray.sort((a, b) => b.spent - a.spent));
            };

            if (token) {
                refactorData();
            }
        }
    }, [tranData, budgetData]);

    console.log("transaction data:", tranData);
    console.log("Budget data: ", budgetData)

    return (
        <DataContext.Provider
            value={{
                tranData,
                setTranData,
                budgetData,
                setBudgetData,
                categories,
                setCategories,
                categoriesObj,
                decodedToken,
                refresh,
                setRefresh,
            }}
        >
            {props.children}
        </DataContext.Provider>
    );
}