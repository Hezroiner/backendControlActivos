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
      background-color: #e0e8f9;
      font-family: Arial, sans-serif;
    }

    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #d1d5db;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    }

    .header {
      background-color: #0047b3;
      color: #ffffff;
      text-align: center;
      padding: 20px;
    }

    .header h1 {
      font-size: 1.8rem;
      margin: 0;
      font-weight: normal;
    }

    .content {
      padding: 20px;
      color: #333333;
      font-size: 1rem;
    }

    .content p {
      line-height: 1.6;
    }

    .button {
      display: block;
      width: 100%;
      text-align: center;
      margin: 20px 0;
    }

    .button a {
      background-color: #0047b3;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 6px;
      text-decoration: none;
      font-size: 1rem;
      font-weight: bold;
    }

    .button a:hover {
      background-color: #0038a0;
    }

    .note {
      color: #6b7280;
      font-size: 0.875rem;
      margin-top: 10px;
      text-align: center;
    }

    .footer {
      background-color: #f9fafb;
      text-align: center;
      padding: 15px;
      color: #4b5563;
      font-size: 0.875rem;
      border-top: 1px solid #e5e7eb;
    }

    .footer a {
      color: #0047b3;
      text-decoration: none;
    }

    .footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <h1>¡Hola, ${username}!</h1>
    </div>
    <div class="content">
      <p>
        Hemos recibido una solicitud para restablecer tu contraseña. Haz click en el botón que aparece a continuación para cambiar tu contraseña.
      </p>
      <div class="button">
        <a href="${RESET_PASSWORD_URL}${passwordResetToken}">
          Restablecer Contraseña
        </a>
      </div>
      <p class="note">
        Este enlace es válido durante <strong>1 hora</strong> para mantener tu cuenta segura. Si tu no realizaste esta solicitud de restablecimiento de contraseña, solo ignora este mensaje.
      </p>
    </div>
    <div class="footer">
      <p>¿Necesitas ayuda? Contáctanos en <a href="mailto:soporte@ctphojacha.com">soporte@ctphojacha.com</a>.</p>
      <p>Saludos cordiales, <br> El equipo de Soporte Técnico</p>
    </div>
  </div>
</body>

</html>
  `;
};