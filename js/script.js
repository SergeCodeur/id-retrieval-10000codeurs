// Configuration
const WEBHOOK_URL = process.env.WEBHOOK_URL;

// Éléments DOM
const form = document.getElementById("id-form");
const emailInput = document.getElementById("email");
const sendMailInput = document.getElementById("sendMail");
const resultDiv = document.getElementById("result");
const resultContent = document.getElementById("result-content");
const submitBtn = document.querySelector(".submit-btn");
const btnText = document.querySelector(".btn-text");

// Création des particules flottantes
function createFloatingParticles() {
  const container = document.querySelector(".floating-particles");
  for (let i = 0; i < 15; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";
    particle.style.width = Math.random() * 4 + 2 + "px";
    particle.style.height = particle.style.width;
    particle.style.animationDelay = Math.random() * 6 + "s";
    particle.style.animationDuration = Math.random() * 3 + 4 + "s";
    container.appendChild(particle);
  }
}

// Fermer le résultat
function closeResult() {
  resultDiv.classList.remove("show");
}

// Afficher le résultat
function showResult(type, message) {
  resultDiv.className = `result ${type} show`;
  resultContent.innerHTML = message;
}

// Gérer la soumission du formulaire
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  // État de chargement
  submitBtn.disabled = true;
  btnText.innerHTML = '<span class="loading-spinner"></span>Recherche...';

  // Masquer le résultat précédent
  closeResult();

  // Afficher le loading
  setTimeout(() => {
    showResult(
      "loading",
      '<div class="loading-spinner"></div><div>Recherche en cours...</div>'
    );
  }, 100);

  // Récupérer les données
  const email = emailInput.value.trim();
  const sendMail = sendMailInput.checked;

  try {
    // Envoyer la requête
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, sendMail }),
    });

    const data = await response.json();

    // Traiter la réponse
    if (data && data.IDUnique) {
      let message = `<div style="font-size: 24px; margin-bottom: 16px;">✅</div>`;
      message += `<div style="font-size: 20px; font-weight: 600; margin-bottom: 12px;">ID trouvé !</div>`;
      message += `<div style="font-size: 24px; font-weight: 700; color: var(--primary); margin-bottom: 16px; padding: 12px; background: var(--primary-light); border-radius: 8px;">${data.IDUnique}</div>`;
      if (sendMail) {
        message += `<div style="font-size: 14px; opacity: 0.8;">📧 Un e-mail de confirmation vous a été envoyé</div>`;
      }
      showResult("success", message);
    } else {
      let message = `<div style="font-size: 24px; margin-bottom: 16px;">❌</div>`;
      message += `<div style="font-size: 20px; font-weight: 600; margin-bottom: 12px;">Adresse non trouvée</div>`;
      message += `<div style="font-size: 16px; line-height: 1.5;">Cette adresse e-mail n'est pas enregistrée dans notre système.</div>`;
      if (data && data.error) {
        message = `<div style="font-size: 24px; margin-bottom: 16px;">⚠️</div><div style="font-size: 18px; font-weight: 600;">${data.message}</div>`;
      }
      showResult("error", message);
    }
  } catch (err) {
    showResult(
      "error",
      `
					<div style="font-size: 24px; margin-bottom: 16px;">⚠️</div>
					<div style="font-size: 20px; font-weight: 600; margin-bottom: 12px;">Erreur technique</div>
					<div style="font-size: 16px; line-height: 1.5;">Une erreur inattendue s'est produite.<br>Veuillez réessayer dans quelques instants.</div>
				`
    );
  } finally {
    // Réinitialiser le bouton
    submitBtn.disabled = false;
    btnText.textContent = "Rechercher mon ID";
  }
});

// Animation au focus de l'input
emailInput.addEventListener("focus", function () {
  this.parentElement.style.transform = "scale(1.02)";
});

emailInput.addEventListener("blur", function () {
  this.parentElement.style.transform = "scale(1)";
});

// Initialisation
document.addEventListener("DOMContentLoaded", function () {
  createFloatingParticles();
});
