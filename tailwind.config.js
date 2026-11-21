/** Safar Kitobi dizayn tizimi — ranglar CSS o'zgaruvchilaridan olinadi (src/index.css) */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        qogoz: 'rgb(var(--qogoz) / <alpha-value>)',     // sahifa foni
        varaq: 'rgb(var(--varaq) / <alpha-value>)',     // kartochka foni
        siyoh: 'rgb(var(--siyoh) / <alpha-value>)',     // asosiy matn
        kul: 'rgb(var(--kul) / <alpha-value>)',         // ikkinchi darajali matn
        chiziq: 'rgb(var(--chiziq) / <alpha-value>)',   // chegara
        firuza: 'rgb(var(--firuza) / <alpha-value>)',   // asosiy brend rangi
        lojuvard: 'rgb(var(--lojuvard) / <alpha-value>)',
        oltin: 'rgb(var(--oltin) / <alpha-value>)',
        muhr: 'rgb(var(--muhr) / <alpha-value>)',       // muhr qizili
      },
      fontFamily: {
        sarlavha: ['Lora', 'Georgia', 'serif'],
        matn: ['Manrope', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      borderRadius: { varaq: '18px' },
    },
  },
  plugins: [],
}
