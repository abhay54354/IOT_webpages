class View {
    constructor() {
        this.elements = {
            loginScreen: document.getElementById('login-screen'),
            appContainer: document.querySelector('.app-container'),
            loginBtn: document.getElementById('login-btn'),
            usernameInput: document.getElementById('username'),
            passwordInput: document.getElementById('password'),
            
            views: {
                dashboard: document.getElementById('view-dashboard'),
                alerts: document.getElementById('view-alerts'),
                settings: document.getElementById('view-settings'),
                users: document.getElementById('view-users')
            },
            navItems: {
                dashboard: document.getElementById('nav-dashboard'),
                alerts: document.getElementById('nav-alerts'),
                settings: document.getElementById('nav-settings'),
                users: document.getElementById('nav-users')
            },
            viewTitle: document.getElementById('view-title'),
            pumpInfoSub: document.getElementById('pump-info-sub'),
            
            valPressure: document.getElementById('val-pressure'),
            valSetpoint: document.getElementById('val-setpoint'),
            valStatus: document.getElementById('val-status'),
            valFrequency: document.getElementById('val-frequency'),
            valFlow: document.getElementById('val-flow'),
            valVoltage: document.getElementById('val-voltage'),
            valCurrent: document.getElementById('val-current'),
            activePumpNameDisplay: document.getElementById('active-pump-name-display'),
            currentTime: document.getElementById('current-time'),
            
            pumpOwner: document.getElementById('pump-owner'),
            pumpList: document.getElementById('pump-list'),
            adminPumpNav: document.getElementById('admin-pump-nav'),
            
            setpointControls: document.getElementById('setpoint-controls-container'),
            auditLogBody: document.getElementById('audit-log-body'),
            displayUserName: document.getElementById('display-user-name'),
            displayUserRole: document.getElementById('display-user-role'),
            userAvatar: document.getElementById('user-avatar'),
            
            userTableBody: document.getElementById('user-management-body'),
            userDetailPanel: document.getElementById('user-detail-panel'),
            editUsername: document.getElementById('edit-username'),
            editDisplayName: document.getElementById('edit-displayname'),
            editPassword: document.getElementById('edit-password'),
            editRole: document.getElementById('edit-role'),
            pumpAssignmentList: document.getElementById('pump-assignment-list'),
            
            confirmModal: document.getElementById('confirm-modal'),
            modalNewVal: document.getElementById('modal-new-val'),
            confirmBtn: document.getElementById('confirm-change'),
            cancelBtn: document.getElementById('cancel-change'),
            
            saveUserBtn: document.getElementById('save-user-btn'),
            navBackAdmin: document.getElementById('nav-back-admin'),
            fullAlertList: document.getElementById('full-alert-list'),
            detailUserName: document.getElementById('detail-user-name'),
            
            btnClearAlerts: document.getElementById('btn-clear-alerts'),
            btnSaveSettings: document.getElementById('btn-save-settings'),
            btnAddUser: document.getElementById('btn-add-user'),
            btnCloseModalX: document.getElementById('btn-close-modal-x'),
            btnCloseModalCancel: document.getElementById('btn-close-modal-cancel')
        };
    }

    bindLogin(handler) {
        this.elements.loginBtn.addEventListener('click', () => {
            handler(this.elements.usernameInput.value, this.elements.passwordInput.value);
        });
        [this.elements.usernameInput, this.elements.passwordInput].forEach(el => {
            el.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handler(this.elements.usernameInput.value, this.elements.passwordInput.value);
                }
            });
        });
    }

    bindNav(handler) {
        Object.keys(this.elements.navItems).forEach(viewKey => {
            const item = this.elements.navItems[viewKey];
            if (item) {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    handler(viewKey);
                });
            }
        });
    }

    bindExitViewMode(handler) {
        if (this.elements.navBackAdmin) {
            this.elements.navBackAdmin.addEventListener('click', (e) => {
                e.preventDefault();
                handler();
            });
        }
    }

    bindConfirmSetpoint(handler) {
        this.elements.confirmBtn.addEventListener('click', handler);
    }

    bindCancelSetpoint(handler) {
        this.elements.cancelBtn.addEventListener('click', handler);
    }

    bindSaveUser(handler) {
        this.elements.saveUserBtn.addEventListener('click', () => {
            const checkboxes = this.elements.pumpAssignmentList.querySelectorAll('input[type="checkbox"]:checked');
            const managedPumps = Array.from(checkboxes).map(cb => cb.value);
            handler({
                username: this.elements.editUsername.value,
                name: this.elements.editDisplayName.value,
                password: this.elements.editPassword.value,
                role: this.elements.editRole.value,
                managedPumps
            });
        });
    }

    bindAddUser(handler) {
        this.elements.btnAddUser.addEventListener('click', handler);
    }
    
    bindCloseUserModal(handler) {
        this.elements.btnCloseModalX.addEventListener('click', handler);
        this.elements.btnCloseModalCancel.addEventListener('click', handler);
    }

    bindClearAlerts(handler) {
        this.elements.btnClearAlerts.addEventListener('click', handler);
    }

    bindSaveSettings(handler) {
        this.elements.btnSaveSettings.addEventListener('click', handler);
    }

    showApp() {
        this.elements.loginScreen.style.display = 'none';
        this.elements.appContainer.style.display = 'flex';
    }

    updateClock() {
        this.elements.currentTime.textContent = new Date().toLocaleTimeString();
    }

    switchView(viewKey) {
        Object.keys(this.elements.navItems).forEach(key => {
            if (this.elements.navItems[key]) {
                if (key === viewKey) {
                    this.elements.navItems[key].classList.add('active');
                } else {
                    this.elements.navItems[key].classList.remove('active');
                }
            }
        });
        Object.keys(this.elements.views).forEach(key => {
            if (this.elements.views[key]) {
                if (key === viewKey) {
                    this.elements.views[key].classList.add('active');
                } else {
                    this.elements.views[key].classList.remove('active');
                }
            }
        });
        
        this.elements.viewTitle.textContent = viewKey.charAt(0).toUpperCase() + viewKey.slice(1) + (viewKey === 'dashboard' ? '' : ' Management');
        this.elements.pumpInfoSub.style.display = viewKey === 'dashboard' ? 'flex' : 'none';
    }

    updateSidebar(currentUser, isViewing) {
        this.elements.displayUserName.textContent = currentUser.name;
        this.elements.displayUserRole.textContent = currentUser.role;
        this.elements.userAvatar.textContent = currentUser.name.split(' ').map(n => n[0]).join('');
        
        const isAdmin = currentUser.role === 'Administrator';
        this.elements.navItems.users.style.display = (isAdmin && !isViewing) ? 'flex' : 'none';
        this.elements.navItems.alerts.style.display = isViewing ? 'none' : 'flex';
        this.elements.navItems.settings.style.display = isViewing ? 'none' : 'flex';
        this.elements.adminPumpNav.style.display = (isAdmin || isViewing) ? 'block' : 'none';
        
        if (this.elements.navBackAdmin) {
            this.elements.navBackAdmin.style.display = isViewing ? 'flex' : 'none';
        }
    }

    renderPumpList(pumpsToRender, allPumps, activePumpId, onPumpSelect) {
        this.elements.pumpList.innerHTML = pumpsToRender.map(id => {
            const pump = allPumps[id];
            return `
                <div class="pump-item ${activePumpId === id ? 'active' : ''}" data-id="${id}">
                    <span class="pump-status-dot ${pump.status === 'Running' ? 'online' : 'offline'}"></span>
                    <span>${pump.name}</span>
                </div>
            `;
        }).join('');

        this.elements.pumpList.querySelectorAll('.pump-item').forEach(item => {
            item.addEventListener('click', () => onPumpSelect(item.dataset.id));
        });
    }

    loadActivePump(pump, currentUserRole, onRequestSetpoint) {
        if (!pump) return;
        this.elements.activePumpNameDisplay.textContent = pump.name;
        this.elements.pumpOwner.textContent = `Owner: ${pump.owner}`;
        this.elements.valPressure.textContent = pump.pressure.toFixed(2);
        this.elements.valSetpoint.textContent = pump.setpoint.toFixed(2);
        this.elements.valStatus.textContent = pump.status;
        this.elements.valStatus.className = `card-value status-text ${pump.status.toLowerCase()}`;
        this.elements.valFrequency.textContent = pump.frequency.toFixed(1);
        this.elements.valFlow.textContent = pump.flow.toFixed(1);
        this.elements.valVoltage.textContent = pump.voltage;
        this.elements.valCurrent.textContent = pump.current.toFixed(1);
        
        if (currentUserRole === 'Administrator' || currentUserRole === 'Operator') {
            this.elements.setpointControls.innerHTML = `
                <div class="control-group">
                    <input type="number" step="0.1" value="${pump.setpoint}" class="input-control" id="input-setpoint">
                    <button class="btn btn-primary" id="btn-update-setpoint">Update</button>
                </div>
            `;
            document.getElementById('btn-update-setpoint').addEventListener('click', () => {
                const val = parseFloat(document.getElementById('input-setpoint').value);
                if (!isNaN(val)) {
                    onRequestSetpoint(val);
                }
            });
        } else {
            this.elements.setpointControls.innerHTML = `<span class="label-small">Read-only (User Access)</span>`;
        }
    }

    showConfirmModal(newVal) {
        this.elements.modalNewVal.textContent = newVal.toFixed(2);
        this.elements.confirmModal.classList.add('active');
    }
    
    hideConfirmModal() {
        this.elements.confirmModal.classList.remove('active');
    }

    renderAuditLog(log) {
        this.elements.auditLogBody.innerHTML = log.slice(0, 5).map(entry => `
            <tr><td>${entry.timestamp}</td><td><span class="user-role">${entry.user}</span></td><td>${entry.action}</td><td>${entry.oldVal}</td><td style="color: var(--accent-blue); font-weight: 600;">${entry.newVal}</td></tr>
        `).join('');
    }

    renderAlerts(alerts) {
        this.elements.fullAlertList.innerHTML = alerts.map(alert => `
            <div class="alert-large ${alert.type}">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-weight: 700; text-transform: uppercase;">${alert.type}</span>
                    <span class="label-small">${alert.time}</span>
                </div>
                <div style="font-size: 1.1rem; margin-bottom: 4px;">${alert.msg}</div>
                <div class="label-small">Source: ${alert.pump}</div>
            </div>
        `).join('');
    }

    renderUserTable(users, onView, onManage) {
        this.elements.userTableBody.innerHTML = Object.keys(users).map(username => {
            const user = users[username];
            return `
                <tr>
                    <td>
                        <div style="font-weight: 600;">${user.name}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">ID: ${user.id}</div>
                    </td>
                    <td><span class="badge" style="background: var(--accent-blue-dim); color: var(--accent-blue);">${user.role}</span></td>
                    <td>${user.managedPumps.length} Pumps</td>
                    <td>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn btn-primary btn-small btn-view-user" data-username="${username}">
                                <i data-lucide="eye" style="width: 14px; height: 14px;"></i> View
                            </button>
                            <button class="btn btn-secondary btn-small btn-manage-user" data-username="${username}">
                                <i data-lucide="edit-2" style="width: 14px; height: 14px;"></i> Manage
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
        lucide.createIcons();

        this.elements.userTableBody.querySelectorAll('.btn-view-user').forEach(btn => {
            btn.addEventListener('click', (e) => onView(e.currentTarget.dataset.username));
        });
        this.elements.userTableBody.querySelectorAll('.btn-manage-user').forEach(btn => {
            btn.addEventListener('click', (e) => onManage(e.currentTarget.dataset.username));
        });
    }

    openUserDetail(username, user, allPumps) {
        this.elements.editUsername.value = username || '';
        this.elements.editDisplayName.value = user ? user.name : '';
        this.elements.editPassword.value = user ? user.password : '';
        this.elements.editRole.value = user ? user.role : 'User';
        this.elements.editUsername.readOnly = !!username;
        this.elements.detailUserName.textContent = username ? 'Edit User' : 'Add New User';
        this.elements.saveUserBtn.textContent = username ? 'Update User' : 'Add User';
        
        const managedPumps = user ? user.managedPumps : [];
        this.elements.pumpAssignmentList.innerHTML = Object.keys(allPumps).map(pumpId => {
            const pump = allPumps[pumpId];
            const isChecked = managedPumps.includes(pumpId);
            return `
                <label class="checkbox-item">
                    <input type="checkbox" value="${pumpId}" ${isChecked ? 'checked' : ''}>
                    <span>${pump.name}</span>
                </label>
            `;
        }).join('');
        
        this.elements.userDetailPanel.classList.add('active');
    }

    closeUserDetail() {
        this.elements.userDetailPanel.classList.remove('active');
    }
}
