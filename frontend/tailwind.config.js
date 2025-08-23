module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "vrs-primary": "#4e73df",
        "vrs-secondary": "#858796",
        "vrs-success": "#1cc88a",
        "vrs-info": "#36b9cc",
        "vrs-warning": "#f6c23e",
        "vrs-danger": "#e74a3b",
        "vrs-light": "#f8f9fc",
        "vrs-dark": "#5a5c69",
      },
      boxShadow: {
        vrs: "0 4px 12px rgba(0, 0, 0, 0.1)",
        "vrs-lg": "0 10px 25px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
