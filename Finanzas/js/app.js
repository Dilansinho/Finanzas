/* =========================================================
   FINANZAS v2.0
   APP.JS
   PARTE 1/12
   CONFIGURACIÓN - CLASES - ALMACENAMIENTO
========================================================= */



"use strict";



/* ===========================
   CONFIGURACIÓN GLOBAL
=========================== */


const APP_CONFIG = {


    name: "Finanzas",


    version: "2.0",


    currency: "COP",


    locale: "es-CO",


    storagePrefix: "finanzas_v2_",


};





/* ===========================
   STORAGE KEYS
=========================== */


const STORAGE_KEYS = {


    movements:

    APP_CONFIG.storagePrefix + "movements",



    accounts:

    APP_CONFIG.storagePrefix + "accounts",



    categories:

    APP_CONFIG.storagePrefix + "categories",



    budgets:

    APP_CONFIG.storagePrefix + "budgets",



    goals:

    APP_CONFIG.storagePrefix + "goals",



    settings:

    APP_CONFIG.storagePrefix + "settings",



};





/* ===========================
   ESTADO GLOBAL
=========================== */


const state = {


    movements: [],


    accounts: [],


    categories: [],


    budgets: [],


    goals: [],


    settings:{



        theme:"dark",


        currency:"COP",


        firstLaunch:true



    },


    currentSection:

    "dashboard",



    currentMovementType:

    "expense",



    selectedAccount:null,


    selectedCategory:null,


};





/* ===========================
   DATA DEFAULT
=========================== */


const DEFAULT_DATA = {



    categories:[


        {


            id:"food",


            name:"Comida",


            icon:"fa-utensils",


            color:"#22c55e"



        },


        {


            id:"transport",


            name:"Transporte",


            icon:"fa-car",


            color:"#3b82f6"



        },


        {


            id:"home",


            name:"Hogar",


            icon:"fa-house",


            color:"#f59e0b"



        },


        {


            id:"health",


            name:"Salud",


            icon:"fa-heart",


            color:"#ef4444"



        },


        {


            id:"other",


            name:"Otros",


            icon:"fa-circle",


            color:"#8b5cf6"



        }



    ],




    accounts:[


        {


            id:"cash",


            name:"Efectivo",


            type:"cash",


            balance:0



        },


        {


            id:"bank",


            name:"Bancolombia",


            type:"bank",


            balance:0



        },


        {


            id:"nequi",


            name:"Nequi",


            type:"digital",


            balance:0



        },


        {


            id:"daviplata",


            name:"Daviplata",


            type:"digital",


            balance:0



        }



    ]



};





/* ===========================
   LOCAL STORAGE HELPERS
=========================== */


function saveData(key,value){


    try{


        localStorage.setItem(

            key,

            JSON.stringify(value)

        );


    }


    catch(error){


        console.error(

            "Error guardando datos:",

            error

        );


    }


}





function loadData(key,defaultValue=[]){


    try{


        const data =

        localStorage.getItem(key);



        return data

        ?

        JSON.parse(data)

        :

        defaultValue;



    }


    catch(error){


        console.error(

            "Error cargando datos:",

            error

        );


        return defaultValue;


    }


}





/* ===========================
   INITIAL DATA LOAD
=========================== */


function loadApplicationData(){



    state.movements =

    loadData(

        STORAGE_KEYS.movements,

        []

    );



    state.accounts =

    loadData(

        STORAGE_KEYS.accounts,

        DEFAULT_DATA.accounts

    );



    state.categories =

    loadData(

        STORAGE_KEYS.categories,

        DEFAULT_DATA.categories

    );



    state.budgets =

    loadData(

        STORAGE_KEYS.budgets,

        []

    );



    state.goals =

    loadData(

        STORAGE_KEYS.goals,

        []

    );



    state.settings =

    loadData(

        STORAGE_KEYS.settings,

        state.settings

    );



}





/* ===========================
   SAVE ALL DATA
=========================== */


function saveAllData(){



    saveData(

        STORAGE_KEYS.movements,

        state.movements

    );



    saveData(

        STORAGE_KEYS.accounts,

        state.accounts

    );



    saveData(

        STORAGE_KEYS.categories,

        state.categories

    );



    saveData(

        STORAGE_KEYS.budgets,

        state.budgets

    );



    saveData(

        STORAGE_KEYS.goals,

        state.goals

    );



    saveData(

        STORAGE_KEYS.settings,

        state.settings

    );



}





/* ===========================
   UTILIDADES GENERALES
=========================== */


function generateID(prefix="id"){



    return (

        prefix +

        "_" +

        Date.now() +

        "_" +

        Math.floor(

            Math.random()*1000

        )

    );


}





function formatCurrency(value){



    return new Intl.NumberFormat(

        APP_CONFIG.locale,

        {

            style:"currency",

            currency:APP_CONFIG.currency,

            maximumFractionDigits:0

        }

    ).format(value);



}
/* =========================================================
   FINANZAS v2.0
   APP.JS
   PARTE 2/12
   DASHBOARD
========================================================= */



/* ===========================
   DASHBOARD CALCULATIONS
=========================== */


function calculateTotalBalance(){


    return state.accounts.reduce(

        (total, account) =>

        total + Number(account.balance || 0),

        0

    );


}





function calculateTotalIncome(){


    return state.movements

        .filter(

            movement =>

            movement.type === "income"

        )

        .reduce(

            (total,movement)=>

            total + Number(movement.amount),

            0

        );


}





function calculateTotalExpenses(){


    return state.movements

        .filter(

            movement =>

            movement.type === "expense"

        )

        .reduce(

            (total,movement)=>

            total + Number(movement.amount),

            0

        );


}





function calculateMonthlySummary(){



    const currentDate = new Date();



    const currentMonth =

    currentDate.getMonth();



    const currentYear =

    currentDate.getFullYear();




    const monthlyMovements =

    state.movements.filter(

        movement => {


            const date =

            new Date(movement.date);



            return (

                date.getMonth() === currentMonth &&

                date.getFullYear() === currentYear

            );


        }

    );




    return {


        income:

        monthlyMovements

        .filter(

            item =>

            item.type === "income"

        )

        .reduce(

            (sum,item)=>

            sum + Number(item.amount),

            0

        ),



        expenses:

        monthlyMovements

        .filter(

            item =>

            item.type === "expense"

        )

        .reduce(

            (sum,item)=>

            sum + Number(item.amount),

            0

        )



    };


}





/* ===========================
   DASHBOARD ELEMENT UPDATE
=========================== */


function updateDashboard(){



    const balance =

    calculateTotalBalance();



    const income =

    calculateTotalIncome();



    const expenses =

    calculateTotalExpenses();



    const monthly =

    calculateMonthlySummary();





    const balanceElement =

    document.getElementById(

        "totalBalance"

    );



    const incomeElement =

    document.getElementById(

        "totalIncome"

    );



    const expenseElement =

    document.getElementById(

        "totalExpenses"

    );



    const monthlyIncomeElement =

    document.getElementById(

        "monthlyIncome"

    );



    const monthlyExpenseElement =

    document.getElementById(

        "monthlyExpenses"

    );





    if(balanceElement)

        balanceElement.textContent =

        formatCurrency(balance);





    if(incomeElement)

        incomeElement.textContent =

        formatCurrency(income);





    if(expenseElement)

        expenseElement.textContent =

        formatCurrency(expenses);





    if(monthlyIncomeElement)

        monthlyIncomeElement.textContent =

        formatCurrency(monthly.income);





    if(monthlyExpenseElement)

        monthlyExpenseElement.textContent =

        formatCurrency(monthly.expenses);



}





/* ===========================
   DASHBOARD SUMMARY OBJECT
=========================== */


function getDashboardSummary(){


    return {


        balance:

        calculateTotalBalance(),



        income:

        calculateTotalIncome(),



        expenses:

        calculateTotalExpenses(),



        monthly:

        calculateMonthlySummary()



    };


}





/* ===========================
   BALANCE STATUS
=========================== */


function getBalanceStatus(){



    const balance =

    calculateTotalBalance();



    if(balance > 0)

        return "positive";



    if(balance < 0)

        return "negative";



    return "neutral";


}
/* =========================================================
   FINANZAS v2.0
   APP.JS
   PARTE 3/12
   CRUD DE MOVIMIENTOS
========================================================= */



/* ===========================
   CREATE MOVEMENT
=========================== */


function createMovement(data){


    const movement = {


        id:

        generateID("movement"),



        type:

        data.type || "expense",



        amount:

        Number(data.amount || 0),



        accountId:

        data.accountId || null,



        categoryId:

        data.categoryId || null,



        description:

        data.description || "",



        date:

        data.date ||

        new Date().toISOString(),



        time:

        data.time || "",



        notes:

        data.notes || "",



        tags:

        data.tags || [],



        receipt:

        data.receipt || null



    };




    state.movements.push(movement);



    updateAccountBalance(

        movement.accountId,

        movement.amount,

        movement.type

    );



    saveAllData();



    return movement;


}





/* ===========================
   READ MOVEMENTS
=========================== */


function getMovements(){


    return state.movements;


}





function getRecentMovements(limit=5){



    return [

        ...state.movements

    ]

    .sort(

        (a,b)=>

        new Date(b.date)

        -

        new Date(a.date)

    )

    .slice(0,limit);



}





function getMovementById(id){



    return state.movements.find(

        movement =>

        movement.id === id

    );


}





/* ===========================
   UPDATE MOVEMENT
=========================== */


function updateMovement(id,newData){



    const index =

    state.movements.findIndex(

        movement =>

        movement.id === id

    );



    if(index === -1)

        return false;




    const oldMovement =

    state.movements[index];





    reverseAccountBalance(

        oldMovement

    );




    const updatedMovement = {


        ...oldMovement,


        ...newData,


        amount:

        Number(

            newData.amount ??

            oldMovement.amount

        )


    };



    state.movements[index] =

    updatedMovement;




    updateAccountBalance(

        updatedMovement.accountId,

        updatedMovement.amount,

        updatedMovement.type

    );




    saveAllData();



    return true;


}





/* ===========================
   DELETE MOVEMENT
=========================== */


function deleteMovement(id){



    const index =

    state.movements.findIndex(

        movement =>

        movement.id === id

    );



    if(index === -1)

        return false;




    const movement =

    state.movements[index];




    reverseAccountBalance(

        movement

    );




    state.movements.splice(

        index,

        1

    );



    saveAllData();



    return true;


}





/* ===========================
   ACCOUNT BALANCE CONTROL
=========================== */


function updateAccountBalance(

    accountId,

    amount,

    type

){



    const account =

    state.accounts.find(

        item =>

        item.id === accountId

    );



    if(!account)

        return;




    if(type === "income"){


        account.balance += amount;


    }


    else{


        account.balance -= amount;


    }


}





function reverseAccountBalance(

    movement

){



    const account =

    state.accounts.find(

        item =>

        item.id === movement.accountId

    );



    if(!account)

        return;




    if(movement.type === "income"){


        account.balance -=

        movement.amount;


    }


    else{


        account.balance +=

        movement.amount;


    }


}





/* ===========================
   FILTER MOVEMENTS
=========================== */


function filterMovements(filters={}){



    return state.movements.filter(

        movement => {



            if(

                filters.type &&

                movement.type !== filters.type

            )

                return false;




            if(

                filters.categoryId &&

                movement.categoryId !== filters.categoryId

            )

                return false;




            if(

                filters.accountId &&

                movement.accountId !== filters.accountId

            )

                return false;




            if(filters.search){



                const text =

                (

                    movement.description +

                    " " +

                    movement.notes

                )

                .toLowerCase();



                if(

                    !text.includes(

                        filters.search.toLowerCase()

                    )

                )

                    return false;


            }




            return true;


        }

    );


}





/* ===========================
   MOVEMENT HELPERS
=========================== */


function getMovementCount(){


    return state.movements.length;


}





function clearMovements(){



    state.movements = [];



    saveAllData();


}
/* =========================================================
   FINANZAS v2.0
   APP.JS
   PARTE 4/12
   CATEGORÍAS
========================================================= */



/* ===========================
   CREATE CATEGORY
=========================== */


function createCategory(data){


    const category = {


        id:

        generateID("category"),



        name:

        data.name || "Nueva categoría",



        icon:

        data.icon || "fa-tag",



        color:

        data.color || "#8b5cf6"



    };




    state.categories.push(category);



    saveAllData();



    return category;


}





/* ===========================
   READ CATEGORIES
=========================== */


function getCategories(){



    return state.categories;


}





function getCategoryById(id){



    return state.categories.find(

        category =>

        category.id === id

    );


}





/* ===========================
   UPDATE CATEGORY
=========================== */


function updateCategory(id,newData){



    const category =

    getCategoryById(id);



    if(!category)

        return false;




    Object.assign(

        category,

        newData

    );



    saveAllData();



    return true;


}





/* ===========================
   DELETE CATEGORY
=========================== */


function deleteCategory(id){



    const index =

    state.categories.findIndex(

        category =>

        category.id === id

    );



    if(index === -1)

        return false;




    state.categories.splice(

        index,

        1

    );



    saveAllData();



    return true;


}





/* ===========================
   CATEGORY USAGE
=========================== */


function getCategoryMovements(categoryId){



    return state.movements.filter(

        movement =>

        movement.categoryId === categoryId

    );


}





function getCategoryExpenseTotal(categoryId){



    return getCategoryMovements(

        categoryId

    )

    .filter(

        movement =>

        movement.type === "expense"

    )

    .reduce(

        (total,movement)=>

        total + movement.amount,

        0

    );


}





/* ===========================
   CATEGORY SELECTOR RENDER
=========================== */


function renderCategorySelector(

    containerId

){



    const container =

    document.getElementById(

        containerId

    );



    if(!container)

        return;




    container.innerHTML = "";




    state.categories.forEach(

        category => {



            const button =

            document.createElement(

                "button"

            );



            button.className =

            "category-option";




            button.dataset.id =

            category.id;




            button.innerHTML = `

                <i class="fa-solid ${category.icon}"></i>

                ${category.name}

            `;



            button.addEventListener(

                "click",

                ()=>{


                    selectCategory(

                        category.id

                    );


                }

            );



            container.appendChild(

                button

            );


        }

    );


}





/* ===========================
   SELECT CATEGORY
=========================== */


function selectCategory(id){



    state.selectedCategory = id;



    document

    .querySelectorAll(

        ".category-option"

    )

    .forEach(

        button => {



            button.classList.toggle(

                "active",

                button.dataset.id === id

            );


        }

    );


}





/* ===========================
   CATEGORY STATISTICS
=========================== */


function getCategorySummary(){



    return state.categories.map(

        category => ({



            id:

            category.id,



            name:

            category.name,



            total:

            getCategoryExpenseTotal(

                category.id

            ),



            icon:

            category.icon,



            color:

            category.color



        })

    );


}





/* ===========================
   DEFAULT CATEGORY RESTORE
=========================== */


function restoreDefaultCategories(){



    state.categories =

    DEFAULT_DATA.categories;



    saveAllData();



}
/* =========================================================
   FINANZAS v2.0
   APP.JS
   PARTE 5/12
   CUENTAS
========================================================= */



/* ===========================
   CREATE ACCOUNT
=========================== */


function createAccount(data){


    const account = {


        id:

        generateID("account"),



        name:

        data.name || "Nueva cuenta",



        type:

        data.type || "other",



        balance:

        Number(data.balance || 0),



        icon:

        data.icon || "fa-wallet"



    };




    state.accounts.push(account);



    saveAllData();



    return account;


}





/* ===========================
   READ ACCOUNTS
=========================== */


function getAccounts(){



    return state.accounts;


}





function getAccountById(id){



    return state.accounts.find(

        account =>

        account.id === id

    );


}





/* ===========================
   UPDATE ACCOUNT
=========================== */


function updateAccount(id,newData){



    const account =

    getAccountById(id);



    if(!account)

        return false;




    Object.assign(

        account,

        newData

    );



    if(newData.balance !== undefined){


        account.balance =

        Number(newData.balance);


    }




    saveAllData();



    return true;


}





/* ===========================
   DELETE ACCOUNT
=========================== */


function deleteAccount(id){



    const index =

    state.accounts.findIndex(

        account =>

        account.id === id

    );



    if(index === -1)

        return false;




    state.accounts.splice(

        index,

        1

    );



    saveAllData();



    return true;


}





/* ===========================
   ACCOUNT BALANCE
=========================== */


function getAccountBalance(id){



    const account =

    getAccountById(id);



    if(!account)

        return 0;



    return account.balance;


}





function getTotalAccountsBalance(){



    return state.accounts.reduce(

        (total,account)=>

        total +

        Number(account.balance || 0),

        0

    );


}





/* ===========================
   ACCOUNT MOVEMENTS
=========================== */


function getAccountMovements(accountId){



    return state.movements.filter(

        movement =>

        movement.accountId === accountId

    );


}





function calculateAccountFlow(accountId){



    const movements =

    getAccountMovements(

        accountId

    );



    return {


        income:

        movements

        .filter(

            item =>

            item.type === "income"

        )

        .reduce(

            (sum,item)=>

            sum + item.amount,

            0

        ),




        expenses:

        movements

        .filter(

            item =>

            item.type === "expense"

        )

        .reduce(

            (sum,item)=>

            sum + item.amount,

            0

        )



    };


}





/* ===========================
   ACCOUNT SELECTOR RENDER
=========================== */


function renderAccountSelector(

    containerId

){



    const container =

    document.getElementById(

        containerId

    );



    if(!container)

        return;




    container.innerHTML = "";




    state.accounts.forEach(

        account => {



            const element =

            document.createElement(

                "button"

            );



            element.className =

            "account-option";




            element.dataset.id =

            account.id;




            element.innerHTML = `

                <i class="fa-solid ${account.icon}"></i>

                <div>

                    <strong>

                    ${account.name}

                    </strong>

                    <small>

                    ${formatCurrency(account.balance)}

                    </small>

                </div>

            `;




            element.addEventListener(

                "click",

                ()=>{


                    selectAccount(

                        account.id

                    );


                }

            );



            container.appendChild(

                element

            );


        }

    );


}





/* ===========================
   SELECT ACCOUNT
=========================== */


function selectAccount(id){



    state.selectedAccount = id;



    document

    .querySelectorAll(

        ".account-option"

    )

    .forEach(

        item => {



            item.classList.toggle(

                "active",

                item.dataset.id === id

            );


        }

    );


}





/* ===========================
   ACCOUNT SUMMARY
=========================== */


function getAccountsSummary(){



    return state.accounts.map(

        account => ({



            id:

            account.id,



            name:

            account.name,



            type:

            account.type,



            balance:

            account.balance,



            flow:

            calculateAccountFlow(

                account.id

            )



        })

    );


}
/* =========================================================
   FINANZAS v2.0
   APP.JS
   PARTE 6/12
   PRESUPUESTO POR CATEGORÍAS
========================================================= */



/* ===========================
   CREATE BUDGET
=========================== */


function createBudget(data){


    const budget = {


        id:

        generateID("budget"),



        categoryId:

        data.categoryId || null,



        limit:

        Number(data.limit || 0),



        month:

        data.month ||

        new Date().getMonth(),



        year:

        data.year ||

        new Date().getFullYear()



    };




    state.budgets.push(budget);



    saveAllData();



    return budget;


}





/* ===========================
   READ BUDGETS
=========================== */


function getBudgets(){



    return state.budgets;


}





function getBudgetByCategory(

    categoryId

){



    return state.budgets.find(

        budget =>

        budget.categoryId === categoryId

    );


}





/* ===========================
   UPDATE BUDGET
=========================== */


function updateBudget(id,newData){



    const budget =

    state.budgets.find(

        item =>

        item.id === id

    );



    if(!budget)

        return false;




    Object.assign(

        budget,

        newData

    );



    if(newData.limit !== undefined){


        budget.limit =

        Number(newData.limit);


    }



    saveAllData();



    return true;


}





/* ===========================
   DELETE BUDGET
=========================== */


function deleteBudget(id){



    const index =

    state.budgets.findIndex(

        budget =>

        budget.id === id

    );



    if(index === -1)

        return false;




    state.budgets.splice(

        index,

        1

    );



    saveAllData();



    return true;


}





/* ===========================
   CATEGORY SPENDING
=========================== */


function getCategorySpent(

    categoryId,

    month = new Date().getMonth(),

    year = new Date().getFullYear()

){



    return state.movements

    .filter(

        movement => {



            const date =

            new Date(movement.date);



            return (

                movement.categoryId === categoryId &&

                movement.type === "expense" &&

                date.getMonth() === month &&

                date.getFullYear() === year

            );


        }

    )

    .reduce(

        (total,movement)=>

        total + movement.amount,

        0

    );


}





/* ===========================
   BUDGET PROGRESS
=========================== */


function getBudgetProgress(

    budget

){



    const spent =

    getCategorySpent(

        budget.categoryId,

        budget.month,

        budget.year

    );




    const percentage =

    budget.limit > 0

    ?

    (

        spent /

        budget.limit

    )

    * 100

    :

    0;




    return {



        limit:

        budget.limit,



        spent,



        remaining:

        budget.limit - spent,



        percentage:

        Math.min(

            percentage,

            100

        ),



        exceeded:

        spent > budget.limit



    };


}





/* ===========================
   ALL BUDGET STATUS
=========================== */


function getBudgetsStatus(){



    return state.budgets.map(

        budget => {



            const category =

            getCategoryById(

                budget.categoryId

            );



            return {



                id:

                budget.id,



                categoryId:

                budget.categoryId,



                categoryName:

                category

                ?

                category.name

                :

                "Sin categoría",



                progress:

                getBudgetProgress(

                    budget

                )



            };


        }

    );


}





/* ===========================
   BUDGET ALERTS
=========================== */


function getBudgetAlerts(){



    return getBudgetsStatus()

    .filter(

        budget =>

        budget.progress.exceeded

        ||

        budget.progress.percentage >= 80

    );


}





/* ===========================
   BUDGET SUMMARY
=========================== */


function getBudgetSummary(){



    const totalLimit =

    state.budgets.reduce(

        (sum,budget)=>

        sum + budget.limit,

        0

    );



    const totalSpent =

    state.budgets.reduce(

        (sum,budget)=>

        sum +

        getCategorySpent(

            budget.categoryId,

            budget.month,

            budget.year

        ),

        0

    );



    return {



        totalLimit,



        totalSpent,



        remaining:

        totalLimit - totalSpent



    };


}
/* =========================================================
   FINANZAS v2.0
   APP.JS
   PARTE 7/12
   ESTADÍSTICAS
========================================================= */



/* ===========================
   GENERAL STATISTICS
=========================== */


function getGeneralStatistics(){



    const movements =

    state.movements;



    const expenses =

    movements.filter(

        movement =>

        movement.type === "expense"

    );



    const incomes =

    movements.filter(

        movement =>

        movement.type === "income"

    );




    const totalExpenses =

    expenses.reduce(

        (sum,item)=>

        sum + item.amount,

        0

    );



    const totalIncome =

    incomes.reduce(

        (sum,item)=>

        sum + item.amount,

        0

    );




    return {



        totalMovements:

        movements.length,



        totalExpenses,



        totalIncome,



        averageExpense:

        expenses.length

        ?

        totalExpenses /

        expenses.length

        :

        0,



        averageIncome:

        incomes.length

        ?

        totalIncome /

        incomes.length

        :

        0



    };


}





/* ===========================
   BIGGEST MOVEMENTS
=========================== */


function getLargestExpense(){



    return (

        state.movements

        .filter(

            movement =>

            movement.type === "expense"

        )

        .sort(

            (a,b)=>

            b.amount - a.amount

        )[0]

        ||

        null

    );


}





function getLargestIncome(){



    return (

        state.movements

        .filter(

            movement =>

            movement.type === "income"

        )

        .sort(

            (a,b)=>

            b.amount - a.amount

        )[0]

        ||

        null

    );


}





/* ===========================
   CATEGORY ANALYSIS
=========================== */


function getTopExpenseCategory(){



    const summary =

    getCategorySummary();



    return (

        summary

        .sort(

            (a,b)=>

            b.total - a.total

        )[0]

        ||

        null

    );


}





function getCategoryPercentage(){



    const totalExpenses =

    calculateTotalExpenses();



    return getCategorySummary()

    .map(

        category => ({



            ...category,



            percentage:

            totalExpenses > 0

            ?

            (

                category.total /

                totalExpenses

            )

            * 100

            :

            0



        })

    );


}





/* ===========================
   MONTHLY COMPARISON
=========================== */


function getMonthlyComparison(){



    const months = [];



    for(

        let i = 5;

        i >= 0;

        i--

    ){



        const date = new Date();



        date.setMonth(

            date.getMonth() - i

        );



        const month =

        date.getMonth();



        const year =

        date.getFullYear();




        const movements =

        state.movements.filter(

            movement => {



                const movementDate =

                new Date(

                    movement.date

                );



                return (

                    movementDate.getMonth()

                    ===

                    month

                    &&

                    movementDate.getFullYear()

                    ===

                    year

                );


            }

        );




        months.push({



            month:



            date.toLocaleString(

                "es-CO",

                {

                    month:"short"

                }

            ),



            income:



            movements

            .filter(

                item =>

                item.type === "income"

            )

            .reduce(

                (sum,item)=>

                sum + item.amount,

                0

            ),



            expenses:



            movements

            .filter(

                item =>

                item.type === "expense"

            )

            .reduce(

                (sum,item)=>

                sum + item.amount,

                0

            )



        });



    }



    return months;


}





/* ===========================
   FINANCIAL HEALTH
=========================== */


function calculateFinancialHealth(){



    const income =

    calculateTotalIncome();



    const expenses =

    calculateTotalExpenses();




    if(income === 0)

        return 0;




    const savingRate =

    (

        (

            income -

            expenses

        )

        /

        income

    )

    * 100;




    return Math.max(

        0,

        Math.min(

            100,

            savingRate + 50

        )

    );


}





/* ===========================
   COMPLETE STATISTICS OBJECT
=========================== */


function getStatisticsDashboard(){



    return {



        general:

        getGeneralStatistics(),



        largestExpense:

        getLargestExpense(),



        largestIncome:

        getLargestIncome(),



        topCategory:

        getTopExpenseCategory(),



        categories:

        getCategoryPercentage(),



        monthly:

        getMonthlyComparison(),



        health:

        calculateFinancialHealth()



    };


}
/* =========================================================
   FINANZAS v2.0
   APP.JS
   PARTE 8/12
   GRÁFICOS
========================================================= */



/* ===========================
   CHART STORAGE
=========================== */


const charts = {


    incomeExpense:null,


    categories:null,


    monthly:null



};





/* ===========================
   DESTROY CHART
=========================== */


function destroyChart(chart){



    if(chart){


        chart.destroy();


    }


}





/* ===========================
   CHART DEFAULT CONFIG
=========================== */


const CHART_CONFIG = {


    responsive:true,


    maintainAspectRatio:false,


    plugins:{


        legend:{


            labels:{


                color:"#ffffff"


            }


        }


    }



};





/* ===========================
   INCOME VS EXPENSE CHART
=========================== */


function createIncomeExpenseChart(){



    const canvas =

    document.getElementById(

        "incomeExpenseChart"

    );



    if(!canvas)

        return;




    destroyChart(

        charts.incomeExpense

    );




    const statistics =

    getGeneralStatistics();




    charts.incomeExpense =

    new Chart(

        canvas,

        {



            type:"doughnut",



            data:{



                labels:[

                    "Ingresos",

                    "Gastos"

                ],



                datasets:[{


                    data:[


                        statistics.totalIncome,


                        statistics.totalExpenses



                    ],



                    borderWidth:0



                }]



            },



            options:CHART_CONFIG



        }

    );



}





/* ===========================
   CATEGORY CHART
=========================== */


function createCategoryChart(){



    const canvas =

    document.getElementById(

        "categoryChart"

    );



    if(!canvas)

        return;




    destroyChart(

        charts.categories

    );




    const categories =

    getCategoryPercentage()

    .filter(

        item =>

        item.total > 0

    );





    charts.categories =

    new Chart(

        canvas,

        {



            type:"polarArea",



            data:{



                labels:

                categories.map(

                    item =>

                    item.name

                ),



                datasets:[



                    {



                        data:

                        categories.map(

                            item =>

                            item.total

                        ),



                        borderWidth:1



                    }



                ]



            },



            options:CHART_CONFIG



        }

    );



}





/* ===========================
   MONTHLY EVOLUTION CHART
=========================== */


function createMonthlyChart(){



    const canvas =

    document.getElementById(

        "monthlyChart"

    );



    if(!canvas)

        return;




    destroyChart(

        charts.monthly

    );




    const data =

    getMonthlyComparison();





    charts.monthly =

    new Chart(

        canvas,

        {



            type:"line",



            data:{



                labels:

                data.map(

                    item =>

                    item.month

                ),




                datasets:[



                    {


                        label:

                        "Ingresos",



                        data:

                        data.map(

                            item =>

                            item.income

                        ),



                        tension:.4



                    },



                    {


                        label:

                        "Gastos",



                        data:

                        data.map(

                            item =>

                            item.expenses

                        ),



                        tension:.4



                    }



                ]



            },



            options:{

                ...CHART_CONFIG,


                scales:{



                    x:{


                        ticks:{


                            color:"#aaa"


                        }


                    },



                    y:{


                        ticks:{


                            color:"#aaa"


                        }


                    }



                }



            }



        }

    );


}





/* ===========================
   UPDATE ALL CHARTS
=========================== */


function updateCharts(){



    createIncomeExpenseChart();



    createCategoryChart();



    createMonthlyChart();



}





/* ===========================
   CHART REFRESH LISTENER
=========================== */


function refreshFinancialVisuals(){



    updateDashboard();



    updateCharts();



}
/* =========================================================
   FINANZAS v2.0
   APP.JS
   PARTE 9/12
   IMPORTAR Y EXPORTAR
========================================================= */



/* ===========================
   EXPORT DATA
=========================== */


function exportData(){



    const backup = {



        app:

        APP_CONFIG.name,



        version:

        APP_CONFIG.version,



        date:

        new Date().toISOString(),



        data:{



            movements:

            state.movements,



            accounts:

            state.accounts,



            categories:

            state.categories,



            budgets:

            state.budgets,



            goals:

            state.goals,



            settings:

            state.settings



        }



    };





    const json =

    JSON.stringify(

        backup,

        null,

        4

    );





    const blob =

    new Blob(

        [

            json

        ],

        {

            type:

            "application/json"

        }

    );





    const url =

    URL.createObjectURL(

        blob

    );





    const link =

    document.createElement(

        "a"

    );



    link.href = url;



    link.download =

    "finanzas_backup.json";



    document.body.appendChild(

        link

    );



    link.click();



    document.body.removeChild(

        link

    );



    URL.revokeObjectURL(

        url

    );


}





/* ===========================
   VALIDATE IMPORT
=========================== */


function validateBackup(data){



    if(!data)

        return false;




    if(!data.data)

        return false;




    const required = [



        "movements",


        "accounts",


        "categories",


        "budgets",


        "goals",


        "settings"



    ];





    return required.every(

        key =>

        key in data.data

    );


}





/* ===========================
   IMPORT DATA
=========================== */


function importData(file){



    return new Promise(

        (resolve,reject)=>{



            const reader =

            new FileReader();




            reader.onload =

            event => {



                try{



                    const backup =

                    JSON.parse(

                        event.target.result

                    );





                    if(

                        !validateBackup(

                            backup

                        )

                    ){



                        reject(

                            "Archivo inválido"

                        );


                        return;


                    }





                    state.movements =

                    backup.data.movements;



                    state.accounts =

                    backup.data.accounts;



                    state.categories =

                    backup.data.categories;



                    state.budgets =

                    backup.data.budgets;



                    state.goals =

                    backup.data.goals;



                    state.settings =

                    backup.data.settings;





                    saveAllData();




                    resolve(true);



                }



                catch(error){



                    reject(error);



                }



            };





            reader.onerror =

            error => {



                reject(error);



            };





            reader.readAsText(

                file

            );



        }

    );


}





/* ===========================
   RESET APPLICATION
=========================== */


function resetApplication(){



    localStorage.clear();



    state.movements = [];



    state.accounts =

    [

        ...DEFAULT_DATA.accounts

    ];



    state.categories =

    [

        ...DEFAULT_DATA.categories

    ];



    state.budgets = [];



    state.goals = [];



    state.settings = {


        theme:"dark",


        currency:"COP",


        firstLaunch:true


    };



    saveAllData();



}





/* ===========================
   BACKUP INFORMATION
=========================== */


function getBackupInfo(){



    return {



        movements:

        state.movements.length,



        accounts:

        state.accounts.length,



        categories:

        state.categories.length,



        budgets:

        state.budgets.length,



        goals:

        state.goals.length



    };


}
/* =========================================================
   FINANZAS v2.0
   APP.JS
   PARTE 10/12
   NOTIFICACIONES - MODALES - VALIDACIONES
========================================================= */



/* ===========================
   TOAST SYSTEM
=========================== */


function showToast(

    message,

    type="success"

){



    const container =

    document.getElementById(

        "toastContainer"

    );



    if(!container)

        return;




    const toast =

    document.createElement(

        "div"

    );



    toast.className =

    `toast ${type}`;





    toast.innerHTML = `

        <i class="fa-solid 

        ${

        type === "success"

        ?

        "fa-circle-check"

        :

        type === "error"

        ?

        "fa-circle-xmark"

        :

        "fa-triangle-exclamation"

        }

        "></i>

        <span>${message}</span>

    `;





    container.appendChild(

        toast

    );





    setTimeout(

        ()=>{


            toast.remove();


        },

        3500

    );



}





/* ===========================
   MODAL CONTROL
=========================== */


function openModal(id){



    const modal =

    document.getElementById(

        id

    );



    if(!modal)

        return;




    modal.classList.remove(

        "hidden"

    );



}





function closeModal(id){



    const modal =

    document.getElementById(

        id

    );



    if(!modal)

        return;




    modal.classList.add(

        "hidden"

    );


}





function closeAllModals(){



    document

    .querySelectorAll(

        ".modal"

    )

    .forEach(

        modal => {



            modal.classList.add(

                "hidden"

            );


        }

    );


}





/* ===========================
   MODAL OUTSIDE CLICK
=========================== */


function setupModalEvents(){



    document

    .querySelectorAll(

        ".modal"

    )

    .forEach(

        modal => {



            modal.addEventListener(

                "click",

                event => {



                    if(

                        event.target === modal

                    ){



                        modal.classList.add(

                            "hidden"

                        );


                    }


                }

            );



        }

    );


}





/* ===========================
   VALIDATION HELPERS
=========================== */


function validateRequired(value){



    return (

        value !== undefined &&

        value !== null &&

        value.toString()

        .trim()

        .length > 0

    );


}





function validateAmount(amount){



    return (

        !isNaN(amount)

        &&

        Number(amount) > 0

    );


}





/* ===========================
   MOVEMENT VALIDATION
=========================== */


function validateMovement(data){



    const errors = [];




    if(

        !validateAmount(

            data.amount

        )

    ){


        errors.push(

            "El valor debe ser mayor a cero"

        );


    }




    if(

        !data.accountId

    ){


        errors.push(

            "Selecciona una cuenta"

        );


    }




    if(

        !data.categoryId

    ){


        errors.push(

            "Selecciona una categoría"

        );


    }




    return {


        valid:

        errors.length === 0,



        errors



    };


}





/* ===========================
   CATEGORY VALIDATION
=========================== */


function validateCategory(data){



    const errors = [];




    if(

        !validateRequired(

            data.name

        )

    ){



        errors.push(

            "Nombre requerido"

        );


    }





    return {



        valid:

        errors.length === 0,



        errors



    };


}





/* ===========================
   ACCOUNT VALIDATION
=========================== */


function validateAccount(data){



    const errors = [];




    if(

        !validateRequired(

            data.name

        )

    ){



        errors.push(

            "Nombre requerido"

        );


    }





    if(

        data.balance !== undefined

        &&

        isNaN(

            Number(

                data.balance

            )

        )

    ){



        errors.push(

            "Saldo inválido"

        );


    }




    return {



        valid:

        errors.length === 0,



        errors



    };


}





/* ===========================
   ERROR DISPLAY
=========================== */


function showValidationErrors(errors){



    errors.forEach(

        error => {



            showToast(

                error,

                "error"

            );


        }

    );


}





/* ===========================
   BUTTON EVENTS
=========================== */


function setupGlobalEvents(){



    document

    .addEventListener(

        "keydown",

        event => {



            if(

                event.key === "Escape"

            ){



                closeAllModals();


            }


        }

    );


}
/* =========================================================
   FINANZAS v2.0
   APP.JS
   PARTE 11/12
   PWA - SERVICE WORKER - OPTIMIZACIÓN
========================================================= */



/* ===========================
   PWA CONFIGURATION
=========================== */


const PWA_CONFIG = {


    serviceWorker:

    "/service-worker.js",



    enabled:

    true



};





/* ===========================
   SERVICE WORKER REGISTER
=========================== */


function registerServiceWorker(){



    if(

        !PWA_CONFIG.enabled

    )

        return;




    if(

        "serviceWorker"

        in navigator

    ){



        window.addEventListener(

            "load",

            ()=>{



                navigator.serviceWorker

                .register(

                    PWA_CONFIG.serviceWorker

                )

                .then(

                    registration => {



                        console.log(

                            "Service Worker registrado:",

                            registration.scope

                        );



                    }

                )

                .catch(

                    error => {



                        console.error(

                            "Error Service Worker:",

                            error

                        );



                    }

                );



            }

        );


    }


}





/* ===========================
   ONLINE / OFFLINE STATUS
=========================== */


function setupConnectionMonitor(){



    window.addEventListener(

        "online",

        ()=>{



            showToast(

                "Conexión restaurada",

                "success"

            );


        }

    );




    window.addEventListener(

        "offline",

        ()=>{



            showToast(

                "Modo sin conexión activado",

                "warning"

            );


        }

    );


}





/* ===========================
   INSTALL PROMPT
=========================== */


let deferredInstallPrompt = null;




function setupInstallPrompt(){



    window.addEventListener(

        "beforeinstallprompt",

        event => {



            event.preventDefault();



            deferredInstallPrompt =

            event;



            showInstallButton();



        }

    );


}





function showInstallButton(){



    const button =

    document.getElementById(

        "installApp"

    );



    if(!button)

        return;




    button.classList.remove(

        "hidden"

    );



}





async function installApplication(){



    if(!deferredInstallPrompt)

        return;




    deferredInstallPrompt.prompt();




    const result =

    await deferredInstallPrompt

    .userChoice;



    if(

        result.outcome ===

        "accepted"

    ){



        showToast(

            "Aplicación instalada",

            "success"

        );


    }



    deferredInstallPrompt = null;


}





/* ===========================
   MEMORY OPTIMIZATION
=========================== */


function clearUnusedReferences(){



    if(

        charts.incomeExpense

    ){



        charts.incomeExpense

        .resize();


    }




    if(

        charts.categories

    ){



        charts.categories

        .resize();


    }




    if(

        charts.monthly

    ){



        charts.monthly

        .resize();


    }



}





/* ===========================
   PERFORMANCE OBSERVER
=========================== */


function monitorPerformance(){



    if(

        "performance"

        in window

    ){



        const navigation =

        performance

        .getEntriesByType(

            "navigation"

        )[0];




        if(navigation){



            console.log(

                "Carga completa:",

                navigation.loadEventEnd

                -

                navigation.startTime,

                "ms"

            );


        }


    }


}





/* ===========================
   VISIBILITY OPTIMIZATION
=========================== */


function setupVisibilityOptimization(){



    document.addEventListener(

        "visibilitychange",

        ()=>{



            if(

                document.hidden

            ){



                clearUnusedReferences();


            }



        }

    );


}





/* ===========================
   INITIAL PWA SETUP
=========================== */


function initializePWA(){



    registerServiceWorker();



    setupConnectionMonitor();



    setupInstallPrompt();



    setupVisibilityOptimization();



    monitorPerformance();



}
/* =========================================================
   FINANZAS v2.0
   APP.JS
   PARTE 12/12
   INICIALIZACIÓN - PRUEBAS - ARRANQUE FINAL
========================================================= */



/* ===========================
   APPLICATION INITIALIZATION
=========================== */


function initializeApplication(){



    console.log(

        "Iniciando Finanzas v2.0..."

    );




    loadApplicationData();



    setupGlobalEvents();



    setupModalEvents();



    initializePWA();



    renderInitialInterface();



    runIntegrityTests();



    hideLoader();



    console.log(

        "Finanzas v2.0 iniciado correctamente"

    );


}





/* ===========================
   INITIAL INTERFACE
=========================== */


function renderInitialInterface(){



    updateDashboard();



    renderAccountSelector(

        "paymentSelector"

    );



    renderCategorySelector(

        "categorySelector"

    );



    updateCharts();



    renderRecentMovements();



}





/* ===========================
   RECENT MOVEMENTS
=========================== */


function renderRecentMovements(){



    const container =

    document.getElementById(

        "recentMovements"

    );



    if(!container)

        return;




    const movements =

    getRecentMovements(5);




    container.innerHTML = "";




    if(

        movements.length === 0

    ){



        container.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-wallet"></i>

                <p>

                No hay movimientos todavía

                </p>

            </div>

        `;



        return;


    }





    movements.forEach(

        movement => {



            const category =

            getCategoryById(

                movement.categoryId

            );




            const element =

            document.createElement(

                "div"

            );



            element.className =

            "movement-item";




            element.innerHTML = `

            
            <div class="movement-icon">

                <i class="fa-solid 

                ${

                category

                ?

                category.icon

                :

                "fa-money-bill"

                }

                "></i>

            </div>


            <div class="movement-info">

                <strong>

                ${

                movement.description ||

                "Movimiento"

                }

                </strong>


                <small>

                ${

                category

                ?

                category.name

                :

                "General"

                }

                </small>

            </div>


            <div class="movement-value

            ${movement.type}">

                ${

                movement.type === "income"

                ?

                "+"

                :

                "-"

                }


                ${

                formatCurrency(

                    movement.amount

                )

                }

            </div>


            `;



            container.appendChild(

                element

            );


        }

    );


}





/* ===========================
   LOADER CONTROL
=========================== */


function hideLoader(){



    const loader =

    document.getElementById(

        "loadingScreen"

    );



    if(!loader)

        return;




    loader.classList.add(

        "hidden"

    );


}





/* ===========================
   SYSTEM TESTS
=========================== */


function runIntegrityTests(){



    const tests = {



        storage:

        typeof localStorage !==

        "undefined",



        currency:

        typeof formatCurrency ===

        "function",



        movements:

        Array.isArray(

            state.movements

        ),



        accounts:

        Array.isArray(

            state.accounts

        ),



        categories:

        Array.isArray(

            state.categories

        )



    };




    const failed =

    Object.entries(

        tests

    )

    .filter(

        ([key,value]) =>

        !value

    );




    if(

        failed.length > 0

    ){



        console.error(

            "Errores encontrados:",

            failed

        );



        showToast(

            "Se detectaron errores de carga",

            "error"

        );


        return false;


    }




    return true;


}





/* ===========================
   DOM READY
=========================== */


document.addEventListener(

    "DOMContentLoaded",

    ()=>{



        initializeApplication();



    }

);
