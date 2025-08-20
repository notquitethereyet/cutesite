import { c as createComponent, f as createAstro, d as renderComponent, b as renderTemplate, m as maybeRenderHead, g as renderSlot } from './astro/server.D6i8lyld.js';
import 'kleur/colors';
import { $ as $$Layout } from './Layout.DQLxDZ8O.js';

const $$Astro = createAstro();
const $$BlogLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BlogLayout;
  const { frontmatter } = Astro2.props;
  const { title, date, tags } = frontmatter;
  function formatDate(dateString) {
    const date2 = new Date(dateString);
    return date2.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="blog-post-single p-8 max-w-4xl mx-auto" style="background-color: var(--window-content-bg); color: var(--text-color); height: auto; min-height: 100%; position: relative; z-index: 2; box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);"> <h1 class="font-bold text-3xl mb-2" style="color: var(--text-color);">${title}</h1> <p class="text-sm mb-4" style="color: var(--text-color); opacity: 0.8;">${formatDate(date)}</p> ${tags && renderTemplate`<div class="tags flex flex-wrap gap-2 mb-6"> ${tags.map((tag) => renderTemplate`<span class="tag px-2 py-1 rounded-full text-xs">${tag}</span>`)} </div>`} <div class="blog-content prose prose-lg max-w-none" style="background-color: var(--window-content-bg); position: relative; z-index: 2;"> ${renderSlot($$result2, $$slots["default"])} </div> </div> ` })}`;
}, "/Users/quiet/Documents/Workspace/cutesite/src/layouts/BlogLayout.astro", void 0);

export { $$BlogLayout as $ };
