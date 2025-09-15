document.addEventListener('DOMContentLoaded', () => {
    // --- Constants & Global Variables ---
    const RHT_NAME_KEY = 'galiBusinessRhName';
    const EMPLOYEES_KEY = 'galiBusinessEmployees';
    const SALARIES_KEY = 'galiBusinessSalaries';
    const BLACKLIST_KEY = 'galiBusinessBlacklist';

    let employees = JSON.parse(localStorage.getItem(EMPLOYEES_KEY)) || [];
    let salaries = JSON.parse(localStorage.getItem(SALARIES_KEY)) || [];
    let blacklist = JSON.parse(localStorage.getItem(BLACKLIST_KEY)) || [];

    // --- DOM Elements ---
    const rhNameModal = document.getElementById('rhNameModal');
    const rhNameInput = document.getElementById('rhNameInput');
    const saveRhNameBtn = document.getElementById('saveRhNameBtn');
    const rhNameDisplay = document.getElementById('rhNameDisplay');
    const currentDateTimeDisplay = document.getElementById('currentDateTime');

    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    const employeeFormModal = document.getElementById('employeeFormModal');
    const employeeForm = document.getElementById('employeeForm');
    const modalFormTitle = document.getElementById('modalFormTitle');
    const closeButtons = document.querySelectorAll('.close-button');
    const showFormBtn = document.getElementById('showFormBtn');
    const ctaAddEmployee = document.getElementById('ctaAddEmployee');
    const cancelFormBtn = document.getElementById('cancelFormBtn');
    const photoInput = document.getElementById('photo');
    const photoPreview = document.getElementById('photoPreview');
    let editingEmployeeId = null; // To store the ID of the employee being edited

    const employeeTableBody = document.getElementById('employeeTableBody');
    const employeeSearchInput = document.getElementById('employeeSearchInput');
    const printListBtn = document.getElementById('printListBtn');
    const dashboardPrintListBtn = document.getElementById('dashboardPrintList');

    // Dashboard stats
    const dashboardTotalEmployees = document.getElementById('dashboardTotalEmployees');
    const dashboardActiveEmployees = document.getElementById('dashboardActiveEmployees');
    const dashboardBlacklisted = document.getElementById('dashboardBlacklisted');

    // Salaries section
    const salaryYearFilter = document.getElementById('salary-year-filter');
    const salaryMonthFilter = document.getElementById('salary-month-filter');
    const companyTypeFilter = document.getElementById('company-type-filter');
    const SalaryBtn = document.getElementById('SalaryBtn');
    const totalFilteredPayroll = document.getElementById('total-filtered-payroll');
    const numPaidEmployees = document.getElementById('num-paid-employees');
    const salariesTableBody = document.getElementById('salaries-table-body');

    // Statistics section
    const totalEmployeesCount = document.getElementById('totalEmployeesCount');
    const averageAge = document.getElementById('averageAge');
    const averageTenure = document.getElementById('averageTenure');
    const maleCount = document.getElementById('maleCount');
    const femaleCount = document.getElementById('femaleCount');
    const otherGenderCount = document.getElementById('otherGenderCount');
    const maritalStatusStats = document.getElementById('maritalStatusStats');
    const sectorStats = document.getElementById('sectorStats');
    const upcomingBirthdays = document.getElementById('upcomingBirthdays');
    const recentHires = document.getElementById('recentHires');

    // Blacklist section
    const blacklistSearchInput = document.getElementById('blacklistSearchInput');
    const addByNameToBlacklistBtn = document.getElementById('addByNameToBlacklistBtn');
    const blacklistTableBody = document.getElementById('blacklistTableBody');

    // Settings section
    const changeRhNameBtn = document.getElementById('changeRhNameBtn');
    const resetAllDataBtn = document.getElementById('resetAllDataBtn');

    // --- Utility Functions ---
    const saveToLocalStorage = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    };

    const loadFromLocalStorage = (key) => {
        return JSON.parse(localStorage.getItem(key));
    };

    const showModal = (modalElement) => {
        modalElement.style.display = 'block';
    };

    const hideModal = (modalElement) => {
        modalElement.style.display = 'none';
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const calculateTenure = (recruitmentDate) => {
        const recruitDate = new Date(recruitmentDate);
        const today = new Date();
        const diffTime = Math.abs(today - recruitDate);
        const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
        return diffYears;
    };

    // --- RH Name Management ---
    const checkRhName = () => {
        const rhName = loadFromLocalStorage(RHT_NAME_KEY);
        if (!rhName) {
            showModal(rhNameModal);
        } else {
            displayRhName(rhName);
        }
    };

    const displayRhName = (name) => {
        rhNameDisplay.textContent = `Bienvenue, ${name}`;
    };

    saveRhNameBtn.addEventListener('click', () => {
        const name = rhNameInput.value.trim();
        if (name) {
            saveToLocalStorage(RHT_NAME_KEY, name);
            displayRhName(name);
            hideModal(rhNameModal);
        } else {
            alert('Veuillez entrer votre nom.');
        }
    });

    changeRhNameBtn.addEventListener('click', () => {
        rhNameInput.value = loadFromLocalStorage(RHT_NAME_KEY) || '';
        showModal(rhNameModal);
    });

    // --- Date and Time Display ---
    const updateDateTime = () => {
        const now = new Date();
        const options = {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        };
        currentDateTimeDisplay.textContent = now.toLocaleDateString('fr-FR', options);
    };
    setInterval(updateDateTime, 1000); // Update every second

    // --- Sidebar Navigation ---
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        document.querySelector('.main-content').classList.toggle('shifted');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSectionId = link.dataset.section;

            // Remove active from all links and sections
            navLinks.forEach(nav => nav.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));

            // Add active to the clicked link and its corresponding section
            link.classList.add('active');
            document.getElementById(targetSectionId).classList.add('active');

            // Optionally close sidebar on mobile after navigation
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                document.querySelector('.main-content').classList.remove('shifted');
            }

            // Update relevant sections when navigating
            if (targetSectionId === 'employee-list') {
                renderEmployeesTable(employees);
            } else if (targetSectionId === 'statistics') {
                updateStatistics();
            } else if (targetSectionId === 'salaries-section') {
                populateCompanyTypeFilter();
                calculateAndRenderSalaries(); // Render with current filters
            } else if (targetSectionId === 'blacklist') {
                renderBlacklistTable(blacklist);
            } else if (targetSectionId === 'dashboard') {
                updateDashboardStats();
            }
        });
    });

    // --- Employee Form Modal ---
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            hideModal(employeeFormModal);
            employeeForm.reset();
            photoPreview.style.display = 'none';
            editingEmployeeId = null;
        });
    });

    cancelFormBtn.addEventListener('click', () => {
        hideModal(employeeFormModal);
        employeeForm.reset();
        photoPreview.style.display = 'none';
        editingEmployeeId = null;
    });

    showFormBtn.addEventListener('click', () => {
        modalFormTitle.textContent = 'Ajouter un Nouvel Employé';
        employeeForm.reset();
        photoPreview.style.display = 'none';
        editingEmployeeId = null;
        showModal(employeeFormModal);
    });

    ctaAddEmployee.addEventListener('click', () => {
        // Switch to employee-list section and open form
        document.querySelector('.nav-link[data-section="employee-list"]').click();
        modalFormTitle.textContent = 'Ajouter un Nouvel Employé';
        employeeForm.reset();
        photoPreview.style.display = 'none';
        editingEmployeeId = null;
        showModal(employeeFormModal);
    });

    photoInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                photoPreview.src = e.target.result;
                photoPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            photoPreview.style.display = 'none';
            photoPreview.src = '#';
        }
    });

    employeeForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const employeeData = {
            nom: document.getElementById('nom').value,
            dateNaissance: document.getElementById('dateNaissance').value,
            sexe: document.getElementById('sexe').value,
            tel: document.getElementById('tel').value,
            adresse: document.getElementById('adresse').value,
            matrimoniale: document.getElementById('matrimoniale').value,
            secteurTravail: document.getElementById('secteurTravail').value,
            dateRecrutement: document.getElementById('dateRecrutement').value,
            typeEntreprise: document.getElementById('typeEntreprise').value,
            salaireBase: parseFloat(document.getElementById('salaireBase').value),
            photo: photoPreview.src === '#' ? '' : photoPreview.src // Store photo as Base64
        };

        if (editingEmployeeId) {
            // Update existing employee
            const index = employees.findIndex(emp => emp.id === editingEmployeeId);
            if (index !== -1) {
                employees[index] = { ...employees[index], ...employeeData };
            }
            alert('Employé mis à jour avec succès !');
        } else {
            // Add new employee
            employeeData.id = Date.now(); // Simple unique ID
            employees.push(employeeData);
            alert('Nouvel employé ajouté avec succès !');
        }

        saveToLocalStorage(EMPLOYEES_KEY, employees);
        renderEmployeesTable(employees); // Re-render table
        updateDashboardStats(); // Update dashboard
        updateStatistics(); // Update statistics
        hideModal(employeeFormModal);
        employeeForm.reset();
        photoPreview.style.display = 'none';
        editingEmployeeId = null;
    });

    // --- Employee List Management ---
    const renderEmployeesTable = (filteredEmployees) => {
        employeeTableBody.innerHTML = '';
        if (filteredEmployees.length === 0) {
            employeeTableBody.innerHTML = '<tr><td colspan="13" style="text-align: center;">Aucun employé trouvé.</td></tr>';
            return;
        }

        filteredEmployees.forEach((emp, index) => {
            const row = employeeTableBody.insertRow();
            row.dataset.employeeId = emp.id; // Store ID on the row

            row.innerHTML = `
                <td>${index + 1}</td>
                <td><img src="${emp.photo || 'https://via.placeholder.com/40'}" alt="Photo" class="employee-photo" onerror="this.onerror=null;this.src='https://via.placeholder.com/40';"></td>
                <td>${emp.nom}</td>
                <td>${formatDate(emp.dateNaissance)}</td>
                <td>${calculateAge(emp.dateNaissance)}</td>
                <td>${emp.sexe}</td>
                <td>${emp.tel}</td>
                <td>${emp.adresse}</td>
                <td>${emp.matrimoniale}</td>
                <td>${formatDate(emp.dateRecrutement)}</td>
                <td>${emp.secteurTravail}</td>
                <td>${emp.typeEntreprise}</td>
                <td>${emp.salaireBase.toLocaleString('fr-FR')} FCFA</td>
                <td class="actions">
                    <button class="btn btn-sm edit-btn" data-id="${emp.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm delete-btn" data-id="${emp.id}"><i class="fas fa-trash"></i></button>
                    <button class="btn btn-sm blacklist-btn" data-id="${emp.id}" ${blacklist.some(b => b.employeeId === emp.id) ? 'disabled' : ''}><i class="fas fa-ban"></i></button>
                </td>
            `;
        });
    };

    employeeTableBody.addEventListener('click', (e) => {
        if (e.target.closest('.edit-btn')) {
            const id = parseInt(e.target.closest('.edit-btn').dataset.id);
            const employeeToEdit = employees.find(emp => emp.id === id);
            if (employeeToEdit) {
                editingEmployeeId = id;
                modalFormTitle.textContent = 'Modifier l\'Employé';
                document.getElementById('nom').value = employeeToEdit.nom;
                document.getElementById('dateNaissance').value = employeeToEdit.dateNaissance;
                document.getElementById('sexe').value = employeeToEdit.sexe;
                document.getElementById('tel').value = employeeToEdit.tel;
                document.getElementById('adresse').value = employeeToEdit.adresse;
                document.getElementById('matrimoniale').value = employeeToEdit.matrimoniale;
                document.getElementById('secteurTravail').value = employeeToEdit.secteurTravail;
                document.getElementById('dateRecrutement').value = employeeToEdit.dateRecrutement;
                document.getElementById('typeEntreprise').value = employeeToEdit.typeEntreprise;
                document.getElementById('salaireBase').value = employeeToEdit.salaireBase;
                if (employeeToEdit.photo) {
                    photoPreview.src = employeeToEdit.photo;
                    photoPreview.style.display = 'block';
                } else {
                    photoPreview.style.display = 'none';
                    photoPreview.src = '#';
                }
                showModal(employeeFormModal);
            }
        } else if (e.target.closest('.delete-btn')) {
            const id = parseInt(e.target.closest('.delete-btn').dataset.id);
            if (confirm('Êtes-vous sûr de vouloir supprimer cet employé ? Cette action est irréversible.')) {
                employees = employees.filter(emp => emp.id !== id);
                salaries = salaries.filter(sal => sal.employeeId !== id); // Remove associated salaries
                blacklist = blacklist.filter(bl => bl.employeeId !== id); // Remove from blacklist
                saveToLocalStorage(EMPLOYEES_KEY, employees);
                saveToLocalStorage(SALARIES_KEY, salaries);
                saveToLocalStorage(BLACKLIST_KEY, blacklist);
                renderEmployeesTable(employees);
                updateDashboardStats();
                updateStatistics();
                alert('Employé supprimé avec succès.');
            }
        } else if (e.target.closest('.blacklist-btn')) {
            const id = parseInt(e.target.closest('.blacklist-btn').dataset.id);
            const employeeToBlacklist = employees.find(emp => emp.id === id);
            if (employeeToBlacklist && !blacklist.some(b => b.employeeId === id)) {
                const motif = prompt(`Veuillez entrer le motif de la mise en liste noire pour ${employeeToBlacklist.nom}:`);
                if (motif) {
                    const blacklistItem = {
                        employeeId: employeeToBlacklist.id,
                        nom: employeeToBlacklist.nom,
                        photo: employeeToBlacklist.photo,
                        ancienSalaireBase: employeeToBlacklist.salaireBase,
                        motif: motif,
                        dateMise: new Date().toISOString().split('T')[0]
                    };
                    blacklist.push(blacklistItem);
                    saveToLocalStorage(BLACKLIST_KEY, blacklist);
                    renderEmployeesTable(employees); // Update buttons in employee list
                    renderBlacklistTable(blacklist); // Update blacklist table
                    updateDashboardStats();
                    alert(`${employeeToBlacklist.nom} a été ajouté à la liste noire.`);
                }
            } else if (blacklist.some(b => b.employeeId === id)) {
                alert('Cet employé est déjà dans la liste noire.');
            }
        }
    });

    employeeSearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = employees.filter(emp =>
            emp.nom.toLowerCase().includes(searchTerm) ||
            emp.secteurTravail.toLowerCase().includes(searchTerm) ||
            emp.typeEntreprise.toLowerCase().includes(searchTerm)
        );
        renderEmployeesTable(filtered);
    });

    // Print functionality
    const printTable = (tableId, title) => {
        const printContent = document.getElementById(tableId).outerHTML;
        const originalContents = document.body.innerHTML;
        const header = `<div style="text-align: center; margin-bottom: 20px;"><h1>${title}</h1><p>Date: ${new Date().toLocaleDateString('fr-FR')}</p></div>`;
        document.body.innerHTML = header + printContent;
        window.print();
        document.body.innerHTML = originalContents; // Restore original content
        window.location.reload(); // A quick way to re-initialize event listeners and state
    };

    printListBtn.addEventListener('click', () => {
        printTable('employee-list', 'Liste des Employés Gali-Business');
    });

    dashboardPrintListBtn.addEventListener('click', () => {
        document.querySelector('.nav-link[data-section="employee-list"]').click(); // Navigate to list
        setTimeout(() => { // Give time for content to render
            printTable('employee-list', 'Liste des Employés Gali-Business');
        }, 100);
    });

    // --- Dashboard Statistics ---
    const updateDashboardStats = () => {
        dashboardTotalEmployees.textContent = employees.length;
        dashboardActiveEmployees.textContent = employees.length - blacklist.length; // Simple active count
        dashboardBlacklisted.textContent = blacklist.length;
    };

    // --- Salary Management ---
    const populateCompanyTypeFilter = () => {
        const uniqueCompanyTypes = [...new Set(employees.map(emp => emp.typeEntreprise))];
        companyTypeFilter.innerHTML = '<option value="">Tous</option>';
        uniqueCompanyTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            companyTypeFilter.appendChild(option);
        });
    };

    const calculateAndRenderSalaries = () => {
        salariesTableBody.innerHTML = '';
        let totalPayroll = 0;
        let paidEmployeesCount = 0;

        const filterYear = parseInt(salaryYearFilter.value);
        const filterMonth = parseInt(salaryMonthFilter.value);
        const filterCompanyType = companyTypeFilter.value;

        const filteredSalaries = salaries.filter(sal => {
            const salaryDate = new Date(sal.year, sal.month - 1); // Month is 0-indexed for Date object
            const matchesYear = !filterYear || salaryDate.getFullYear() === filterYear;
            const matchesMonth = !filterMonth || salaryDate.getMonth() + 1 === filterMonth;
            const matchesCompanyType = !filterCompanyType || sal.typeEntreprise === filterCompanyType;
            return matchesYear && matchesMonth && matchesCompanyType;
        });

        if (filteredSalaries.length === 0) {
            salariesTableBody.innerHTML = '<tr><td colspan="9" style="text-align: center;">Aucun salaire calculé pour les filtres sélectionnés.</td></tr>';
        } else {
            filteredSalaries.forEach((sal, index) => {
                const row = salariesTableBody.insertRow();
                const netSalary = sal.baseSalary + (sal.bonus || 0) - (sal.deductions || 0);
                totalPayroll += netSalary;
                paidEmployeesCount++;

                row.innerHTML = `
                    <td>${sal.employeeName}</td>
                    <td>${sal.typeEntreprise}</td>
                    <td>${sal.baseSalary.toLocaleString('fr-FR')} FCFA</td>
                    <td>${(sal.bonus || 0).toLocaleString('fr-FR')} FCFA</td>
                    <td>${(sal.deductions || 0).toLocaleString('fr-FR')} FCFA</td>
                    <td>${netSalary.toLocaleString('fr-FR')} FCFA</td>
                    <td>${new Date(sal.year, sal.month - 1).toLocaleString('fr-FR', { month: 'long' })}</td>
                    <td>${sal.year}</td>
                    <td class="actions">
                        <button class="btn btn-sm print-payslip-btn" data-salary-id="${sal.id}"><i class="fas fa-print"></i></button>
                        <button class="btn btn-sm edit-salary-btn" data-salary-id="${sal.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm delete-salary-btn" data-salary-id="${sal.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
            });
        }

        totalFilteredPayroll.textContent = `${totalPayroll.toLocaleString('fr-FR')} FCFA`;
        numPaidEmployees.textContent = paidEmployeesCount;
    };


    SalaryBtn.addEventListener('click', () => {
        // Prompt for Month and Year if not already set by filters or for current month/year
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1; // 1-indexed

        let yearToProcess = parseInt(salaryYearFilter.value) || currentYear;
        let monthToProcess = parseInt(salaryMonthFilter.value) || currentMonth;

        // Ensure current year/month are displayed in filters if "Tous" is selected
        if (!salaryYearFilter.value) salaryYearFilter.value = yearToProcess;
        if (!salaryMonthFilter.value) salaryMonthFilter.value = monthToProcess;


        if (!confirm(`Voulez-vous calculer les salaires pour ${new Date(yearToProcess, monthToProcess - 1).toLocaleString('fr-FR', { month: 'long', year: 'numeric' })} pour tous les employés actifs ?`)) {
            return;
        }

        let newSalariesAdded = 0;
        employees.forEach(emp => {
            // Only process if not blacklisted
            if (!blacklist.some(b => b.employeeId === emp.id)) {
                // Check if salary for this employee, month, and year already exists
                const existingSalary = salaries.find(
                    s => s.employeeId === emp.id && s.month === monthToProcess && s.year === yearToProcess
                );

                if (!existingSalary) {
                    const bonus = parseFloat(prompt(`Entrez le bonus pour ${emp.nom} pour ${new Date(yearToProcess, monthToProcess - 1).toLocaleString('fr-FR', { month: 'long' })} (0 si aucun):`) || 0);
                    const deductions = parseFloat(prompt(`Entrez les déductions pour ${emp.nom} pour ${new Date(yearToProcess, monthToProcess - 1).toLocaleString('fr-FR', { month: 'long' })} (0 si aucune):`) || 0);

                    salaries.push({
                        id: Date.now() + Math.random(), // More robust ID for salaries
                        employeeId: emp.id,
                        employeeName: emp.nom,
                        typeEntreprise: emp.typeEntreprise,
                        baseSalary: emp.salaireBase,
                        bonus: bonus,
                        deductions: deductions,
                        month: monthToProcess,
                        year: yearToProcess
                    });
                    newSalariesAdded++;
                }
            }
        });

        if (newSalariesAdded > 0) {
            saveToLocalStorage(SALARIES_KEY, salaries);
            alert(`${newSalariesAdded} nouveaux salaires ont été calculés et ajoutés.`);
        } else {
            alert('Tous les salaires des employés actifs pour cette période ont déjà été calculés, ou aucun nouvel employé actif n\'a été trouvé.');
        }
        calculateAndRenderSalaries();
    });

    salaryYearFilter.addEventListener('input', calculateAndRenderSalaries);
    salaryMonthFilter.addEventListener('change', calculateAndRenderSalaries);
    companyTypeFilter.addEventListener('change', calculateAndRenderSalaries);

    // --- Statistics Section ---
    const updateStatistics = () => {
        totalEmployeesCount.textContent = employees.length;

        // Average Age
        const ages = employees.map(emp => calculateAge(emp.dateNaissance));
        const totalAge = ages.reduce((sum, age) => sum + age, 0);
        averageAge.textContent = employees.length > 0 ? Math.round(totalAge / employees.length) : 0;

        // Average Tenure
        const tenures = employees.map(emp => calculateTenure(emp.dateRecrutement));
        const totalTenure = tenures.reduce((sum, tenure) => sum + tenure, 0);
        averageTenure.textContent = employees.length > 0 ? (totalTenure / employees.length).toFixed(1) : 0;

        // Gender Distribution
        const genderCounts = employees.reduce((acc, emp) => {
            acc[emp.sexe] = (acc[emp.sexe] || 0) + 1;
            return acc;
        }, {});
        maleCount.textContent = genderCounts['Masculin'] || 0;
        femaleCount.textContent = genderCounts['Féminin'] || 0;
        otherGenderCount.textContent = genderCounts['Autre'] || 0; // Assuming 'Autre' for other

        // Marital Status Distribution
        const maritalCounts = employees.reduce((acc, emp) => {
            acc[emp.matrimoniale] = (acc[emp.matrimoniale] || 0) + 1;
            return acc;
        }, {});
        maritalStatusStats.innerHTML = '';
        for (const status in maritalCounts) {
            maritalStatusStats.innerHTML += `<li>${status}: <strong>${maritalCounts[status]}</strong></li>`;
        }
        if (Object.keys(maritalCounts).length === 0) {
            maritalStatusStats.innerHTML = '<li>Aucune donnée.</li>';
        }

        // Sector/Post Distribution
        const sectorCounts = employees.reduce((acc, emp) => {
            acc[emp.secteurTravail] = (acc[emp.secteurTravail] || 0) + 1;
            return acc;
        }, {});
        sectorStats.innerHTML = '';
        for (const sector in sectorCounts) {
            sectorStats.innerHTML += `<li>${sector}: <strong>${sectorCounts[sector]}</strong></li>`;
        }
        if (Object.keys(sectorCounts).length === 0) {
            sectorStats.innerHTML = '<li>Aucune donnée.</li>';
        }

        // Upcoming Birthdays (within 30 days)
        const today = new Date();
        const thirtyDaysLater = new Date();
        thirtyDaysLater.setDate(today.getDate() + 30);

        const birthdays = employees.filter(emp => {
            const dob = new Date(emp.dateNaissance);
            const nextBirthdayThisYear = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
            const nextBirthdayNextYear = new Date(today.getFullYear() + 1, dob.getMonth(), dob.getDate());

            // Check if birthday is in the next 30 days, considering year wrap
            return (nextBirthdayThisYear >= today && nextBirthdayThisYear <= thirtyDaysLater) ||
                   (nextBirthdayNextYear >= today && nextBirthdayNextYear <= thirtyDaysLater);
        }).sort((a, b) => {
            const dobA = new Date(a.dateNaissance);
            const dobB = new Date(b.dateNaissance);
            const nextBirthdayA = new Date(today.getFullYear(), dobA.getMonth(), dobA.getDate());
            const nextBirthdayB = new Date(today.getFullYear(), dobB.getMonth(), dobB.getDate());
            return nextBirthdayA - nextBirthdayB;
        });

        upcomingBirthdays.innerHTML = '';
        if (birthdays.length === 0) {
            upcomingBirthdays.innerHTML = '<li>Aucun anniversaire à venir dans les 30 prochains jours.</li>';
        } else {
            birthdays.forEach(emp => {
                const dob = new Date(emp.dateNaissance);
                const nextBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
                if (nextBirthday < today) { // If this year's birthday passed, show next year's
                    nextBirthday.setFullYear(today.getFullYear() + 1);
                }
                upcomingBirthdays.innerHTML += `<li>${emp.nom} - ${formatDate(nextBirthday.toISOString().split('T')[0])}</li>`;
            });
        }

        // Recent Hires (within 90 days)
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(today.getDate() - 90);

        const recentHiresList = employees.filter(emp => {
            const recruitmentDate = new Date(emp.dateRecrutement);
            return recruitmentDate >= ninetyDaysAgo && recruitmentDate <= today;
        }).sort((a, b) => new Date(b.dateRecrutement) - new Date(a.dateRecrutement)); // Newest first

        recentHires.innerHTML = '';
        if (recentHiresList.length === 0) {
            recentHires.innerHTML = '<li>Aucun recrutement récent dans les 90 derniers jours.</li>';
        } else {
            recentHiresList.forEach(emp => {
                recentHires.innerHTML += `<li>${emp.nom} - ${formatDate(emp.dateRecrutement)}</li>`;
            });
        }
    };

    // --- Blacklist Section ---
    const renderBlacklistTable = (filteredBlacklist) => {
        blacklistTableBody.innerHTML = '';
        if (filteredBlacklist.length === 0) {
            blacklistTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">La liste noire est vide.</td></tr>';
            return;
        }

        filteredBlacklist.forEach((item, index) => {
            const row = blacklistTableBody.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><img src="${item.photo || 'https://via.placeholder.com/40'}" alt="Photo" class="employee-photo" onerror="this.onerror=null;this.src='https://via.placeholder.com/40';"></td>
                <td>${item.nom}</td>
                <td>${item.ancienSalaireBase.toLocaleString('fr-FR')} FCFA</td>
                <td>${item.motif}</td>
                <td>${formatDate(item.dateMise)}</td>
                <td class="actions">
                    <button class="btn btn-sm remove-blacklist-btn" data-id="${item.employeeId}"><i class="fas fa-undo"></i> Retirer</button>
                </td>
            `;
        });
    };

    blacklistTableBody.addEventListener('click', (e) => {
        if (e.target.closest('.remove-blacklist-btn')) {
            const id = parseInt(e.target.closest('.remove-blacklist-btn').dataset.id);
            const employeeName = blacklist.find(b => b.employeeId === id)?.nom || 'cet employé';
            if (confirm(`Voulez-vous vraiment retirer ${employeeName} de la liste noire ?`)) {
                blacklist = blacklist.filter(item => item.employeeId !== id);
                saveToLocalStorage(BLACKLIST_KEY, blacklist);
                renderBlacklistTable(blacklist);
                renderEmployeesTable(employees); // Update employee list buttons
                updateDashboardStats();
                alert(`${employeeName} a été retiré de la liste noire.`);
            }
        }
    });

    blacklistSearchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = blacklist.filter(item =>
            item.nom.toLowerCase().includes(searchTerm) ||
            item.motif.toLowerCase().includes(searchTerm)
        );
        renderBlacklistTable(filtered);
    });

    addByNameToBlacklistBtn.addEventListener('click', () => {
        const employeeName = blacklistSearchInput.value.trim();
        if (!employeeName) {
            alert('Veuillez entrer le nom de l\'employé à ajouter à la liste noire.');
            return;
        }

        const employee = employees.find(emp => emp.nom.toLowerCase() === employeeName.toLowerCase());

        if (employee) {
            if (blacklist.some(b => b.employeeId === employee.id)) {
                alert(`${employee.nom} est déjà dans la liste noire.`);
                return;
            }
            const motif = prompt(`Veuillez entrer le motif de la mise en liste noire pour ${employee.nom}:`);
            if (motif) {
                const blacklistItem = {
                    employeeId: employee.id,
                    nom: employee.nom,
                    photo: employee.photo,
                    ancienSalaireBase: employee.salaireBase,
                    motif: motif,
                    dateMise: new Date().toISOString().split('T')[0]
                };
                blacklist.push(blacklistItem);
                saveToLocalStorage(BLACKLIST_KEY, blacklist);
                renderBlacklistTable(blacklist);
                renderEmployeesTable(employees); // Update employee list buttons
                updateDashboardStats();
                alert(`${employee.nom} a été ajouté à la liste noire.`);
                blacklistSearchInput.value = ''; // Clear input
            }
        } else {
            alert(`L'employé nommé "${employeeName}" n'a pas été trouvé dans la liste des employés.`);
        }
    });


    // --- Settings Section ---
    resetAllDataBtn.addEventListener('click', () => {
        if (confirm('ATTENTION : Voulez-vous vraiment réinitialiser TOUTES les données (employés, salaires, liste noire) ? Cette action est irréversible.')) {
            localStorage.clear(); // Clear all data
            employees = [];
            salaries = [];
            blacklist = [];
            alert('Toutes les données ont été réinitialisées. La page va se recharger.');
            window.location.reload(); // Reload the page to reset UI
        }
    });


    // --- Initial Load Logic ---
    const initializeApp = () => {
        checkRhName();
        updateDateTime();
        renderEmployeesTable(employees); // Initial render of employee list
        updateDashboardStats();
        updateStatistics();
        renderBlacklistTable(blacklist); // Initial render of blacklist
        populateCompanyTypeFilter();
        calculateAndRenderSalaries(); // Initial render of salaries
        // Set default filter values for salaries to current month/year
        const today = new Date();
        salaryYearFilter.value = today.getFullYear();
        salaryMonthFilter.value = today.getMonth() + 1;
    };

    initializeApp();
});




//CODE DE PROTECTION



// Définis le mot de passe requis
const motDePasseRequis = '00E1';

// Demande à l'utilisateur d'entrer le mot de passe
let motDePasseSaisi = prompt('Veuillez entrer le mot de passe pour accéder à l\'application.');

// Vérifie si le mot de passe saisi est correct
if (motDePasseSaisi === motDePasseRequis) {
  // Le mot de passe est correct, tu peux continuer
  alert('Accès accordé !');
  // Ici, tu peux mettre tout le code de ton application
  // Par exemple, afficher le contenu de la page
} else {
  // Le mot de passe est incorrect
  alert('Mot de passe incorrect. Accès refusé !');
  // Tu peux rediriger l'utilisateur ou cacher le contenu
  window.location.href = ''; // Exemple de redirection
}
