const HeaderLogin = () => {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-lg bg-brand-primary-600 flex items-center justify-center">
          <span className="text-white text-xs font-bold">VP</span>
        </div>
        <span className="text-xl font-bold text-brand-text-primary tracking-tight">
          VitalPath
        </span>
      </div>
      <h1 className="text-xl font-bold text-brand-text-primary">
        Iniciar sesión
      </h1>
      <p className="text-sm text-brand-text-secondary">
        Accedé al portal médico
      </p>
    </div>
  );
};

export default HeaderLogin;
