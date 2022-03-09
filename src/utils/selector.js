// Fist element selector
export const $ = (el, context = document) => context.querySelector(el)
// All element selector
export const $$ = (el, context = document) => context.querySelectorAll(el)
