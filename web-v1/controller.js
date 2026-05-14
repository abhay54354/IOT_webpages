class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // Bind view events to controller handlers
        this.view.bindLogin(this.handleLogin.bind(this));
        this.view.bindNav(this.handleNav.bind(this));
        this.view.bindExitViewMode(this.handleExitViewMode.bind(this));
        this.view.bindConfirmSetpoint(this.handleConfirmSetpoint.bind(this));
        this.view.bindCancelSetpoint(this.handleCancelSetpoint.bind(this));
        this.view.bindSaveUser(this.handleSaveUser.bind(this));
        this.view.bindAddUser(this.handleAddUser.bind(this));
        this.view.bindCloseUserModal(this.handleCloseUserModal.bind(this));
        this.view.bindClearAlerts(this.handleClearAlerts.bind(this));
        this.view.bindSaveSettings(this.handleSaveSettings.bind(this));

        // Start Clock & Telemetry
        this.view.updateClock();
        setInterval(() => this.view.updateClock(), 1000);
        setInterval(() => this.simulateTelemetry(), 3000);
    }

    handleLogin(username, password) {
        if (this.model.authenticate(username, password)) {
            this.view.showApp();
            this.view.updateSidebar(this.model.state.currentUser, this.model.state.isViewingUser);
            this.renderDashboardData();
            this.view.renderAuditLog(this.model.state.auditLog);
            this.view.renderAlerts(this.model.db.alerts);
        } else {
            alert('Invalid credentials. Use admin/admin or user/user');
        }
    }

    handleNav(viewKey) {
        if (this.model.state.isViewingUser && (viewKey === 'alerts' || viewKey === 'settings' || viewKey === 'users')) {
            return;
        }
        this.model.state.activeView = viewKey;
        this.view.switchView(viewKey);

        if (viewKey === 'users') {
            this.view.renderUserTable(this.model.db.users, this.handleViewUser.bind(this), this.handleManageUser.bind(this));
        }
        if (viewKey === 'alerts') {
            this.view.renderAlerts(this.model.db.alerts);
        }
    }

    renderDashboardData() {
        const pumpsToRender = this.model.getPumpsForActiveUser();
        this.view.renderPumpList(pumpsToRender, this.model.db.pumps, this.model.state.activePumpId, this.handlePumpSelect.bind(this));
        const activePump = this.model.db.pumps[this.model.state.activePumpId];
        this.view.loadActivePump(activePump, this.model.state.currentUser.role, this.handleRequestSetpoint.bind(this));
    }

    handlePumpSelect(id) {
        this.model.state.activePumpId = id;
        this.renderDashboardData();
    }

    handleRequestSetpoint(val) {
        this.model.state.pendingSetpoint = val;
        this.view.showConfirmModal(val);
    }

    handleConfirmSetpoint() {
        if (this.model.state.pendingSetpoint !== null) {
            this.model.updateSetpoint(this.model.state.pendingSetpoint);
            this.view.renderAuditLog(this.model.state.auditLog);
            const activePump = this.model.db.pumps[this.model.state.activePumpId];
            this.view.loadActivePump(activePump, this.model.state.currentUser.role, this.handleRequestSetpoint.bind(this));
            this.view.hideConfirmModal();
            this.model.state.pendingSetpoint = null;
        }
    }

    handleCancelSetpoint() {
        this.view.hideConfirmModal();
        this.model.state.pendingSetpoint = null;
    }

    simulateTelemetry() {
        if (this.model.state.activeView !== 'dashboard') return;
        if (this.model.simulateTelemetry()) {
            const activePump = this.model.db.pumps[this.model.state.activePumpId];
            this.view.loadActivePump(activePump, this.model.state.currentUser.role, this.handleRequestSetpoint.bind(this));
        }
    }

    handleViewUser(username) {
        const user = this.model.db.users[username];
        if (!user) return;

        this.model.state.isViewingUser = true;
        this.model.state.viewingAsUsername = username;
        this.model.state.activePumpId = user.managedPumps[0] || Object.keys(this.model.db.pumps)[0];

        this.handleNav('dashboard');
        this.view.updateSidebar(this.model.state.currentUser, this.model.state.isViewingUser);
        this.renderDashboardData();
    }

    handleExitViewMode() {
        this.model.state.isViewingUser = false;
        this.model.state.viewingAsUsername = null;
        this.model.state.activePumpId = this.model.state.currentUser.managedPumps[0];
        
        this.view.updateSidebar(this.model.state.currentUser, this.model.state.isViewingUser);
        this.handleNav('users');
        this.renderDashboardData();
    }

    handleManageUser(username) {
        this.model.state.editingUserId = username;
        const user = this.model.db.users[username];
        this.view.openUserDetail(username, user, this.model.db.pumps);
    }

    handleAddUser() {
        this.model.state.editingUserId = null;
        this.view.openUserDetail(null, null, this.model.db.pumps);
    }

    handleSaveUser(userData) {
        if (!userData.username) {
            alert('Username is required');
            return;
        }
        const isNew = !this.model.state.editingUserId;
        const username = isNew ? userData.username : this.model.state.editingUserId;
        
        let userObj = isNew ? {} : this.model.db.users[username];
        userObj.name = userData.name;
        userObj.password = userData.password;
        userObj.role = userData.role;
        userObj.id = isNew ? `US-${Math.floor(100 + Math.random() * 900)}` : userObj.id;
        userObj.managedPumps = userData.managedPumps;

        this.model.saveUser(username, userObj, isNew);
        
        alert(isNew ? 'User added successfully' : 'User updated successfully');
        this.view.closeUserDetail();
        this.view.renderUserTable(this.model.db.users, this.handleViewUser.bind(this), this.handleManageUser.bind(this));
    }

    handleCloseUserModal() {
        this.view.closeUserDetail();
        this.model.state.editingUserId = null;
    }

    handleClearAlerts() {
        this.model.clearAlerts();
        this.view.renderAlerts(this.model.db.alerts);
    }

    handleSaveSettings() {
        alert('Settings saved successfully');
    }
}
