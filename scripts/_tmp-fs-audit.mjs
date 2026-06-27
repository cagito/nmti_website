const fs = require("fs");
const path = require("path");
const root = "X:/website/homepage";

const techDir = path.join(root, "assets/images/technology");
const imagesJs = path.join(root, "js/technology/images.js");
const registryPath = path.join(root, "scripts/image-review-registry.json");
const masterPath = path.join(root, "ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/03_IMAGE_MASTER_LIST.json");

function listWebp(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith(".webp")).sort();
}

const webpFiles = listWebp(techDir);
const pngCount = fs.existsSync(techDir) ? fs.readdirSync(techDir).filter(f => f.endsWith(".png")).length : 0;
const reviewedDir = path.join(techDir, "reviewed");
const reviewedWebp = listWebp(reviewedDir);

const js = fs.readFileSync(imagesJs, "utf8");
const pathMatches = [...js.matchAll(/assets\/images\/technology\/[^\s"'`]+\.webp/g)].map(m => m[0]);
const uniquePaths = [...new Set(pathMatches)];

const imgIdFromPath = p => {
  const m = p.match(/IMG-(\d{3})/);
  return m ? `IMG-${m[1]}` : null;
};

const missingFromImagesJs = [];
const presentFromImagesJs = [];
for (const rel of uniquePaths) {
  const abs = path.join(root, rel.replace(/\//g, path.sep));
  const id = imgIdFromPath(rel);
  if (fs.existsSync(abs)) presentFromImagesJs.push({ id, rel });
  else missingFromImagesJs.push({ id, rel });
}

const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));

function normalizeRegistry(reg) {
  if (Array.isArray(reg)) return reg;
  if (reg.images && Array.isArray(reg.images)) return reg.images;
  if (reg.images && typeof reg.images === "object") {
    return Object.entries(reg.images).map(([k, v]) => ({ id: k, ...(typeof v === "object" ? v : {}) }));
  }
  if (reg.figures && typeof reg.figures === "object") {
    return Object.keys(reg.figures).map(k => ({ id: k, ...reg.figures[k] }));
  }
  for (const v of Object.values(reg)) {
    if (Array.isArray(v) && v.length && (v[0].id || v[0].figureId)) return v;
  }
  return [];
}

const regList = normalizeRegistry(registry);

function getRegId(e) {
  return e.id || e.figureId || e.imgId || null;
}

function isReviewedEntry(e) {
  if (e.reviewed === true) return true;
  const vr = e.visualReview;
  if (vr === "reviewed" || vr === "approved" || vr === "pass") return true;
  if (e.visualReviewStatus === "reviewed" || e.reviewStatus === "reviewed") return true;
  if (e.productionMethod === "ai-reviewed" && vr !== "pending" && vr !== "reject") return true;
  return false;
}

function hasWebpForId(id) {
  const prefix = id + "_";
  return webpFiles.some(f => f.startsWith(prefix)) || reviewedWebp.some(f => f.startsWith(prefix));
}

const reviewedNoWebp = [];
for (const e of regList) {
  const id = getRegId(e);
  if (!id || !/^IMG-\d{3}$/.test(id)) continue;
  if (!isReviewedEntry(e)) continue;
  if (!hasWebpForId(id)) {
    reviewedNoWebp.push({
      id,
      visualReview: e.visualReview,
      productionMethod: e.productionMethod,
      webpPath: e.webpPath || e.webp || null
    });
  }
}

const master = JSON.parse(fs.readFileSync(masterPath, "utf8"));
let activeIds = [];
function walk(obj) {
  if (!obj || typeof obj !== "object") return;
  if (Array.isArray(obj)) { obj.forEach(walk); return; }
  const id = obj.id || obj.image_id || obj.imageId;
  if (id && /^IMG-\d{3}$/.test(id)) {
    const inactive = obj.status === "inactive" || obj.active === false || obj.deprecated === true || obj.retired === true;
    if (!inactive) activeIds.push(id);
  }
  for (const k of Object.keys(obj)) walk(obj[k]);
}
walk(master);
activeIds = [...new Set(activeIds)].sort();

const masterNoWebp = activeIds.filter(id => !hasWebpForId(id));

const regById = {};
for (const e of regList) {
  const id = getRegId(e);
  if (id) regById[id] = e;
}

function hasAnyAssetForId(id) {
  const prefix = id + "_";
  if (!fs.existsSync(techDir)) return false;
  return fs.readdirSync(techDir).some(f => f.startsWith(prefix) && (f.endsWith(".webp") || f.endsWith(".png")));
}

function categorize(id, reason) {
  const e = regById[id] || {};
  const blockers = [].concat(e.blockers || e.blocker || []).map(String);
  const req = e.requiresReaudit === true || e.reauditRequired === true || e.needsReaudit === true;
  const hero = e.hero === true || e.isHero === true || e.category === "hero";
  const spaBlocked = e.spaBlocked === true || blockers.some(b => /SPA|single-page|hero.*block/i.test(b));
  const lowQ = String(e.productionMethod || "").includes("pillow") || e.source === "pillow" || e.migrationTier === "pillow";
  const hasFile = hasAnyAssetForId(id);

  const base = { id, reason, productionMethod: e.productionMethod, visualReview: e.visualReview, requiresReaudit: e.requiresReaudit, blockers };
  if ((req || hero) && (spaBlocked || req)) return { cat: "A", ...base };
  if (lowQ && hasFile) return { cat: "B", ...base };
  return { cat: "C", ...base };
}

const allBrokenIds = [...new Set([
  ...missingFromImagesJs.map(x => x.id).filter(Boolean),
  ...reviewedNoWebp.map(x => x.id),
  ...masterNoWebp
])].sort();

const catA = [], catB = [], catC = [];
for (const id of allBrokenIds) {
  const inJs = missingFromImagesJs.some(x => x.id === id);
  const reason = inJs ? "images.js path missing on disk" : (masterNoWebp.includes(id) ? "master list active ID, no webp" : "registry reviewed, no webp");
  const c = categorize(id, reason);
  if (c.cat === "A") catA.push(c);
  else if (c.cat === "B") catB.push(c);
  else catC.push(c);
}

const webpIds = [...new Set(webpFiles.map(f => f.match(/^(IMG-\d{3})/)?.[1]).filter(Boolean).map(n => `IMG-${n}`))].sort();

console.log(JSON.stringify({
  summary: {
    webpCountRoot: webpFiles.length,
    pngCountRoot: pngCount,
    reviewedWebpCount: reviewedWebp.length,
    imagesJsWebpPathsTotal: pathMatches.length,
    imagesJsWebpPathsUnique: uniquePaths.length,
    imagesJsPresent: presentFromImagesJs.length,
    imagesJsMissing: missingFromImagesJs.length,
    registryEntriesParsed: regList.length,
    reviewedNoWebpCount: reviewedNoWebp.length,
    masterActiveIdsCount: activeIds.length,
    masterNoWebpCount: masterNoWebp.length,
    uniqueWebpIdsOnDisk: webpIds.length
  },
  webpFilenames: webpFiles,
  webpIdsOnDisk: webpIds,
  missingFromImagesJs,
  reviewedNoWebp,
  masterActiveIds: activeIds,
  masterNoWebp,
  categories: {
    A_requiresReaudit_heroes_blocked_SPA: catA,
    B_pillow_lowQuality_fileExists: catB,
    C_trulyMissing: catC
  }
}, null, 2));
