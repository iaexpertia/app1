// Email service for sending confirmation emails
export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface CyclistEmailData {
  name: string;
  email: string;
  alias?: string;
  registrationDate: string;
  bikes: Array<{
    brand: string;
    model: string;
    type: string;
    year?: number;
  }>;
}

// Generate HTML email template for cyclist registration
export const generateRegistrationEmailHTML = (cyclist: CyclistEmailData): string => {
  const currentYear = new Date().getFullYear();
  const formattedDate = new Date(cyclist.registrationDate).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenido a Puertos Conquistados</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #334155;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
        }
        .container {
          background-color: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .logo svg {
          width: 30px;
          height: 30px;
          color: white;
        }
        h1 {
          color: #1e293b;
          margin: 0;
          font-size: 28px;
          font-weight: 700;
        }
        .welcome-text {
          font-size: 18px;
          color: #64748b;
          margin: 20px 0;
        }
        .info-card {
          background-color: #f1f5f9;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #f97316;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          margin: 8px 0;
          padding: 4px 0;
        }
        .info-label {
          font-weight: 600;
          color: #475569;
        }
        .info-value {
          color: #1e293b;
        }
        .bikes-section {
          margin: 25px 0;
        }
        .bike-item {
          background-color: white;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 15px;
          margin: 10px 0;
        }
        .bike-name {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 5px;
        }
        .bike-details {
          font-size: 14px;
          color: #64748b;
        }
        .cta-section {
          text-align: center;
          margin: 30px 0;
          padding: 25px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          border-radius: 8px;
          color: white;
        }
        .cta-button {
          display: inline-block;
          background-color: white;
          color: #f97316;
          padding: 12px 24px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          margin-top: 15px;
          transition: all 0.3s ease;
        }
        .cta-button:hover {
          background-color: #f8fafc;
          transform: translateY(-1px);
        }
        .features {
          margin: 25px 0;
        }
        .feature-item {
          display: flex;
          align-items: center;
          margin: 12px 0;
          padding: 8px 0;
        }
        .feature-icon {
          width: 20px;
          height: 20px;
          background-color: #f97316;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          flex-shrink: 0;
        }
        .feature-text {
          color: #475569;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          color: #64748b;
          font-size: 14px;
        }
        .social-links {
          margin: 15px 0;
        }
        .social-links a {
          color: #f97316;
          text-decoration: none;
          margin: 0 10px;
        }
        @media (max-width: 600px) {
          body {
            padding: 10px;
          }
          .container {
            padding: 20px;
          }
          h1 {
            font-size: 24px;
          }
          .info-row {
            flex-direction: column;
          }
          .info-label {
            margin-bottom: 2px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
            </svg>
          </div>
          <h1>¡Bienvenido a Puertos Conquistados!</h1>
          <p class="welcome-text">Tu registro ha sido confirmado exitosamente</p>
        </div>

        <div class="info-card">
          <h3 style="margin-top: 0; color: #1e293b;">📋 Información de Registro</h3>
          <div class="info-row">
            <span class="info-label">👤 Nombre:</span>
            <span class="info-value">${cyclist.name}</span>
          </div>
          ${cyclist.alias ? `
          <div class="info-row">
            <span class="info-label">🏷️ Alias:</span>
            <span class="info-value">${cyclist.alias}</span>
          </div>
          ` : ''}
          <div class="info-row">
            <span class="info-label">📧 Email:</span>
            <span class="info-value">${cyclist.email}</span>
          </div>
          <div class="info-row">
            <span class="info-label">📅 Fecha de registro:</span>
            <span class="info-value">${formattedDate}</span>
          </div>
        </div>

        ${cyclist.bikes.length > 0 ? `
        <div class="bikes-section">
          <h3 style="color: #1e293b;">🚴‍♂️ Tus Bicicletas Registradas</h3>
          ${cyclist.bikes.map(bike => `
            <div class="bike-item">
              <div class="bike-name">${bike.brand} ${bike.model}</div>
              <div class="bike-details">
                Tipo: ${bike.type}${bike.year ? ` • Año: ${bike.year}` : ''}
              </div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        <div class="cta-section">
          <h3 style="margin-top: 0;">🏔️ ¡Comienza tu aventura!</h3>
          <p>Ya puedes empezar a conquistar los puertos de montaña más famosos del mundo</p>
          <a href="#" class="cta-button">Explorar Puertos</a>
        </div>

        <div class="features">
          <h3 style="color: #1e293b;">✨ ¿Qué puedes hacer ahora?</h3>
          
          <div class="feature-item">
            <div class="feature-icon">
              <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <span class="feature-text">Marcar puertos como conquistados</span>
          </div>
          
          <div class="feature-item">
            <div class="feature-icon">
              <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <span class="feature-text">Subir fotos de tus conquistas</span>
          </div>
          
          <div class="feature-item">
            <div class="feature-icon">
              <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
                <path d="M9 11H7v8a2 2 0 002 2h8a2 2 0 002-2v-8h-2m-4-4V3a1 1 0 00-1-1h-2a1 1 0 00-1 1v4"/>
              </svg>
            </div>
            <span class="feature-text">Ver tus estadísticas de progreso</span>
          </div>
          
          <div class="feature-item">
            <div class="feature-icon">
              <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              </svg>
            </div>
            <span class="feature-text">Explorar puertos en el mapa interactivo</span>
          </div>
          
          <div class="feature-item">
            <div class="feature-icon">
              <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <span class="feature-text">Añadir notas personales a tus rutas</span>
          </div>
        </div>

        <div class="footer">
          <p><strong>¡Gracias por unirte a nuestra comunidad de ciclistas!</strong></p>
          <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
          
          <div class="social-links">
            <a href="#">📧 Soporte</a>
            <a href="#">🌐 Web</a>
            <a href="#">📱 App</a>
          </div>
          
          <p style="margin-top: 20px; font-size: 12px; color: #94a3b8;">
            © ${currentYear} Puertos Conquistados. Todos los derechos reservados.<br>
            Este email fue enviado porque te registraste en nuestra plataforma.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate plain text version for email clients that don't support HTML
export const generateRegistrationEmailText = (cyclist: CyclistEmailData): string => {
  const formattedDate = new Date(cyclist.registrationDate).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let text = `
¡BIENVENIDO A PUERTOS CONQUISTADOS!

Hola ${cyclist.name},

Tu registro ha sido confirmado exitosamente. ¡Ya formas parte de nuestra comunidad de conquistadores de puertos de montaña!

INFORMACIÓN DE REGISTRO:
- Nombre: ${cyclist.name}
${cyclist.alias ? `- Alias: ${cyclist.alias}\n` : ''}- Email: ${cyclist.email}
- Fecha de registro: ${formattedDate}
`;

  if (cyclist.bikes.length > 0) {
    text += `\nTUS BICICLETAS REGISTRADAS:\n`;
    cyclist.bikes.forEach((bike, index) => {
      text += `${index + 1}. ${bike.brand} ${bike.model} (${bike.type}${bike.year ? `, ${bike.year}` : ''})\n`;
    });
  }

  text += `
¿QUÉ PUEDES HACER AHORA?
✓ Marcar puertos como conquistados
✓ Subir fotos de tus conquistas  
✓ Ver tus estadísticas de progreso
✓ Explorar puertos en el mapa interactivo
✓ Añadir notas personales a tus rutas

¡Comienza tu aventura y conquista los puertos más famosos del mundo!

---
Gracias por unirte a nuestra comunidad de ciclistas.
Si tienes alguna pregunta, no dudes en contactarnos.

© ${new Date().getFullYear()} Puertos Conquistados. Todos los derechos reservados.
`;

  return text;
};

// Mock email sending function (in a real app, this would integrate with an email service)
export const sendRegistrationEmail = async (cyclist: CyclistEmailData): Promise<boolean> => {
  try {
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const emailData: EmailData = {
      to: cyclist.email,
      subject: '🏔️ ¡Bienvenido a Puertos Conquistados! - Registro Confirmado',
      html: generateRegistrationEmailHTML(cyclist),
      text: generateRegistrationEmailText(cyclist)
    };

    // In a real application, you would integrate with:
    // - EmailJS for client-side email sending
    // - SendGrid, Mailgun, or similar service
    // - Your own backend email service
    
    console.log('📧 Email enviado exitosamente:', {
      to: emailData.to,
      subject: emailData.subject,
      timestamp: new Date().toISOString()
    });

    // Store email log for admin purposes
    const emailLog = {
      id: Date.now().toString(),
      to: cyclist.email,
      subject: emailData.subject,
      sentAt: new Date().toISOString(),
      type: 'registration_confirmation',
      status: 'sent'
    };

    const existingLogs = JSON.parse(localStorage.getItem('email-logs') || '[]');
    existingLogs.push(emailLog);
    localStorage.setItem('email-logs', JSON.stringify(existingLogs));

    return true;
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    
    // Store failed email log
    const emailLog = {
      id: Date.now().toString(),
      to: cyclist.email,
      subject: '🏔️ ¡Bienvenido a Puertos Conquistados! - Registro Confirmado',
      sentAt: new Date().toISOString(),
      type: 'registration_confirmation',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };

    const existingLogs = JSON.parse(localStorage.getItem('email-logs') || '[]');
    existingLogs.push(emailLog);
    localStorage.setItem('email-logs', JSON.stringify(existingLogs));

    return false;
  }
};

// Get email logs for admin panel
export const getEmailLogs = () => {
  return JSON.parse(localStorage.getItem('email-logs') || '[]');
};

// Clear email logs
export const clearEmailLogs = () => {
  localStorage.removeItem('email-logs');
};