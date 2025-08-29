// Gestion de l'écran de chargement - Version mise à jour

// Animation de l'image et des logos au scroll
function setupImageAnimation() {
    const imageContainer = document.querySelector('.funnel-image-container');
    const section = document.querySelector('.realisation');
    
    if (!imageContainer || !section) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Déclencher l'animation de l'image
                const image = imageContainer.querySelector('.funnel-image');
                if (image) {
                    image.style.animation = 'imageAppear 1.5s ease-out forwards';
                }
                
                // Faire apparaître les logos immédiatement
                const logos = imageContainer.querySelectorAll('.logo-item');
                logos.forEach((logo, index) => {
                    setTimeout(() => {
                        logo.style.opacity = '1';
                    }, 1000 + (index * 100)); // Délai après l'apparition de l'image
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });
    
    observer.observe(section);
}


function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const percentageElement = document.querySelector('.loading-percentage');
    
    let currentPercentage = 0;
    const targetPercentage = 100;
    const duration = 3000; // 3 secondes
    const interval = 50; // Mise à jour toutes les 50ms
    const increment = (targetPercentage * interval) / duration;
    
    // Animation du pourcentage
    const percentageInterval = setInterval(() => {
        currentPercentage += increment;
        if (currentPercentage >= targetPercentage) {
            currentPercentage = targetPercentage;
            clearInterval(percentageInterval);
        }
        if (percentageElement) {
            percentageElement.textContent = Math.round(currentPercentage) + '%';
        }
    }, interval);
    
    // Initialiser le pourcentage à 0
    if (percentageElement) {
        percentageElement.textContent = '0%';
    }
    
    // Attendre que la barre de chargement soit terminée (3s)
    setTimeout(() => {
        // Masquer l'écran de chargement
        loadingScreen.classList.add('hidden');
        
        // Afficher le contenu principal
        mainContent.classList.add('visible');
        
        // Afficher le bouton WhatsApp après le chargement
        const whatsappBubble = document.querySelector('.whatsapp-bubble');
        if (whatsappBubble) {
            whatsappBubble.classList.add('visible');
        }
        
        // Démarrer toutes les animations de la page
        setTimeout(() => {
            animateTitle();
            setupNavAnimations();
            setupScrollGlow();
            setupNavigationTransparency();
            setupSectionTitleAnimation();
            setupAutoStepChange();
        }, 500);
        
    }, 3500); // 3.5s pour laisser le temps à la barre de se remplir
}

// Animation du titre lettre par lettre
function animateTitle() {
    const title = document.getElementById('animated-title');
    if (!title) return;
    
    // Préserver les sauts de ligne HTML
    const originalHTML = title.innerHTML;
    title.innerHTML = '';
    
    // Traiter chaque nœud (texte et balises)
    const walker = document.createTreeWalker(
        document.createElement('div'),
        NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
        null,
        false
    );
    
    // Créer un div temporaire pour parser le HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = originalHTML;
    
    let charIndex = 0;
    
    function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            // Traiter le texte caractère par caractère
            node.textContent.split('').forEach((char) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.className = 'char';
                span.style.animationDelay = `${charIndex * 0.05}s`;
                title.appendChild(span);
                charIndex++;
            });
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
            // Préserver les sauts de ligne
            const br = document.createElement('br');
            title.appendChild(br);
        }
    }
    
    // Traiter tous les nœuds enfants
    Array.from(tempDiv.childNodes).forEach(processNode);
}

// Animation des liens de navigation au survol
function setupNavAnimations() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const originalText = link.textContent;
        
        link.addEventListener('mouseenter', function() {
            // Créer les spans pour chaque lettre
            const chars = originalText.split('').map((char, index) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.className = 'nav-char';
                span.style.animationDelay = `${index * 0.03}s`;
                return span;
            });
            
            // Vider et remplir le lien
            this.innerHTML = '';
            chars.forEach(span => this.appendChild(span));
        });
        
        link.addEventListener('mouseleave', function() {
            // Restaurer le texte original
            this.textContent = originalText;
        });
    });
}

// Animation du titre de section supprimée
function setupSectionTitleAnimation() {
    // Fonction vide - animation supprimée
}

// Navigation simple par clic sur les points
function setupAutoStepChange() {
    // Fonction vide - navigation par clic uniquement
}

// Animation de lueur pour le CTA au scroll
function setupScrollGlow() {
    const ctaButton = document.querySelector('.cta-button');
    let glowActivated = false;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Activer la lueur quand l'utilisateur scroll vers le bas
        if (scrollTop > 200 && !glowActivated) {
            glowActivated = true;
            ctaButton.classList.add('scroll-glow');
        }
        
        // Désactiver la lueur si l'utilisateur remonte en haut
        if (scrollTop < 100 && glowActivated) {
            glowActivated = false;
            ctaButton.classList.remove('scroll-glow');
        }
    });
}

// Maintenir la navigation transparente pendant le scroll
function setupNavigationTransparency() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Garder la navigation transparente en permanence
        navbar.style.background = 'transparent';
    });
}

// Fonction pour ouvrir WhatsApp
function openWhatsApp() {
    // Numéro WhatsApp de l'utilisateur (format international français)
    const phoneNumber = "33786080164";
    const message = "Bonjour ! Je suis intéressé par vos services de landing pages.";
    
    // Format plus robuste pour WhatsApp
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    try {
        window.open(whatsappUrl, '_blank');
    } catch (error) {
        // Fallback si l'ouverture échoue
        window.location.href = whatsappUrl;
    }
}

// Fonction pour gérer le formulaire d'email
function setupEmailForm() {
    const emailForm = document.getElementById('emailForm');
    const emailFormDuplicate = document.getElementById('emailFormDuplicate');
    
    // Configuration Zapier Webhook
    const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/24023906/u44t3lf/';
    
    function handleFormSubmit(form, phoneId) {
        const confirmationMsg = document.createElement('div');
        confirmationMsg.className = 'confirmation-message';
        confirmationMsg.style.marginTop = '2rem';
        confirmationMsg.style.fontSize = '1.2rem';
        confirmationMsg.style.color = '#1a1a1a';
        confirmationMsg.style.textAlign = 'center';
        confirmationMsg.style.fontWeight = '500';
        
        const phone = document.getElementById(phoneId).value;
        const submitBtn = form.querySelector('.submit-btn');
        const phoneRegex = /^(\+33|0)[1-9](\d{8})$/;
        
        if (phone && phoneRegex.test(phone.replace(/\s/g, ''))) {
            submitBtn.classList.add('slide-out');
            
            // Envoi AJAX à Zapier avec données enrichies
            const formData = {
                phone: phone,
                source: 'leadscale-landing',
                timestamp: new Date().toISOString(),
                utm_source: getUrlParameter('utm_source') || 'direct',
                utm_medium: getUrlParameter('utm_medium') || 'organic'
            };
            
            fetch(ZAPIER_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(response => {
                setTimeout(() => {
                    submitBtn.classList.remove('slide-out');
                    form.reset();
                    confirmationMsg.textContent = 'Merci ! Votre numéro a été enregistré. Nous vous contacterons bientôt sur WhatsApp !';
                    form.parentNode.appendChild(confirmationMsg);
                    form.style.display = 'none';
                }, 800);
            })
            .catch(error => {
                console.error('Erreur Zapier:', error);
                setTimeout(() => {
                    submitBtn.classList.remove('slide-out');
                    confirmationMsg.textContent = "Une erreur est survenue. Veuillez réessayer.";
                    form.parentNode.appendChild(confirmationMsg);
                }, 800);
            });
        } else {
            alert('Veuillez entrer un numéro de téléphone français valide (ex: 0612345678 ou +33612345678)');
        }
    }
    
    // Gestion du premier formulaire
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(emailForm, 'phone');
        });
    }
    
    // Gestion du formulaire dupliqué
    if (emailFormDuplicate) {
        emailFormDuplicate.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(emailFormDuplicate, 'phone-duplicate');
        });
    }
}

// Fonction pour récupérer les paramètres URL
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Fonction pour afficher les étapes de la méthode
function showStep(stepNumber) {
    // Masquer tous les contenus d'étapes
    const stepContents = document.querySelectorAll('.step-content');
    stepContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Retirer la classe active de tous les cercles
    const stepCircles = document.querySelectorAll('.step-circle');
    stepCircles.forEach(circle => {
        circle.classList.remove('active');
    });
    
    // Afficher le contenu de l'étape sélectionnée
    const selectedContent = document.querySelector(`.step-${stepNumber}-content`);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }
    
    // Activer le cercle correspondant
    const selectedCircle = document.querySelector(`.step-${stepNumber}`);
    if (selectedCircle) {
        selectedCircle.classList.add('active');
    }
}

// Fonction pour gérer l'ouverture/fermeture des FAQ
function toggleFAQ(faqNumber) {
    const faqItem = document.querySelector(`#faq-answer-${faqNumber}`).parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Fermer toutes les autres FAQ
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Ouvrir/fermer la FAQ cliquée
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Initialisation quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    initLoadingScreen(); // Ajouter l'appel à la fonction de chargement
    
    // Smooth scrolling pour les liens de navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Toggle menu mobile
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Fermer le menu mobile en cliquant sur un lien
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Setup du formulaire d'email
    setupEmailForm();
    
    // Setup de l'animation de l'image
    setupImageAnimation();
}); 