import emailjs from '@emailjs/browser';

// Email service for sending confirmation emails
export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// EmailJS Configuration
// Para usar EmailJS, necesitas:
// 1. Crear cuenta en https://www.emailjs.com/
// 2. Crear un servicio de email (Gmail, Outlook, etc.)
// 3. Crear una plantilla
// 4. Obtener tu PUBLIC_KEY, SERVICE_ID y TEMPLATE_ID
const EMAILJS_CONFIG = {
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  TEMPLATE_ID_RECOVERY: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_RECOVERY || '',
  TEMPLATE_ID_REGISTRATION: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_REGISTRATION || ''
};

// Initialize EmailJS
if (EMAILJS_CONFIG.PUBLIC_KEY) {
  emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
}

export interface CyclistEmailData {
  name: string;
  email: string;
  alias?: string;
  password?: string;
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
          <h1>¡Bienvenido a CyclePeaks!</h1>
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
            © ${currentYear} CyclePeaks. Todos los derechos reservados.<br>
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
¡BIENVENIDO A CYCLEPEAKS!

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

© ${new Date().getFullYear()} CyclePeaks. Todos los derechos reservados.
`;

  return text;
};

// Generate HTML email template for password recovery
export const generatePasswordRecoveryEmailHTML = (email: string, recoveryToken: string): string => {
  const currentYear = new Date().getFullYear();
  const recoveryLink = `${window.location.origin}/reset-password?token=${recoveryToken}&email=${encodeURIComponent(email)}`;

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Recuperación de Contraseña - CyclePeaks</title>
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
        .alert-section {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border-radius: 8px;
          padding: 25px;
          margin: 25px 0;
          color: white;
          text-align: center;
        }
        .info-card {
          background-color: #f1f5f9;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #f97316;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          padding: 15px 30px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          margin: 20px 0;
          transition: all 0.3s ease;
          text-align: center;
        }
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(249, 115, 22, 0.3);
        }
        .security-info {
          background-color: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 8px;
          padding: 20px;
          margin: 25px 0;
        }
        .security-info h3 {
          color: #92400e;
          margin-top: 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          color: #64748b;
          font-size: 14px;
        }
        .contact-info {
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
          text-align: center;
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
          <h1>Recuperación de Contraseña</h1>
        </div>

        <div class="alert-section">
          <h2 style="margin-top: 0; font-size: 20px;">🔐 Solicitud de Recuperación</h2>
          <p style="margin-bottom: 0;">
            Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en CyclePeaks.
          </p>
        </div>

        <div class="info-card">
          <h3 style="margin-top: 0; color: #1e293b;">📧 Detalles de la Solicitud</h3>
          <p><strong>Email de la cuenta:</strong> ${email}</p>
          <p><strong>Fecha y hora:</strong> ${new Date().toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Europe/Madrid'
          })}</p>
          <p><strong>IP de origen:</strong> [Protegida por seguridad]</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <p style="font-size: 18px; color: #1e293b; margin-bottom: 20px;">
            <strong>Para restablecer tu contraseña, haz clic en el siguiente enlace:</strong>
          </p>
          
          <a href="${recoveryLink}" class="cta-button">
            🔑 Restablecer Mi Contraseña
          </a>
          
          <p style="font-size: 14px; color: #64748b; margin-top: 15px;">
            O copia y pega este enlace en tu navegador:<br>
            <code style="background-color: #f1f5f9; padding: 5px 10px; border-radius: 4px; word-break: break-all;">
              ${recoveryLink}
            </code>
          </p>
        </div>

        <div class="security-info">
          <h3>🛡️ Información de Seguridad</h3>
          <ul style="margin: 0; padding-left: 20px;">
            <li><strong>Validez:</strong> Este enlace expirará en 24 horas por seguridad</li>
            <li><strong>Uso único:</strong> Solo puede utilizarse una vez</li>
            <li><strong>Seguridad:</strong> Si no solicitaste este cambio, ignora este email</li>
            <li><strong>Protección:</strong> Tu cuenta permanece segura hasta que uses el enlace</li>
          </ul>
        </div>

        <div class="info-card">
          <h3 style="margin-top: 0; color: #1e293b;">❓ ¿No Solicitaste Este Cambio?</h3>
          <p>
            Si no solicitaste restablecer tu contraseña, puedes ignorar este email de forma segura. 
            Tu cuenta permanece protegida y no se realizarán cambios.
          </p>
          <p>
            <strong>Recomendación:</strong> Si recibes estos emails frecuentemente sin solicitarlos, 
            contacta con nuestro equipo de soporte inmediatamente.
          </p>
        </div>

        <div class="contact-info">
          <h3 style="color: #1e293b; margin-top: 0;">📞 Soporte Técnico</h3>
          <p><strong>Email de soporte:</strong> support@cyclepeaks.com</p>
          <p><strong>Email de seguridad:</strong> security@cyclepeaks.com</p>
          <p><strong>Horario:</strong> Lunes a Viernes, 9:00 - 18:00 (CET)</p>
        </div>

        <div class="footer">
          <p><strong>CyclePeaks - Conquista los Puertos Más Famosos del Mundo</strong></p>
          <p>
            Este email fue enviado desde una dirección no monitoreada. Para soporte, 
            utiliza los canales oficiales mencionados arriba.
          </p>
          <p style="margin-top: 20px; font-size: 12px; color: #94a3b8;">
            © ${currentYear} CyclePeaks. Todos los derechos reservados.<br>
            Email enviado por el sistema de recuperación de contraseñas.<br>
            <strong>Remitente:</strong> recovery@cyclepeaks.com
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate plain text version for password recovery
export const generatePasswordRecoveryEmailText = (email: string, recoveryToken: string): string => {
  const recoveryLink = `${window.location.origin}/reset-password?token=${recoveryToken}&email=${encodeURIComponent(email)}`;
  
  return `
CYCLEPEAKS - RECUPERACIÓN DE CONTRASEÑA

Hola,

Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en CyclePeaks.

DETALLES DE LA SOLICITUD:
- Email de la cuenta: ${email}
- Fecha y hora: ${new Date().toLocaleString('es-ES')}
- Estado: Pendiente de confirmación

PARA RESTABLECER TU CONTRASEÑA:
Haz clic en el siguiente enlace o cópialo en tu navegador:

${recoveryLink}

INFORMACIÓN DE SEGURIDAD:
✓ Este enlace expirará en 24 horas
✓ Solo puede utilizarse una vez
✓ Si no solicitaste este cambio, ignora este email
✓ Tu cuenta permanece segura hasta que uses el enlace

¿NO SOLICITASTE ESTE CAMBIO?
Si no solicitaste restablecer tu contraseña, puedes ignorar este email de forma segura. 
Tu cuenta permanece protegida y no se realizarán cambios.

SOPORTE TÉCNICO:
- Email de soporte: support@cyclepeaks.com
- Email de seguridad: security@cyclepeaks.com
- Horario: Lunes a Viernes, 9:00 - 18:00 (CET)

---
CyclePeaks - Conquista los Puertos Más Famosos del Mundo
© ${new Date().getFullYear()} CyclePeaks. Todos los derechos reservados.

Este email fue enviado desde: recovery@cyclepeaks.com
Email enviado por el sistema de recuperación de contraseñas.
`;
};

// Generate recovery token
export const generateRecoveryToken = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

// Send password recovery email
export const sendPasswordRecoveryEmail = async (email: string): Promise<boolean> => {
  try {
    // Check if email exists in the system
    const cyclists = JSON.parse(localStorage.getItem('mountain-pass-cyclists') || '[]');
    const cyclistExists = cyclists.some((c: any) => c.email.toLowerCase() === email.toLowerCase());

    if (!cyclistExists) {
      throw new Error('Email no registrado');
    }

    // Generate recovery token
    const recoveryToken = generateRecoveryToken();

    // Store recovery token with expiration (24 hours)
    const recoveryData = {
      email,
      token: recoveryToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      used: false,
      createdAt: new Date().toISOString()
    };

    // Store in localStorage (in production, this would be in database)
    const existingTokens = JSON.parse(localStorage.getItem('recovery-tokens') || '[]');
    // Remove old tokens for this email
    const filteredTokens = existingTokens.filter((t: any) => t.email !== email);
    filteredTokens.push(recoveryData);
    localStorage.setItem('recovery-tokens', JSON.stringify(filteredTokens));

    const recoveryLink = `${window.location.origin}/?token=${recoveryToken}&email=${encodeURIComponent(email)}`;

    // Try to send real email with EmailJS if configured
    if (EMAILJS_CONFIG.PUBLIC_KEY && EMAILJS_CONFIG.SERVICE_ID && EMAILJS_CONFIG.TEMPLATE_ID_RECOVERY) {
      try {
        const templateParams = {
          to_email: email,
          to_name: email.split('@')[0],
          recovery_link: recoveryLink,
          token: recoveryToken,
          expiry_hours: '24'
        };

        await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID_RECOVERY,
          templateParams
        );

        console.log('✅ Email real enviado con EmailJS');

        // Store email log
        const emailLog = {
          id: Date.now().toString(),
          from: 'CyclePeaks',
          to: email,
          subject: '🔐 CyclePeaks - Recuperación de Contraseña',
          sentAt: new Date().toISOString(),
          type: 'password_recovery',
          status: 'sent',
          method: 'emailjs',
          token: recoveryToken
        };

        const existingLogs = JSON.parse(localStorage.getItem('email-logs') || '[]');
        existingLogs.push(emailLog);
        localStorage.setItem('email-logs', JSON.stringify(existingLogs));

        return true;
      } catch (emailError) {
        console.error('❌ Error enviando email con EmailJS:', emailError);
        // Continue with console log fallback
      }
    }

    // Fallback: Display in console (for development)
    console.log('📧 ============================================');
    console.log('🔐 EMAIL DE RECUPERACIÓN DE CONTRASEÑA');
    console.log('📧 ============================================');
    console.log('Para:', email);
    console.log('Asunto: 🔐 CyclePeaks - Recuperación de Contraseña');
    console.log('');
    console.log('Enlace de recuperación:');
    console.log(recoveryLink);
    console.log('');
    console.log('Token:', recoveryToken);
    console.log('Válido por: 24 horas');
    console.log('📧 ============================================');
    console.log('');
    console.log('⚠️  NOTA: Para recibir emails reales, configura EmailJS:');
    console.log('1. Crea cuenta en https://www.emailjs.com/');
    console.log('2. Configura un servicio de email');
    console.log('3. Crea una plantilla con las variables:');
    console.log('   - to_email, to_name, recovery_link, token, expiry_hours');
    console.log('4. Añade las credenciales al archivo .env:');
    console.log('   VITE_EMAILJS_PUBLIC_KEY=tu_public_key');
    console.log('   VITE_EMAILJS_SERVICE_ID=tu_service_id');
    console.log('   VITE_EMAILJS_TEMPLATE_ID_RECOVERY=tu_template_id');
    console.log('');

    // Store email log for admin purposes
    const emailLog = {
      id: Date.now().toString(),
      from: 'recovery@cyclepeaks.com',
      to: email,
      subject: '🔐 CyclePeaks - Recuperación de Contraseña',
      sentAt: new Date().toISOString(),
      type: 'password_recovery',
      status: 'console_only',
      method: 'console',
      token: recoveryToken,
      link: recoveryLink
    };

    const existingLogs = JSON.parse(localStorage.getItem('email-logs') || '[]');
    existingLogs.push(emailLog);
    localStorage.setItem('email-logs', JSON.stringify(existingLogs));

    return true;
  } catch (error) {
    console.error('❌ Error enviando email de recuperación:', error);

    // Store failed email log
    const emailLog = {
      id: Date.now().toString(),
      from: 'recovery@cyclepeaks.com',
      to: email,
      subject: '🔐 CyclePeaks - Recuperación de Contraseña',
      sentAt: new Date().toISOString(),
      type: 'password_recovery',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };

    const existingLogs = JSON.parse(localStorage.getItem('email-logs') || '[]');
    existingLogs.push(emailLog);
    localStorage.setItem('email-logs', JSON.stringify(existingLogs));

    return false;
  }
};

// Mock email sending function (in a real app, this would integrate with an email service)
export const sendRegistrationEmail = async (cyclist: CyclistEmailData): Promise<boolean> => {
  try {
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const emailData: EmailData = {
      to: cyclist.email,
      subject: '🏔️ ¡Bienvenido a CyclePeaks! - Registro Confirmado',
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
      subject: '🏔️ ¡Bienvenido a CyclePeaks! - Registro Confirmado',
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