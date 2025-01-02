async function loadTargetDetails() {
  try {
      const urlParams = new URLSearchParams(window.location.search);
      const targetName = urlParams.get('name');
      
      const response = await fetch(`/api/targets/${encodeURIComponent(targetName)}`);
      const primers = await response.json();
      
      // Update page title
      document.querySelector('.maintext h1').textContent = targetName;
      document.title = targetName;
      
      // Create accordion sections for each primer
      const container = document.querySelector('#assays-container');
      container.innerHTML = '';
      
      primers.forEach((primer) => {
          const button = document.createElement('button');
          button.className = 'accordion';
          button.textContent = `${primer.name} - ${primer.reference} - ${primer.type}`;
          
          const panel = document.createElement('div');
          panel.className = 'panel';
          panel.innerHTML = `
              <p>Forward Primer: ${primer.forwardPrimer}</p>
              <p>Length: ${primer.forwardPrimerLength}</p>
              <p>Reverse Primer: ${primer.reversePrimer}</p>
              <p>Length: ${primer.reversePrimerLength}</p>
              <p>Probe: ${primer.probe}</p>
              <p>Length: ${primer.probeLength}</p>
              <p>Notes: ${primer.notes}</p>
          `;
          
          container.appendChild(button);
          container.appendChild(panel);
      });
      
      // Initialize accordion functionality
      const acc = document.getElementsByClassName("accordion");
      for (let i = 0; i < acc.length; i++) {
          acc[i].addEventListener("click", function() {
              this.classList.toggle("active");
              const panel = this.nextElementSibling;
              if (panel.style.display === "block") {
                  panel.style.display = "none";
              } else {
                  panel.style.display = "block";
              }
          });
      }
  } catch (err) {
      console.error('Error loading target details:', err);
  }
}

document.addEventListener('DOMContentLoaded', loadTargetDetails);