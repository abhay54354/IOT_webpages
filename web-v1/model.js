class Model {
    constructor() {
        this.db = {
            users: {
                'admin': { password: 'admin', name: 'Admin User', role: 'Administrator', id: 'AD-001', managedPumps: ['PUMP-01', 'PUMP-02', 'PUMP-03'] },
                'user': { password: 'user', name: 'John Doe', role: 'User', id: 'US-102', managedPumps: ['PUMP-02'] }
            },
            pumps: {
                'PUMP-01': { name: 'Main Station A', owner: 'Corp A', pressure: 5.20, setpoint: 5.50, status: 'Running', frequency: 48.5, flow: 12.4, voltage: 400, current: 8.2 },
                'PUMP-02': { name: 'Booster Pump B', owner: 'Corp B', pressure: 3.10, setpoint: 3.20, status: 'Running', frequency: 42.1, flow: 8.2, voltage: 380, current: 6.5 },
                'PUMP-03': { name: 'Inlet Pump C', owner: 'Corp C', pressure: 1.50, setpoint: 1.80, status: 'Stopped', frequency: 0.0, flow: 0.0, voltage: 400, current: 0.0 }
            },
            alerts: [
                { time: '10:45 AM', type: 'warning', msg: 'Inlet Pressure Low (Warning)', pump: 'Main Station A' },
                { time: '09:12 AM', type: 'danger', msg: 'Dry Run Protection Triggered', pump: 'Booster Pump B' }
            ]
        };

        this.state = {
            currentUser: null,
            activePumpId: null,
            activeView: 'dashboard',
            auditLog: [],
            editingUserId: null,
            isViewingUser: false,
            viewingAsUsername: null,
            pendingSetpoint: null
        };
    }

    authenticate(username, password) {
        const user = this.db.users[username];
        if (user && user.password === password) {
            this.state.currentUser = user;
            this.state.activePumpId = user.managedPumps[0] || Object.keys(this.db.pumps)[0];
            return true;
        }
        return false;
    }

    simulateTelemetry() {
        let changed = false;
        Object.keys(this.db.pumps).forEach(id => {
            const pump = this.db.pumps[id];
            if (pump.status === 'Running') {
                const jitter = (Math.random() - 0.5) * 0.1;
                pump.pressure = Math.max(0, parseFloat((pump.pressure + jitter).toFixed(2)));
                pump.flow = parseFloat((10 + pump.pressure * 0.5).toFixed(1));
                pump.current = parseFloat((7.5 + Math.random() * 1.5).toFixed(1));
                changed = true;
            }
        });
        return changed;
    }

    updateSetpoint(newVal) {
        const pump = this.db.pumps[this.state.activePumpId];
        const oldVal = pump.setpoint;
        pump.setpoint = newVal;
        this.state.auditLog.unshift({
            timestamp: new Date().toLocaleString(),
            user: this.state.currentUser.id,
            action: `Update [${pump.name}] Setpoint`,
            oldVal: oldVal.toFixed(2),
            newVal: pump.setpoint.toFixed(2)
        });
    }

    clearAlerts() {
        this.db.alerts = [];
    }

    saveUser(username, userData, isNew) {
        if (isNew) {
            this.db.users[username] = userData;
        } else {
            Object.assign(this.db.users[username], userData);
        }
    }

    getPumpsForActiveUser() {
        if (this.state.isViewingUser) {
            return this.db.users[this.state.viewingAsUsername].managedPumps || [];
        }
        return this.state.currentUser.managedPumps || [];
    }
}
