const recoverPasswordEmailTemplate = `<h1>Recuperar contraseña</h1>
<p>Hola {{name}},</p>
<p>Haz click en el siguiente enlace:</p>
<a href="{{resetLink}}">Cambiar contraseña</a>
<p>Este enlace expirará en 15 minutos</p>
<p>Si no solicitaste este cambio, ignora este correo</p>
<p>Atentamente, VitalPathAI</p>`;

export default recoverPasswordEmailTemplate;
