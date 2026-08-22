document.addEventListener("DOMContentLoaded", () => {

    const authContainer = document.getElementById("authContainer");
    const loginBox = document.getElementById("loginBox");
    const registerBox = document.getElementById("registerBox");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const showRegister = document.getElementById("showRegister");
    const showLogin = document.getElementById("showLogin");
    const dashboard = document.getElementById("dashboard");

    const logoutBtn = document.getElementById("logoutBtn");
    const settingsLogout = document.getElementById("settingsLogout");

    const userName = document.getElementById("userName");
    const topUserName = document.getElementById("topUserName");
    const userEmail = document.getElementById("userEmail");

    const navItems = document.querySelectorAll(".nav-item");
    const sections = document.querySelectorAll(".section");
    const goButtons = document.querySelectorAll("[data-go]");

    const projectGrid = document.querySelector(".projects-grid");
    const projectSearch = document.getElementById("projectSearch");
    const filterButtons = document.querySelectorAll(".filter");

    const projectModal = document.getElementById("projectModal");
    const closeModal = document.getElementById("closeModal");
    const createButtons = document.querySelectorAll(".create-btn");
    const createProjectButton =
        document.querySelector(".create-project-final");

    const notificationButton =
        document.querySelector(".icon-button");

    /* ================================
       STORAGE
    ================================= */

    const USERS_KEY = "misbahUsers";
    const CURRENT_USER_KEY = "misbahCurrentUser";
    const PROJECTS_KEY = "misbahProjects";
    const EARNINGS_KEY = "misbahEarnings";


    function getUsers() {
        try {
            return JSON.parse(
                localStorage.getItem(USERS_KEY)
            ) || [];
        } catch {
            return [];
        }
    }


    function saveUsers(users) {
        localStorage.setItem(
            USERS_KEY,
            JSON.stringify(users)
        );
    }


    function getCurrentUser() {
        try {
            return JSON.parse(
                localStorage.getItem(CURRENT_USER_KEY)
            );
        } catch {
            return null;
        }
    }


    function getProjects() {
        try {
            return JSON.parse(
                localStorage.getItem(PROJECTS_KEY)
            ) || [];
        } catch {
            return [];
        }
    }


    function saveProjects(projects) {
        localStorage.setItem(
            PROJECTS_KEY,
            JSON.stringify(projects)
        );
    }


    function getEarnings() {
        try {
            return Number(
                localStorage.getItem(EARNINGS_KEY)
            ) || 0;
        } catch {
            return 0;
        }
    }


    function saveEarnings(amount) {
        localStorage.setItem(
            EARNINGS_KEY,
            String(amount)
        );
    }


    /* ================================
       ESCAPE HTML
    ================================= */

    function escapeHTML(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* ================================
       USER DISPLAY
    ================================= */

    function updateUserUI() {

        const user = getCurrentUser();

        if (!user) return;

        if (userName)
            userName.textContent = user.name;

        if (topUserName)
            topUserName.textContent = user.name;

        if (userEmail)
            userEmail.textContent = user.email;

        const profileName =
            document.getElementById("profileName");

        if (profileName)
            profileName.textContent = user.name;

        const profileEmail =
            document.getElementById("profileEmail");

        if (profileEmail)
            profileEmail.textContent = user.email;

        const welcomeElements =
            document.querySelectorAll(".welcome-name");

        welcomeElements.forEach(element => {
            element.textContent = user.name;
        });
    }


    /* ================================
       AUTH PAGES
    ================================= */

    function showLoginPage() {

        if (authContainer)
            authContainer.style.display = "flex";

        if (dashboard)
            dashboard.style.display = "none";

        if (loginBox)
            loginBox.style.display = "block";

        if (registerBox)
            registerBox.style.display = "none";
    }


    function showDashboard(message = "") {

        if (authContainer)
            authContainer.style.display = "none";

        if (dashboard)
            dashboard.style.display = "block";

        updateUserUI();
        renderProjects();
        updateDashboard();

        if (message) {
            showToast(message);
        }
    }


    /* ================================
       REGISTER
    ================================= */

    if (showRegister) {

        showRegister.addEventListener("click", e => {

            e.preventDefault();

            loginBox.style.display = "none";
            registerBox.style.display = "block";

        });
    }


    if (showLogin) {

        showLogin.addEventListener("click", e => {

            e.preventDefault();

            registerBox.style.display = "none";
            loginBox.style.display = "block";

        });
    }


    if (registerForm) {

        registerForm.addEventListener("submit", e => {

            e.preventDefault();

            const name =
                document.getElementById("name")
                    ?.value.trim();

            const email =
                document.getElementById("email")
                    ?.value.trim()
                    .toLowerCase();

            const password =
                document.getElementById("password")
                    ?.value;

            const confirmPassword =
                document.getElementById("confirmPassword")
                    ?.value;


            if (!name || name.length < 2) {
                alert("Please enter your name.");
                return;
            }


            if (!email || !email.includes("@")) {
                alert("Please enter a valid email.");
                return;
            }


            if (!password || password.length < 6) {
                alert(
                    "Password must be at least 6 characters."
                );
                return;
            }


            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }


            const users = getUsers();


            if (
                users.some(
                    user => user.email === email
                )
            ) {
                alert(
                    "This account already exists."
                );
                return;
            }


            const newUser = {
                id: Date.now(),
                name,
                email,
                password
            };


            users.push(newUser);
            saveUsers(users);


            localStorage.setItem(
                CURRENT_USER_KEY,
                JSON.stringify({
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email
                })
            );


            registerForm.reset();

            showDashboard(
                `Welcome, ${name}!`
            );

        });
    }


    /* ================================
       LOGIN
    ================================= */

    if (loginForm) {

        loginForm.addEventListener("submit", e => {

            e.preventDefault();

            const email =
                document.getElementById("loginEmail")
                    ?.value.trim()
                    .toLowerCase();

            const password =
                document.getElementById("loginPassword")
                    ?.value;


            const user =
                getUsers().find(
                    item =>
                        item.email === email &&
                        item.password === password
                );


            if (!user) {

                alert(
                    "Email or password is incorrect."
                );

                return;
            }


            localStorage.setItem(
                CURRENT_USER_KEY,
                JSON.stringify({
                    id: user.id,
                    name: user.name,
                    email: user.email
                })
            );


            loginForm.reset();

            showDashboard(
                `Welcome back, ${user.name}!`
            );

        });
    }


    /* ================================
       LOGOUT
    ================================= */

    function logout() {

        localStorage.removeItem(
            CURRENT_USER_KEY
        );

        showLoginPage();

    }


    if (logoutBtn)
        logoutBtn.addEventListener("click", logout);

    if (settingsLogout)
        settingsLogout.addEventListener(
            "click",
            logout
        );


    /* ================================
       NAVIGATION
    ================================= */

    function openSection(id) {

        sections.forEach(section => {
            section.classList.remove(
                "active-section"
            );
        });


        const selected =
            document.getElementById(id);

        if (selected) {
            selected.classList.add(
                "active-section"
            );
        }


        navItems.forEach(item => {

            item.classList.remove("active");

            if (item.dataset.section === id) {
                item.classList.add("active");
            }

        });
    }


    navItems.forEach(item => {

        item.addEventListener("click", e => {

            e.preventDefault();

            openSection(
                item.dataset.section
            );

        });

    });


    goButtons.forEach(button => {

        button.addEventListener("click", () => {

            if (button.dataset.go) {
                openSection(
                    button.dataset.go
                );
            }

        });

    });


    /* ================================
       PROJECT RENDER
    ================================= */

    function renderProjects() {

        if (!projectGrid) return;

        const projects = getProjects();

        projectGrid.innerHTML = "";


        projects.forEach(project => {

            const card =
                document.createElement("article");

            card.className = "project";

            card.dataset.status =
                project.status || "progress";


            card.innerHTML = `

                <div class="project-cover">
                    ${escapeHTML(
                        project.name
                    )}
                </div>

                <div class="project-body">

                    <span class="status ${
                        project.status
                    }">
                        ${
                            project.status === "completed"
                            ? "Completed"
                            : "In Progress"
                        }
                    </span>

                    <h3>
                        ${escapeHTML(project.name)}
                    </h3>

                    <p>
                        ${escapeHTML(
                            project.description ||
                            "Professional web project."
                        )}
                    </p>

                    <small>
                        Client:
                        ${escapeHTML(
                            project.client
                        )}
                    </small>

                    <div class="project-meta">

                        <span>HTML</span>
                        <span>CSS</span>
                        <span>JavaScript</span>

                    </div>

                </div>
            `;


            projectGrid.appendChild(card);

        });


        applyFilters();
    }


    /* ================================
       CREATE PROJECT
    ================================= */

    createButtons.forEach(button => {

        button.addEventListener("click", () => {

            if (projectModal)
                projectModal.classList.add("show");

        });

    });


    if (closeModal) {

        closeModal.addEventListener(
            "click",
            () => {
                projectModal.classList.remove(
                    "show"
                );
            }
        );
    }


    if (projectModal) {

        projectModal.addEventListener(
            "click",
            e => {

                if (e.target === projectModal) {

                    projectModal.classList.remove(
                        "show"
                    );

                }

            }
        );
    }


    if (createProjectButton) {

        createProjectButton.addEventListener(
            "click",
            () => {

                const inputs =
                    projectModal.querySelectorAll(
                        "input"
                    );


                const projectName =
                    inputs[0]?.value.trim();

                const clientName =
                    inputs[1]?.value.trim();


                if (!projectName) {

                    alert(
                        "Please enter project name."
                    );

                    return;
                }


                if (!clientName) {

                    alert(
                        "Please enter client name."
                    );

                    return;
                }


                const projects =
                    getProjects();


                const newProject = {

                    id: Date.now(),

                    name: projectName,

                    client: clientName,

                    status: "progress",

                    description:
                        "New website project created by Misbah.",

                    createdAt:
                        new Date().toISOString()

                };


                projects.unshift(
                    newProject
                );

                saveProjects(projects);


                /*
                   Demo earning:
                   New project = $250
                */

                const currentEarnings =
                    getEarnings();

                saveEarnings(
                    currentEarnings + 250
                );


                inputs.forEach(
                    input => input.value = ""
                );


                projectModal.classList.remove(
                    "show"
                );


                renderProjects();

                updateDashboard();

                openSection("projects");


                showToast(
                    `Project "${projectName}" created successfully! +$250`
                );

            }
        );
    }


    /* ================================
       SEARCH
    ================================= */

    if (projectSearch) {

        projectSearch.addEventListener(
            "input",
            applyFilters
        );

    }


    /* ================================
       FILTER
    ================================= */

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(
                btn =>
                    btn.classList.remove(
                        "active"
                    )
            );


            button.classList.add("active");

            applyFilters();

        });

    });


    function applyFilters() {

        if (!projectGrid) return;

        const search =
            projectSearch?.value
                .toLowerCase()
                .trim() || "";


        const activeFilter =
            document.querySelector(
                ".filter.active"
            );


        const filter =
            activeFilter?.dataset.filter ||
            "all";


        projectGrid
            .querySelectorAll(".project")
            .forEach(card => {

                const text =
                    card.textContent
                        .toLowerCase();

                const status =
                    card.dataset.status;


                const matchesSearch =
                    text.includes(search);

                const matchesFilter =
                    filter === "all" ||
                    status === filter;


                card.style.display =
                    matchesSearch &&
                    matchesFilter
                        ? ""
                        : "none";

            });
    }


    /* ================================
       DASHBOARD STATS
    ================================= */

    function updateDashboard() {

        const projects =
            getProjects();

        const earnings =
            getEarnings();


        const totalProjects =
            document.querySelector(
                ".stats-grid .stat-card:nth-child(1) strong"
            );


        const completedProjects =
            document.querySelector(
                ".stats-grid .stat-card:nth-child(2) strong"
            );


        if (totalProjects) {
            totalProjects.textContent =
                projects.length;
        }


        if (completedProjects) {

            completedProjects.textContent =
                projects.filter(
                    project =>
                        project.status ===
                        "completed"
                ).length;

        }


        document
            .querySelectorAll(
                "[data-earnings]"
            )
            .forEach(element => {

                element.textContent =
                    `$${earnings.toFixed(2)}`;

            });


        /*
           Replace visible $0.00
           earnings amount automatically.
        */

        document
            .querySelectorAll(
                ".earnings-amount, .total-earnings"
            )
            .forEach(element => {

                element.textContent =
                    `$${earnings.toFixed(2)}`;

            });

    }


    /* ================================
       TOAST
    ================================= */

    function showToast(message) {

        const oldToast =
            document.querySelector(
                ".misbah-toast"
            );

        if (oldToast)
            oldToast.remove();


        const toast =
            document.createElement("div");


        toast.className =
            "misbah-toast";


        toast.textContent = message;


        toast.style.cssText = `
            position:fixed;
            right:25px;
            bottom:25px;
            z-index:99999;
            padding:15px 22px;
            border-radius:12px;
            background:#111;
            color:#fff;
            font-size:14px;
            box-shadow:0 10px 30px rgba(0,0,0,.25);
        `;


        document.body.appendChild(toast);


        setTimeout(() => {

            toast.remove();

        }, 3000);

    }


    /* ================================
       NOTIFICATION
    ================================= */

    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            () => {

                showToast(
                    "You have new notifications."
                );

            }
        );

    }


    /* ================================
       INITIAL LOAD
    ================================= */

    if (!localStorage.getItem(PROJECTS_KEY)) {

        saveProjects([]);

    }


    updateDashboard();


    if (getCurrentUser()) {

        showDashboard();

    } else {

        showLoginPage();

    }

});
