import { c as createComponent, f as createAstro, b as renderTemplate, e as renderScript, g as renderSlot, a as addAttribute, r as renderHead } from './astro/server.D6i8lyld.js';
import 'kleur/colors';
import 'clsx';
/* empty css                               */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title = "cutesitev2", description = "A cute and aesthetic personal website with a desktop interface" } = Astro2.props;
  const base = "/";
  return renderTemplate(_a || (_a = __template(['<html lang="en" data-astro-cid-sckkx6r4> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml"', '><meta name="generator"', '><meta name="description"', '><link href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/fontawesome.min.css" integrity="sha512-SgaqKKxJDQ/tAUAAXzvxZz33rmn7leYDYfBP+YoMRSENhf3zJyx3SBASt/OfeQwBHA1nxMis7mM3EV/oYT6Fdw==" crossorigin="anonymous" referrerpolicy="no-referrer"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/brands.min.css" integrity="sha512-9YHSK59/rjvhtDcY/b+4rdnl0V4LPDWdkKceBl8ZLF5TB6745ml1AfluEU6dFWqwDw9lPvnauxFgpKvJqp7jiQ==" crossorigin="anonymous" referrerpolicy="no-referrer"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/solid.min.css" integrity="sha512-yDUXOUWwbHH4ggxueDnC5vJv4tmfySpVdIcN1LksGZi8W8EVZv4uKGrQc0pVf66zS7LDhFJM7Zdeow1sw1/8Jw==" crossorigin="anonymous" referrerpolicy="no-referrer"><title>', "</title>", '<script type="module"', "></script>", "</head> <body", " data-astro-cid-sckkx6r4> ", " ", " </body> </html>"])), addAttribute(`${base}favicon.svg`, "href"), addAttribute(Astro2.generator, "content"), addAttribute(description, "content"), title, renderScript($$result, "/Users/quiet/Documents/Workspace/cutesite/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts"), addAttribute(`${base}trianglify-bg.js`, "src"), renderHead(), addAttribute(title !== "cutesitev2" ? "blog-post-page" : "", "class"), renderSlot($$result, $$slots["default"]), renderScript($$result, "/Users/quiet/Documents/Workspace/cutesite/src/layouts/Layout.astro?astro&type=script&index=1&lang.ts"));
}, "/Users/quiet/Documents/Workspace/cutesite/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
