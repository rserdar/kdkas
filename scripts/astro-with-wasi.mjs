process.env.NAPI_RS_FORCE_WASI = "1";

const astroBinUrl = new URL("../node_modules/astro/bin/astro.mjs", import.meta.url);

await import(astroBinUrl.href);
