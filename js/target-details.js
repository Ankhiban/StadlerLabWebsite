async function loadTargetDetails() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const targetName = urlParams.get('name');
      
      const response = await fetch(`/api/targets/${encodeURIComponent(targetName)}`);
      const target = await response.json();
      
      // Update page title
      document.querySelector('.maintext h1').textContent = target.name;
      document.title = target.name;
      
      // Create accordion sections for each assay
      const container = document.querySelector('#assays-container');
      container.innerHTML = '';
      
      target.assays.forEach((assay, index) => {
        const button = document.createElement('button');
        button.className = 'accordion';
        button.textContent = `${assay.name} - ${assay.reference} - ${assay.type}`;
        
        const panel = document.createElement('div');
        panel.className = 'panel';
        panel.innerHTML = `
          <p>Forward Primer: ${assay.forwardPrimer}</p>
          <p>Length: ${assay.forwardPrimerLength}</p>
          <p>Reverse Primer: ${assay.reversePrimer}</p>
          <p>Length: ${assay.reversePrimerLength}</p>
          <p>Probe: ${assay.probe}</p>
          <p>Length: ${assay.probeLength}</p>
          <p>Notes: ${assay.notes}</p>
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