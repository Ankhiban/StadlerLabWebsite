async function loadTargets() {
    try {
      const response = await fetch('/api/targets');
      const targets = await response.json();
      
      const tableBody = document.querySelector('#targets-table');
      tableBody.innerHTML = `
        <tr>
          <th>Disease</th>
          <th>Number of Assays</th>
        </tr>
      `;
      
      targets.forEach(target => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><a href="target.html?name=${encodeURIComponent(target.name)}">${target.name}</a></td>
          <td>${target.assays.length}</td>
        `;
        tableBody.appendChild(row);
      });
    } catch (err) {
      console.error('Error loading targets:', err);
    }
  }