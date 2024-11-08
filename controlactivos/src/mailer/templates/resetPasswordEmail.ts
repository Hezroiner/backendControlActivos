export const resetPasswordEmailTemplate = (
  username: string,
  passwordResetToken: string,
) => {                                                                 //Esto apunta a la vista de reseteo de contraseña en el frontend (React)     
  const RESET_PASSWORD_URL = 'http://localhost:5173/reset-password/'; //Change to your frontend URL on production
  return `
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Restablecer Contraseña</title>
  <style>
    body {
      background-color: #f3f4f6;
      font-family: 'system-ui';
    }

    .container {
      max-width: 32rem;
      margin: 2.5rem auto;
      background-color: #ffffff;
      border-radius: 1rem;
      box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .header {
      background-color: #dc2626;
      color: #ffffff;
      text-align: center;
      padding: 0.5rem;
    }

    .header h1 {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .content {
      padding: 1.5rem;
    }

    .message {
      color: black;
      font-size: 1rem;
      margin-bottom: 1rem;
    }

    .content .action {
      text-align: center;
      margin: 2.5rem 0;
    }

    .content .action a {
      display: inline-block;
      background-color: #dc2626;
      color: #ffffff;
      font-weight: bold;
      padding: 0.75rem 2rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
      text-decoration: none;
    }

    .content .action a:hover {
      transform: scale(1.05);
      background-color: #b91c1c;
    }

    .note {
      color: #6b7280;
      font-size: 0.875rem;
      margin-top: 1rem;
    }

    .footer {
      background-color: #f3f4f6;
      text-align: center;
      padding: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .footer p {
      color: #374151;
      font-size: 0.875rem;
      margin: 0.5rem 0;
    }

    .footer a {
      color: #2563eb;
      font-weight: bold;
      text-decoration: none;
    }

    .footer a:hover {
      text-decoration: underline;
    }

    .footer p.signature {
      color: #6b7280;
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <h1>¡Hola, ${username}!</h1>
    </div>
    <div class="content">
      <p class="message">
        Hemos recibido una solicitud para restablecer tu contraseña. Para continuar, simplemente haz
        clic en el botón
        de abajo.</p>
      <div class="action">
        <a href="${RESET_PASSWORD_URL}${passwordResetToken}">
          Restablecer Contraseña
        </a>
      </div>
      <p class="note">
        Este enlace es válido durante <b>1 hora</b> para mantener tu cuenta segura. Si no solicitaste un
        restablecimiento de contraseña, por favor ignora este mensaje y asegúrate de que tu cuenta esté segura.
      </p>
    </div>
    <div class="footer">
      <p>¿Necesitas más ayuda? Estamos aquí para ti.</p>
      <p>Contáctanos en <a href="mailto:soporte@tudominio.com">soporte@ctphojacha.com</a> y te asistiremos lo antes
        posible.</p>
      <p class="signature">
        Saludos cordiales, <br> El equipo de Soporte Técnico
      </p>
    </div>
  </div>
</body>

</html>

`;
};
