

const STORAGE_KEY = "simpleExpenseTrackerData";


const defaultData = {

    balance: 4335,

    income: 4970,

    expenses: 635,

    transactions: [

        {
            title: "Grocery Shopping",
            category: "Food",
            date: "2026-08-22",
            amount: 85,
            type: "expense"
        },

        {
            title: "Monthly Salary",
            category: "Salary",
            date: "2026-08-20",
            amount: 4200,
            type: "income"
        },

        {
            title: "Bus Pass",
            category: "Transport",
            date: "2026-08-18",
            amount: 42,
            type: "expense"
        },

        {
            title: "Electricity Bill",
            category: "Bills",
            date: "2026-08-15",
            amount: 120,
            type: "expense"
        },

        {
            title: "Freelance Work",
            category: "Other",
            date: "2026-08-10",
            amount: 770,
            type: "income"
        }

    ],

    dark: false

};


/* =========================================
   GET APPLICATION STATE
========================================= */

function getState() {

    const savedData =
        localStorage.getItem(STORAGE_KEY);


    if (savedData) {

        return JSON.parse(savedData);

    }


    return structuredClone(defaultData);
}


/* =========================================
   SAVE APPLICATION STATE
========================================= */

function saveState(state) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
    );

}


/* =========================================
   FORMAT MONEY
========================================= */

function money(number) {

    return "$" +
        Number(number).toLocaleString(
            undefined,
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


/* =========================================
   TOAST MESSAGE
========================================= */

function showToast(message) {

    const toast =
        document.getElementById("toast");


    if (!toast) {
        return;
    }


    toast.textContent = message;


    toast.classList.add("show");


    setTimeout(function () {

        toast.classList.remove("show");

    }, 2200);

}


/* =========================================
   DARK MODE
========================================= */

function applyTheme() {

    const state = getState();


    document.body.classList.toggle(
        "dark",
        state.dark
    );


    const toggle =
        document.getElementById("themeToggle");


    if (toggle) {

        toggle.setAttribute(
            "aria-pressed",
            String(state.dark)
        );

    }

}


/* =========================================
   DARK MODE BUTTON
========================================= */

function setupTheme() {

    const toggle =
        document.getElementById("themeToggle");


    if (!toggle) {
        return;
    }


    toggle.addEventListener(
        "click",
        function () {

            const state = getState();


            state.dark = !state.dark;


            saveState(state);


            applyTheme();

        }
    );

}


/* =========================================
   ADD TRANSACTION BUTTON
========================================= */

function setupAddButton() {

    const button =
        document.getElementById(
            "addTransactionBtn"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        function () {

            window.location.href =
                "add-expense.html";

        }
    );

}


/* =========================================
   COMMON PAGE SETUP
========================================= */

function setupCommon() {

    applyTheme();

    setupTheme();

    setupAddButton();

}


document.addEventListener(
    "DOMContentLoaded",
    setupCommon
);



/* =========================================
   DASHBOARD
========================================= */

function renderDashboard() {

    const state = getState();


    /* Balance */

    document.getElementById(
        "balance"
    ).textContent =
        money(state.balance);


    /* Income */

    document.getElementById(
        "income"
    ).textContent =
        money(state.income);


    /* Expenses */

    document.getElementById(
        "expenses"
    ).textContent =
        money(state.expenses);


    /* Savings */

    const savingsRate =
        state.income
            ? Math.round(
                (
                    (state.income -
                        state.expenses)
                    /
                    state.income
                ) * 100
            )
            : 0;


    document.getElementById(
        "savings"
    ).textContent =
        savingsRate + "%";


    /* =====================================
       RECENT TRANSACTIONS
    ===================================== */

    const recent =
        document.getElementById("recent");


    if (!recent) {
        return;
    }


    recent.innerHTML = "";


    state.transactions
        .slice(0, 5)
        .forEach(function (transaction) {


            const row =
                document.createElement("div");


            row.style.cssText = `
                display:flex;
                justify-content:space-between;
                gap:10px;
                padding:12px 0;
                border-bottom:1px solid var(--border);
            `;


            const left =
                document.createElement("div");


            const title =
                document.createElement("strong");


            title.textContent =
                transaction.title;


            const details =
                document.createElement("div");


            details.style.cssText =
                "font-size:12px;color:var(--muted)";


            details.textContent =
                transaction.category +
                " · " +
                transaction.date;


            left.appendChild(title);

            left.appendChild(details);


            const amount =
                document.createElement("strong");


            amount.className =
                "amount " +
                transaction.type;


            amount.textContent =
                transaction.type === "income"
                    ? "+" + money(transaction.amount)
                    : "-" + money(transaction.amount);


            row.appendChild(left);

            row.appendChild(amount);


            recent.appendChild(row);

        });


    /* =====================================
       MONTHLY CHART
    ===================================== */

    const chart =
        document.getElementById("chart");


    if (!chart) {
        return;
    }


    chart.innerHTML = "";


    const months = [
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug"
    ];


    const incomeValues = [
        58,
        64,
        61,
        68,
        63,
        72
    ];


    const expenseValues = [
        34,
        38,
        32,
        40,
        37,
        27
    ];


    const maxValue = 80;


    months.forEach(
        function (month, index) {


            const wrapper =
                document.createElement("div");


            wrapper.className =
                "bar-wrap";


            wrapper.style.position =
                "relative";


            const incomeBar =
                document.createElement("div");


            incomeBar.style.width =
                "48%";


            incomeBar.style.height =
                (
                    incomeValues[index]
                    /
                    maxValue
                    *
                    100
                ) + "%";


            incomeBar.style.display =
                "flex";


            incomeBar.style.alignItems =
                "end";


            const incomeInner =
                document.createElement("div");


            incomeInner.className =
                "bar";


            incomeInner.style.width =
                "100%";


            incomeInner.style.background =
                "#60a5fa";


            incomeBar.appendChild(
                incomeInner
            );


            const expenseBar =
                document.createElement("div");


            expenseBar.style.width =
                "48%";


            expenseBar.style.height =
                (
                    expenseValues[index]
                    /
                    maxValue
                    *
                    100
                ) + "%";


            expenseBar.style.display =
                "flex";


            expenseBar.style.alignItems =
                "end";


            const expenseInner =
                document.createElement("div");


            expenseInner.className =
                "bar expense";


            expenseInner.style.width =
                "100%";


            expenseBar.appendChild(
                expenseInner
            );


            wrapper.appendChild(
                incomeBar
            );


            wrapper.appendChild(
                expenseBar
            );


            const monthLabel =
                document.createElement("div");


            monthLabel.className =
                "month";


            monthLabel.textContent =
                month;


            monthLabel.style.position =
                "absolute";


            monthLabel.style.bottom =
                "-22px";


            monthLabel.style.width =
                "100%";


            wrapper.appendChild(
                monthLabel
            );


            chart.appendChild(
                wrapper
            );

        }
    );

}


/* =========================================
   TRANSACTION PAGE
========================================= */

function renderTransactions() {

    const state = getState();


    const tableBody =
        document.getElementById(
            "transactionRows"
        );


    const empty =
        document.getElementById("empty");


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    empty.hidden =
        state.transactions.length > 0;


    state.transactions.forEach(
        function (transaction, index) {


            const row =
                document.createElement("tr");


            /* TITLE */

            const titleCell =
                document.createElement("td");


            const title =
                document.createElement("strong");


            title.textContent =
                transaction.title;


            titleCell.appendChild(title);


            /* CATEGORY */

            const categoryCell =
                document.createElement("td");


            const badge =
                document.createElement("span");


            badge.className = "badge";


            badge.textContent =
                transaction.category;


            categoryCell.appendChild(
                badge
            );


            /* DATE */

            const dateCell =
                document.createElement("td");


            dateCell.textContent =
                transaction.date;


            /* TYPE */

            const typeCell =
                document.createElement("td");


            typeCell.textContent =
                transaction.type;


            /* AMOUNT */

            const amountCell =
                document.createElement("td");


            amountCell.className =
                "amount " +
                transaction.type;


            amountCell.textContent =
                transaction.type === "income"
                    ? "+" + money(transaction.amount)
                    : "-" + money(transaction.amount);


            /* DELETE */

            const actionCell =
                document.createElement("td");


            const deleteButton =
                document.createElement("button");


            deleteButton.className =
                "secondary delete-btn";


            deleteButton.style.padding =
                "7px 10px";


            deleteButton.textContent =
                "Delete";


            deleteButton.dataset.index =
                index;


            actionCell.appendChild(
                deleteButton
            );


            row.appendChild(titleCell);

            row.appendChild(categoryCell);

            row.appendChild(dateCell);

            row.appendChild(typeCell);

            row.appendChild(amountCell);

            row.appendChild(actionCell);


            tableBody.appendChild(row);

        }
    );


    /* DELETE EVENTS */

    document
        .querySelectorAll(".delete-btn")
        .forEach(
            function (button) {


                button.addEventListener(
                    "click",
                    function () {


                        const state =
                            getState();


                        const index =
                            Number(
                                button.dataset.index
                            );


                        state.transactions.splice(
                            index,
                            1
                        );


                        recalculate(
                            state
                        );


                        saveState(
                            state
                        );


                        renderTransactions();


                        showToast(
                            "Transaction deleted"
                        );

                    }
                );

            }
        );

}


/* =========================================
   RECALCULATE TOTALS
========================================= */

function recalculate(state) {

    state.income =
        state.transactions
            .filter(
                function (transaction) {

                    return transaction.type ===
                        "income";

                }
            )
            .reduce(
                function (total, transaction) {

                    return total +
                        Number(transaction.amount);

                },
                0
            );


    state.expenses =
        state.transactions
            .filter(
                function (transaction) {

                    return transaction.type ===
                        "expense";

                }
            )
            .reduce(
                function (total, transaction) {

                    return total +
                        Number(transaction.amount);

                },
                0
            );


    state.balance =
        state.income -
        state.expenses;

}


/* =========================================
   ADD TRANSACTION FORM
========================================= */

function setupTransactionForm() {

    const form =
        document.getElementById(
            "transactionForm"
        );


    if (!form) {
        return;
    }


    const dateInput =
        document.getElementById("date");


    dateInput.value =
        new Date()
            .toISOString()
            .slice(0, 10);


    form.addEventListener(
        "submit",
        function (event) {


            event.preventDefault();


            const state =
                getState();


            const title =
                document
                    .getElementById("title")
                    .value
                    .trim();


            const amount =
                Number(
                    document
                        .getElementById("amount")
                        .value
                );


            const type =
                document
                    .getElementById("type")
                    .value;


            const category =
                document
                    .getElementById("category")
                    .value;


            const date =
                dateInput.value;


            /* CREATE NEW TRANSACTION */

            const newTransaction = {

                title: title,

                amount: amount,

                type: type,

                category: category,

                date: date

            };


            /* ADD TO ARRAY */

            state.transactions.unshift(
                newTransaction
            );


            /* UPDATE TOTALS */

            recalculate(state);


            /* SAVE */

            saveState(state);


            /* GO TO TRANSACTIONS */

            window.location.href =
                "transactions.html";

        }
    );

}


/* =========================================
   CATEGORIES PAGE
========================================= */

function renderCategories() {

    const grid =
        document.getElementById(
            "categoryGrid"
        );


    if (!grid) {
        return;
    }


    const state =
        getState();


    grid.innerHTML = "";


    const categories = [
        "Food",
        "Shopping",
        "Transport",
        "Bills",
        "Salary",
        "Other"
    ];


    const icons = [
        "🍔",
        "🛍️",
        "🚌",
        "💡",
        "💼",
        "📦"
    ];


    categories.forEach(
        function (category, index) {


            const total =
                state.transactions
                    .filter(
                        function (transaction) {

                            return (
                                transaction.category ===
                                category
                            ) &&
                            transaction.type ===
                            "expense";

                        }
                    )
                    .reduce(
                        function (
                            sum,
                            transaction
                        ) {

                            return sum +
                                Number(
                                    transaction.amount
                                );

                        },
                        0
                    );


            const percentage =
                state.expenses
                    ? Math.min(
                        100,
                        Math.round(
                            total /
                            state.expenses *
                            100
                        )
                    )
                    : 0;


            const card =
                document.createElement("div");


            card.className =
                "card category";


            const icon =
                document.createElement("div");


            icon.className =
                "category-icon";


            icon.textContent =
                icons[index];


            const content =
                document.createElement("div");


            content.style.flex = "1";


            const title =
                document.createElement("strong");


            title.textContent =
                category;


            const spent =
                document.createElement("div");


            spent.style.color =
                "var(--muted)";


            spent.style.marginTop =
                "4px";


            spent.textContent =
                money(total) +
                " spent";


            const progress =
                document.createElement("div");


            progress.className =
                "progress";


            const progressBar =
                document.createElement("i");


            progressBar.style.width =
                percentage + "%";


            progress.appendChild(
                progressBar
            );


            content.appendChild(title);

            content.appendChild(spent);

            content.appendChild(progress);


            card.appendChild(icon);

            card.appendChild(content);


            grid.appendChild(card);

        }
    );

}


/* =========================================
   SETTINGS PAGE
========================================= */

function setupSettings() {

    const toggle =
        document.getElementById(
            "settingsTheme"
        );


    if (toggle) {

        toggle.addEventListener(
            "click",
            function () {


                const state =
                    getState();


                state.dark =
                    !state.dark;


                saveState(state);


                applyTheme();


                toggle.setAttribute(
                    "aria-pressed",
                    String(state.dark)
                );

            }
        );

    }


    const reset =
        document.getElementById(
            "resetData"
        );


    if (reset) {

        reset.addEventListener(
            "click",
            function () {


                saveState(
                    structuredClone(
                        defaultData
                    )
                );


                applyTheme();


                showToast(
                    "Demo data restored"
                );


                setTimeout(
                    function () {

                        location.reload();

                    },
                    500
                );

            }
        );

    }

}


/* =========================================
   PAGE DETECTION
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* Dashboard */

        if (
            document.getElementById(
                "balance"
            )
        ) {

            renderDashboard();

        }


        /* Transactions */

        if (
            document.getElementById(
                "transactionRows"
            )
        ) {

            renderTransactions();

        }


        /* Add Transaction */

        if (
            document.getElementById(
                "transactionForm"
            )
        ) {

            setupTransactionForm();

        }


        /* Categories */

        if (
            document.getElementById(
                "categoryGrid"
            )
        ) {

            renderCategories();

        }


        /* Settings */

        if (
            document.getElementById(
                "resetData"
            )
        ) {

            setupSettings();

        }

    }
);
/* =========================================
   MONTHLY INCOME & EXPENSE CHART
========================================= */

function drawMonthlyChart() {

    const canvas = document.getElementById("monthlyChart");

    if (!canvas) {
        return;
    }

    const wrapper = canvas.parentElement;

    const width = wrapper.clientWidth;
    const height = wrapper.clientHeight;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    const ctx = canvas.getContext("2d");

    ctx.scale(dpr, dpr);

    /* -----------------------------
       CHART SETTINGS
    ----------------------------- */

    const padding = {
        top: 20,
        right: 25,
        bottom: 40,
        left: 55
    };

    const chartWidth =
        width - padding.left - padding.right;

    const chartHeight =
        height - padding.top - padding.bottom;


    /* -----------------------------
       MONTHS
    ----------------------------- */

    const months = [
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug"
    ];


    /* -----------------------------
       SAMPLE DATA
    ----------------------------- */

    const income = [
        3800,
        4200,
        4000,
        4500,
        4300,
        4200
    ];

    const expenses = [
        2200,
        2500,
        2300,
        2800,
        2600,
        2900
    ];


    /* -----------------------------
       MAX VALUE
    ----------------------------- */

    const maxValue = 5000;


    /* -----------------------------
       BACKGROUND
    ----------------------------- */

    ctx.clearRect(0, 0, width, height);

    ctx.font = "12px Arial";
    ctx.lineWidth = 1;


    /* -----------------------------
       Y-AXIS VALUES
    ----------------------------- */

    const yValues = [
        5000,
        4000,
        3000,
        2000,
        1000,
        0
    ];


    yValues.forEach(function(value) {

        const y =
            padding.top +
            chartHeight -
            (value / maxValue) * chartHeight;


        /* Grid line */

        ctx.beginPath();

        ctx.moveTo(
            padding.left,
            y
        );

        ctx.lineTo(
            width - padding.right,
            y
        );

        ctx.strokeStyle = "#e8edf5";
        ctx.stroke();


        /* Y-axis text */

        ctx.fillStyle = "#94a3b8";

        ctx.textAlign = "right";

        ctx.textBaseline = "middle";

        ctx.fillText(
            "$" + value.toLocaleString(),
            padding.left - 10,
            y
        );

    });


    /* -----------------------------
       X-AXIS
    ----------------------------- */

    ctx.beginPath();

    ctx.moveTo(
        padding.left,
        padding.top + chartHeight
    );

    ctx.lineTo(
        width - padding.right,
        padding.top + chartHeight
    );

    ctx.strokeStyle = "#cbd5e1";

    ctx.stroke();


    /* -----------------------------
       MONTH POSITIONS
    ----------------------------- */

    const points = months.map(function(month, index) {

        const x =
            padding.left +
            (index * chartWidth) /
            (months.length - 1);

        return x;

    });


    /* -----------------------------
       X-AXIS MONTH LABELS
    ----------------------------- */

    months.forEach(function(month, index) {

        const x = points[index];

        const y =
            padding.top +
            chartHeight +
            25;

        ctx.fillStyle = "#94a3b8";

        ctx.textAlign = "center";

        ctx.textBaseline = "middle";

        ctx.fillText(
            month,
            x,
            y
        );

    });


    /* -----------------------------
       FUNCTION TO GET Y POSITION
    ----------------------------- */

    function getY(value) {

        return (
            padding.top +
            chartHeight -
            (value / maxValue) *
            chartHeight
        );

    }


    /* -----------------------------
       DRAW LINE FUNCTION
    ----------------------------- */

    function drawLine(data, lineColor) {

        ctx.beginPath();

        data.forEach(function(value, index) {

            const x = points[index];

            const y = getY(value);

            if (index === 0) {

                ctx.moveTo(x, y);

            } else {

                ctx.lineTo(x, y);

            }

        });

        ctx.strokeStyle = lineColor;

        ctx.lineWidth = 3;

        ctx.lineJoin = "round";

        ctx.lineCap = "round";

        ctx.stroke();


        /* Draw points */

        data.forEach(function(value, index) {

            const x = points[index];

            const y = getY(value);

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                4,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = "#ffffff";

            ctx.fill();

            ctx.strokeStyle = lineColor;

            ctx.lineWidth = 2;

            ctx.stroke();

        });

    }


    /* -----------------------------
       DRAW INCOME LINE
    ----------------------------- */

    drawLine(
        income,
        "#4b9fe8"
    );


    /* -----------------------------
       DRAW EXPENSE LINE
    ----------------------------- */

    drawLine(
        expenses,
        "#e69aaa"
    );

}


/* Draw chart when page loads */

window.addEventListener(
    "load",
    drawMonthlyChart
);


/* Redraw chart when browser resizes */

window.addEventListener(
    "resize",
    drawMonthlyChart
);