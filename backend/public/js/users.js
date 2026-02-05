const API_URL = 'http://localhost:4000';
const token = localStorage.getItem('token');
const btnBlock = document.getElementById('btnBlock');
const btnUnblock = document.getElementById('btnUnblock');
const btnDelete = document.getElementById('btnDelete');



if (!token) {
  window.location.href = 'index.html';
}
fetch(`${API_URL}/users`, {
  headers: {
    Authorization: 'Bearer ' + token
  }
})
.then(res => {
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
    return;
  }
  return res.json();
})
.then(users => {
  if (users) renderTable(users);
});

function formatLastSeen(dateString) {
  if (!dateString) return '-';

  const last = new Date(dateString);
  const now = new Date();
  const diffMs = now - last;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  let text = '';

  if (seconds < 60) {
    text = 'less than a minute ago';
  } else if (minutes < 60) {
    text = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (hours < 24) {
    text = `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (days < 7) {
    text = `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    text = `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }

  return {
    text,
    full: last.toLocaleString()
  };
}


 // IMPORTANT: render users table
 function renderTable(users) {
  const tbody = document.querySelector('tbody');
  tbody.innerHTML = '';

  users.forEach(u => {
    const lastSeen = formatLastSeen(u.last_login);
  
    tbody.innerHTML += `
      <tr>
        <td>
          <input type="checkbox" class="user-checkbox" value="${u.id}">
        </td>
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>${
          u.status === 'blocked'
          ? '<span class="badge bg-danger">Blocked</span>'
          : u.status === 'unverified'
            ? '<span class="badge bg-secondary">Unverified</span>'
            : '<span class="badge bg-success">Active</span>'
          }
        </td>
        <td>
          ${
            lastSeen === '-'
              ? '-'
              : `<span title="${lastSeen.full}">
                   ${lastSeen.text}
                 </span>`
          }
        </td>
      </tr>
    `;
  });
}


// IMPORTANT: get selected ids
function getSelectedIds() {
  return Array.from(
    document.querySelectorAll('.user-checkbox:checked')
  ).map(cb => cb.value);
}
document.getElementById('btnBlock').addEventListener('click', () => {
  const ids = getSelectedIds();

  fetch(`${API_URL}/users/block`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    },
    body: JSON.stringify({ ids })
  }).then(() => location.reload());
});

document.getElementById('btnDelete').addEventListener('click', () => {
  const ids = getSelectedIds();

  fetch(`${API_URL}/users`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    },
    body: JSON.stringify({ ids })
  }).then(() => location.reload());
});


document.getElementById('selectAll').addEventListener('change', e => {
  document.querySelectorAll('.user-checkbox')
    .forEach(cb => cb.checked = e.target.checked);
});

function updateToolbar() {
  const selected = getSelectedIds().length > 0;

  btnBlock.disabled = !selected;
  btnUnblock.disabled = !selected;
  btnDelete.disabled = !selected;
}

document.addEventListener('change', e => {
  if (e.target.classList.contains('user-checkbox') || e.target.id === 'selectAll') {
    updateToolbar();
  }
});

let isAsc = false;

document.getElementById('sortLastLogin').addEventListener('click', () => {
  isAsc = !isAsc;

  fetch(`${API_URL}/users?sort=last_login&order=${isAsc ? 'asc' : 'desc'}`, {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })
    .then(res => res.json())
    .then(renderTable);
});


btnUnblock.addEventListener('click', () => {
  const ids = getSelectedIds();

  fetch(`${API_URL}/users/unblock`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    },
    body: JSON.stringify({ ids })
  }).then(() => location.reload());
});

