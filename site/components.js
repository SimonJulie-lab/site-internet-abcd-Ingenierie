const navigation = [
  ["Accueil", "/index.html"],
  ["Nos expertises", "/nos-expertises.html"],
  ["Domaines d’intervention", "/domaines-intervention.html"],
  ["À propos", "/a-propos.html"],
];

class AbcdNavbar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <header class="border-b border-ink/20 bg-paper">
        <div class="shell flex min-h-20 flex-wrap items-center justify-between gap-4 py-3">
          <a href="/index.html" aria-label="ABCD Ingénierie — accueil" class="flex items-center gap-3">
            <span class="grid h-10 w-10 place-items-center border-2 border-ink text-lg font-bold tracking-[-.1em]">A</span>
            <span><span class="block text-base font-bold leading-none tracking-[-.07em]">ABCD</span><span class="mt-1 block text-[8px] font-semibold uppercase tracking-[.14em] text-steel">Ingénierie</span></span>
          </a>
          <nav class="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-semibold uppercase tracking-[.12em]" aria-label="Navigation principale">
            ${navigation.map(([label, href]) => `<a class="hover:text-copper" href="${href}">${label}</a>`).join("")}
          </nav>
          <a class="button-primary shrink-0" href="/contact.html">Parler de votre projet <span aria-hidden="true">↗</span></a>
        </div>
      </header>`;
  }
}

class AbcdFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="bg-ink py-12 text-paper">
        <div class="shell grid gap-10 md:grid-cols-12">
          <div class="md:col-span-5"><p class="text-2xl font-bold tracking-[-.07em]">ABCD <span class="text-copper">Ingénierie</span></p><p class="mt-3 text-[10px] font-semibold uppercase tracking-label text-paper/55">Bureau d’études structure bois &amp; métal</p></div>
          <div class="grid gap-2 text-sm text-paper/70 sm:grid-cols-2 md:col-span-4">
            <a class="hover:text-copper" href="/nos-expertises.html">Nos expertises</a><a class="hover:text-copper" href="/domaines-intervention.html">Domaines d’intervention</a><a class="hover:text-copper" href="/a-propos.html">À propos</a><a class="hover:text-copper" href="/contact.html">Contact</a><a class="hover:text-copper" href="/mentions-legales.html">Mentions légales</a><a class="hover:text-copper" href="/politique-de-confidentialite.html">Politique de confidentialité</a>
          </div>
          <div class="border-l border-paper/25 pl-5 text-xs leading-6 text-paper/65 md:col-span-3"><p>15 rue Evain<br>49000 Angers</p><p class="mt-4">Présence secondaire<br>Saint-Gildas-de-Rhuys</p><a class="mt-3 inline-block hover:text-copper" href="mailto:contact@abcd-ing.fr">contact@abcd-ing.fr</a></div>
        </div>
        <div class="shell mt-10 border-t border-paper/15 pt-5 text-[10px] font-medium uppercase tracking-[.12em] text-paper/45">ABCD Ingénierie, SAS · SIREN 000 000 000 · NAF 71.12B</div>
      </footer>`;
  }
}

customElements.define("abcd-navbar", AbcdNavbar);
customElements.define("abcd-footer", AbcdFooter);
