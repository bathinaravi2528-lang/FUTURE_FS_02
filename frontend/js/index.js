// Check for token on load
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('crmToken');
    if (token) {
        showAdminSection();
        loadLeads();
    }
});

// TOGGLE LOGIN/REGISTER
function toggleAuth(showRegister) {
    document.getElementById('login-card').style.display = showRegister ? 'none' : 'block';
    document.getElementById('register-card').style.display = showRegister ? 'block' : 'none';
}

// TOGGLE DASHBOARD/LEADS VIEWS
function showView(viewId) {
    document.querySelectorAll('.view-section').forEach(view => view.style.display = 'none');
    document.getElementById(viewId).style.display = 'block';

    // Update tab styles
    const tabs = { 'dashboard-view': 'tab-dashboard', 'leads-view': 'tab-leads' };
    Object.keys(tabs).forEach(id => {
        const tabEl = document.getElementById(tabs[id]);
        if (id === viewId) {
            tabEl.style.color = 'var(--text)';
            tabEl.classList.add('active');
        } else {
            tabEl.style.color = 'var(--text-muted)';
            tabEl.classList.remove('active');
        }
    });

    if (viewId === 'dashboard-view') loadLeads(); // Refresh charts
}

// REGISTER FORM
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const phone = document.getElementById('reg-phone').value;
    const source = document.getElementById('reg-source').value;

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, phone, source })
        });

        if (response.ok) {
            document.getElementById('register-success').style.display = 'block';
            setTimeout(() => {
                toggleAuth(false);
                document.getElementById('register-success').style.display = 'none';
                document.getElementById('register-form').reset();
            }, 2000);
        } else {
            const errorData = await response.text();
            const errorMsg = document.getElementById('register-error');
            errorMsg.innerText = errorData || 'Registration failed.';
            errorMsg.style.display = 'block';
            setTimeout(() => errorMsg.style.display = 'none', 4000);
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Server connection failed.');
    }
});

// LOGIN FORM
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('crmToken', data.token);
            localStorage.setItem('crmUsername', data.username);
            showAdminSection();
            loadLeads();
        } else {
            const errorMsg = document.getElementById('login-error');
            errorMsg.innerText = response.status === 401 ? 'Invalid Email or Password' : 'Login failed. Please try again.';
            errorMsg.style.display = 'block';
            setTimeout(() => errorMsg.style.display = 'none', 3000);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Server connection failed.');
    }
});

function showAdminSection() {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('admin-section').style.display = 'block';
    const username = localStorage.getItem('crmUsername') || 'Admin';
    document.getElementById('admin-name').innerText = username;
    document.getElementById('admin-initials').innerText = username.charAt(0).toUpperCase();
}

function logout() {
    localStorage.removeItem('crmToken');
    localStorage.removeItem('crmUsername');
    window.location.reload();
}

// CHART INSTANCES
let statusPieChart = null;
let dailyBarChart = null;

async function loadLeads() {
    const token = localStorage.getItem('crmToken');
    if (!token) return;

    try {
        // Fetch analytics
        const analyticsRes = await fetch('/api/analytics', {
            headers: { 'Authorization': token }
        });
        
        if (analyticsRes.status === 401 || analyticsRes.status === 403) {
            console.warn('Session expired or invalid token during analytics fetch');
            return logout();
        }
        
        const analyticsData = await analyticsRes.json();
        updateDashboardCharts(analyticsData);

        // Fetch leads list
        const leadsRes = await fetch('/api/leads', {
            headers: { 'Authorization': token }
        });

        if (leadsRes.status === 401 || leadsRes.status === 403) {
            return logout();
        }

        const leads = await leadsRes.json();
        renderLeads(leads);
    } catch (error) {
        console.error('Error loading leads:', error);
    }
}

function updateDashboardCharts(data) {
    const statusPieCtx = document.getElementById('statusPieChart').getContext('2d');
    const dailyBarCtx = document.getElementById('dailyBarChart').getContext('2d');

    // Update Overview Stats
    let totalCount = 0;
    const statsMap = { new: 0, contacted: 0, converted: 0 };
    
    data.statusStats.forEach(s => {
        totalCount += s.count;
        if (statsMap.hasOwnProperty(s.status)) statsMap[s.status] = s.count;
    });

    document.getElementById('total-leads').innerText = totalCount;
    document.getElementById('new-leads').innerText = statsMap.new;
    document.getElementById('contacted-leads').innerText = statsMap.contacted;
    document.getElementById('converted-leads').innerText = statsMap.converted;

    // 1. PIE CHART - Status Distribution
    const statusLabels = data.statusStats.map(s => s.status);
    const statusCounts = data.statusStats.map(s => s.count);
    
    if (statusPieChart) statusPieChart.destroy();
    statusPieChart = new Chart(statusPieCtx, {
        type: 'doughnut',
        data: {
            labels: statusLabels,
            datasets: [{
                data: statusCounts,
                backgroundColor: ['#6366f1', '#f59e0b', '#10b981', '#3b82f6'],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#94a3b8' } }
            }
        }
    });

    // 2. BAR CHART - Daily Joins
    let dailyLabels = [];
    let dailyCounts = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let startDate = new Date(today);
    startDate.setDate(today.getDate() - 6); // Default: Last 7 days

    if (data.dailyStats && data.dailyStats.length > 0) {
        // We append 'T00:00:00' to parse it safely as local day instead of UTC, avoiding offset shift
        const firstDataDate = new Date(data.dailyStats[0].date + "T00:00:00");
        firstDataDate.setHours(0,0,0,0);
        if (firstDataDate < startDate) {
            startDate = firstDataDate;
        }
    }

    const dataMap = {};
    (data.dailyStats || []).forEach(s => dataMap[s.date] = s.count);

    let currentDate = new Date(startDate);
    while (currentDate <= today) {
        const yyyy = currentDate.getFullYear();
        const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
        const dd = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${yyyy}-${mm}-${dd}`;
        
        dailyLabels.push(formattedDate);
        dailyCounts.push(dataMap[formattedDate] || 0);

        currentDate.setDate(currentDate.getDate() + 1);
    }

    if (dailyBarChart) dailyBarChart.destroy();
    dailyBarChart = new Chart(dailyBarCtx, {
        type: 'bar',
        data: {
            labels: dailyLabels,
            datasets: [{
                label: 'Leads per Day',
                data: dailyCounts,
                backgroundColor: '#6366f1',
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { display: false },
                x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function renderLeads(leads) {
    const listBody = document.getElementById('leads-list');
    const recentBody = document.getElementById('recent-leads-list');
    const loadingMsg = document.getElementById('loading');
    
    listBody.innerHTML = '';
    if (recentBody) recentBody.innerHTML = '';
    loadingMsg.style.display = 'none';

    if (leads.length === 0) {
        listBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 2rem;">No leads found.</td></tr>';
        if (recentBody) recentBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 1rem;">No leads yet.</td></tr>';
        return;
    }

    // Full Leads List
    leads.forEach(lead => {
        const row = document.createElement('tr');
        // Safely escape lead data for the onclick handler
        const leadStr = JSON.stringify(lead).replace(/'/g, "\\'").replace(/"/g, '&quot;');
        
        row.innerHTML = `
            <td style="font-weight: 600;">${lead.name}</td>
            <td style="font-size: 0.875rem; color: var(--text-muted);">${lead.email}<br>${lead.phone || '-'}</td>
            <td style="font-size: 0.875rem;">${lead.source}</td>
            <td><span class="badge badge-${lead.status}">${lead.status}</span></td>
            <td style="font-size: 0.875rem; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${lead.notes}">${lead.notes || 'No notes'}</td>
            <td style="font-size: 0.875rem; color: var(--text-muted);">${new Date(lead.created_at).toLocaleDateString()}</td>
            <td>
                <div style="display: flex; gap: 0.5rem;">
                    <button onclick="editLead(${leadStr})" class="btn btn-glass" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">Edit</button>
                    <button onclick="deleteLead('${lead.id}')" class="btn btn-glass" style="padding: 0.4rem 0.8rem; font-size: 0.75rem; color: #ef4444;">Delete</button>
                </div>
            </td>
        `;
        listBody.appendChild(row);
    });

    // Recent Leads Dashboard Preview (Top 5)
    if (recentBody) {
        leads.slice(0, 5).forEach(lead => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border);">${lead.name}</td>
                <td style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border); color: var(--text-muted);">${lead.email}</td>
                <td style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border);"><span class="badge badge-${lead.status}">${lead.status}</span></td>
                <td style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border); color: var(--text-muted);">${new Date(lead.created_at).toLocaleDateString()}</td>
            `;
            recentBody.appendChild(row);
        });
    }
}

async function deleteLead(id) {
    if (!id) return;
    if (!confirm(`Are you sure you want to delete this lead?`)) return;
    
    const token = localStorage.getItem('crmToken');
    if (!token) {
        alert('You are not logged in.');
        return logout();
    }

    try {
        const response = await fetch(`/api/leads/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': token }
        });

        if (response.ok) {
            console.log(`Lead ${id} deleted successfully`);
            loadLeads(); // Refresh list and charts
        } else if (response.status === 401 || response.status === 403) {
            alert('Session expired. Please log in again.');
            logout();
        } else {
            const errorText = await response.text();
            alert(`Error deleting lead: ${errorText}`);
        }
    } catch (error) {
        console.error('Delete error:', error);
        alert('Server connection error while deleting.');
    }
}

function openAddLeadModal() {
    toggleModal('add-lead-modal');
}

document.getElementById('add-lead-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        name: document.getElementById('add-name').value,
        email: document.getElementById('add-email').value,
        phone: document.getElementById('add-phone').value,
        source: document.getElementById('add-source').value,
        notes: document.getElementById('add-notes').value
    };

    try {
        const response = await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            toggleModal('add-lead-modal');
            document.getElementById('add-lead-form').reset();
            loadLeads();
        }
    } catch (error) {
        console.error('Manual lead add error:', error);
    }
});

function editLead(lead) {
    document.getElementById('modal-title').innerText = `Edit Lead: ${lead.name}`;
    document.getElementById('edit-lead-id').value = lead.id;
    document.getElementById('edit-status').value = lead.status;
    document.getElementById('edit-notes').value = lead.notes || '';
    toggleModal('note-modal');
}

document.getElementById('edit-lead-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-lead-id').value;
    const status = document.getElementById('edit-status').value;
    const notes = document.getElementById('edit-notes').value;
    const token = localStorage.getItem('crmToken');

    try {
        const response = await fetch(`/api/leads/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ status, notes })
        });

        if (response.ok) {
            toggleModal('note-modal');
            loadLeads(); // Refresh
        } else {
            alert('Failed to update lead.');
        }
    } catch (error) {
        console.error('Update error:', error);
    }
});

function toggleModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

// Search functionality
document.getElementById('search-input').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#leads-list tr');
    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// Export CSV Functionality
async function exportCSV() {
    const token = localStorage.getItem('crmToken');
    if (!token) return logout();

    try {
        const response = await fetch('/api/leads', {
            headers: { 'Authorization': token }
        });
        const leads = await response.json();

        if (leads.length === 0) {
            alert('No leads available to export.');
            return;
        }

        const headers = ["ID", "Name", "Email", "Phone", "Source", "Status", "Notes", "Created At"];
        const rows = leads.map(l => [
            l.id,
            `"${l.name || ''}"`,
            l.email || '',
            l.phone || '',
            l.source || '',
            l.status || '',
            `"${(l.notes || '').replace(/"/g, '""')}"`,
            l.created_at
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `leadsync_leads_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Export error:', error);
        alert('Failed to export leads.');
    }
}

