export const INTRO_KEY = "fl-intro-seen";

/** Rutas donde NO se muestra la intro (flujo de compra y panel). */
export const INTRO_EXCLUDED = ["/checkout", "/confirmacion", "/admin"];

/**
 * Script inline (en <head>) que decide antes del primer paint si se muestra la intro:
 * primera página que se abre en la sesión (cualquier página de la tienda) y sin reduced-motion.
 */
export const preloaderScript = `try{var p=location.pathname;if(!${JSON.stringify(INTRO_EXCLUDED)}.some(function(x){return p.indexOf(x)===0})&&!sessionStorage.getItem("${INTRO_KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.dataset.preload="1"}}catch(e){}`;
