const BasePage = ({ className = '', children }) => (
  <div className={`min-h-screen pb-24 pt-32 md:pt-40 ${className}`}>
    <div className="mx-auto max-w-5xl px-4 md:px-6">
      {children}
    </div>
  </div>
);

export default BasePage;
