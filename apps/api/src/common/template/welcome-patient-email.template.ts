const welcomePatientEmailTemplate = `<h1>¡Bienvenido a VitalPath!</h1>
<p>Hola {{name}},</p>
<p>Tu cuenta ha sido creada exitosamente. A continuación, te compartimos tus credenciales de acceso temporales:</p>
<ul>
  <li><strong>Usuario:</strong> {{email}}</li>
  <li><strong>Contraseña:</strong> {{password}}</li>
</ul>
<p>Te recomendamos cambiar tu contraseña una vez que inicies sesión por primera vez.</p>
<a href="{{loginLink}}">Iniciar sesión</a>
<p>Atentamente,<br>El equipo de VitalPathAI</p>`;

export default welcomePatientEmailTemplate;
