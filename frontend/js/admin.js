// Check for token on load
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('crmToken');
    if (token) {
        showAdminSection();
        loadLeads();
    }
});

// LOGIN FORM
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('crmToken', data.token);
            localStorage.setItem('crmUsername', data.username);
            showAdminSection();
            loadLeads();
        } else {
            const errorMsg = document.getElementById('login-error');
            errorMsg.style.display = 'block';
            setTimeout(() => errorMsg.style.display = 'none', 3000);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Server connection failed.');
    }
});

function showAdminSection() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-section').style.display = 'block';
    document.getElementById('admin-name').innerText = localStorage.getItem('crmUsername') || 'Admin';
}

function logout() {
    localStorage.removeItem('crmToken');
    localStorage.removeItem('crmUsername');
    window.location.reload();
}

async function loadLeads() {
    const token = localStorage.getItem('crmToken');
    if (!token) return;

    try {
        // Fetch analytics
        const analyticsRes = await fetch('/api/analytics', {
            headers: { 'Authorization': token }
        });
        const stats = await analyticsRes.json();
        document.getElementById('total-leads').innerText = stats.total || 0;
        document.getElementById('new-leads').innerText = stats.new || 0;
        document.getElementById('contacted-leads').innerText = stats.contacted || 0;
        document.getElementById('converted-leads').innerText = stats.converted || 0;

        // Fetch leads list
        const leadsRes = await fetch('/api/leads', {
            headers: { 'Authorization': token }
        });
        const leads = await leadsRes.json();
        renderLeads(leads);
    } catch (error) {
        console.error('Error loading leads:', error);
        if (error.status === 401 || error.status === 403) logout();
    }
}

function renderLeads(leads) {
    const listBody = document.getElementById('leads-list');
    const loadingMsg = document.getElementById('loading');
    listBody.innerHTML = '';
    loadingMsg.style.display = 'none';

    if (leads.length === 0) {
        listBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 2rem;">No leads found.</td></tr>';
        return;
    }

    leads.forEach(lead => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="font-weight: 600;">${lead.name}</td>
            <td style="font-size: 0.875rem; color: var(--text-muted);">${lead.email}<br>${lead.phone || '-'}</td>
            <td style="font-size: 0.875rem;">${lead.source}</td>
            <td><span class="badge badge-${lead.status}">${lead.status}</span></td>
            <td style="font-size: 0.875rem; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${lead.notes}">${lead.notes || 'No notes'}</td>
            <td style="font-size: 0.875rem; color: var(--text-muted);">${new Date(lead.created_at).toLocaleDateString()}</td>
            <td>
                <button onclick="editLead(${JSON.stringify(lead).replace(/"/g, '&quot;')})" class="btn btn-glass" style="padding: 0.25rem 0.75rem; font-size: 0.75rem;">Edit</button>
            </td>
        `;
        listBody.appendChild(row);
    });
}

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
