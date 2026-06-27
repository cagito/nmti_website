const fs = require("fs");
const path = require("path");
const root = "X:/website/homepage";

const techDir = path.join(root, "assets/images/technology");
const imagesJs = path.join(root, "js/technology/images.js");
const registryPath = path.join(root, "scripts/image-review-registry.json");
const masterPath = path.join(root, "ImageWorks/NMTI_Engineering_Image_Prompt_Package_v1/03_IMAGE_MASTER_LIST.json");

function listFiles(dir, ext) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith(ext)).sort();
}

const webpFiles = listFiles(techDir, ".webp");
const pngFiles = listFiles(techDir, ".png");
const reviewedDir = path.join(techDir, "reviewed");
const reviewedWebp = listFiles(reviewedDir, ".webp");

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
const regList = Object.entries(registry)
  .filter(([k]) => /^IMG-\d{3}$/.test(k))
  .map(([k, v]) => ({ id: k, ...v }));

function isReviewedEntry(e) {
  if (e.status === "reviewed" || e.reviewGrade === "PASS") return true;
  if (e.reviewed === true) return true;
  const vr = e.visualReview;
  if (vr === "reviewed" || vr === "approved" || vr === "pass") return true;
  return false;
}

function hasWebpForId(id) {
  const prefix = id + "_";
  return webpFiles.some(f => f.startsWith(prefix)) || reviewedWebp.some(f => f.startsWith(prefix));
}

const reviewedEntries = regList.filter(isReviewedEntry);
const reviewedNoWebp = reviewedEntries
  .filter(e => !hasWebpForId(e.id))
  .map(e => ({ id: e.id, status: e.status, reviewGrade: e.reviewGrade, productionMethod: e.productionMethod, requiresReaudit: e.requiresReaudit }));

const master = JSON.parse(fs.readFileSync(masterPath, "utf8"));
const masterArr = Array.isArray(master) ? master : Object.values(master);
const activeIds = masterArr
  .filter(row => row && row.id && /^IMG-\d{3}$/.test(row.id))
  .filter(row => row.status !== "inactive" && row.active !== false && row.deprecated !== true && row.retired !== true)
  .map(row => row.id);
const activeUnique = [...new Set(activeIds)].sort();
const masterNoWebp = activeUnique.filter(id => !hasWebpForId(id));

const regById = Object.fromEntries(regList.map(e => [e.id, e]));

function hasAnyAssetForId(id) {
  const prefix = id + "_";
  return fs.readdirSync(techDir).some(f => f.startsWith(prefix) && (f.endsWith(".webp") || f.endsWith(".png")));
}

function categorize(id, reason) {
  const e = regById[id] || {};
  const blockers = [].concat(e.blockers || e.blocker || e.spaBlockers || []).map(String);
  const req = e.requiresReaudit === true || e.reauditRequired === true;
  const hero = e.hero === true || e.isHero === true || e.auditPriority === "P0";
  const spaBlocked = e.spaBlocked === true || e.spaHeroBlocked === true ||
    blockers.some(b => /SPA|spa|hero.*block|rework.*SPA/i.test(b)) ||
    (e.notes && /SPA|hero.*block/i.test(String(e.notes)));
  const pillow = /pillow/i.test(String(e.productionMethod || "")) || /pillow/i.test(String(e.notes || "")) && e.status === "reviewed";
  const lowQLegacy = e.productionMethod === "pillow" || e.productionMethod === "pillow-render" || e.migrationPhase === "legacy-pillow";
  const hasFile = hasAnyAssetForId(id);

  const base = { id, reason, status: e.status, productionMethod: e.productionMethod, requiresReaudit: e.requiresReaudit, auditPriority: e.auditPriority, blockers: blockers.slice(0, 5) };
  if (req && (spaBlocked || hero)) return { category: "A", ...base };
  if ((lowQLegacy || pillow) && hasFile) return { category: "B", ...base };
  if (!hasFile) return { category: "C", ...base };
  return { category: "C", ...base, note: "file exists but other gap" };
}

const brokenIdSet = new Set([
  ...missingFromImagesJs.map(x => x.id).filter(Boolean),
  ...reviewedNoWebp.map(x => x.id),
  ...masterNoWebp
]);

const categorized = [...brokenIdSet].sort().map(id => {
  const inJs = missingFromImagesJs.some(x => x.id === id);
  const reason = inJs
    ? "images.js webp path missing on disk"
    : masterNoWebp.includes(id)
      ? "active in 03_IMAGE_MASTER_LIST, no matching webp filename"
      : "registry reviewed/PASS, no matching webp filename";
  return categorize(id, reason);
});

const catA = categorized.filter(x => x.category === "A");
const catB = categorized.filter(x => x.category === "B");
const catC = categorized.filter(x => x.category === "C");

const webpIds = [...new Set(webpFiles.map(f => f.match(/^(IMG-\d{3})/)?.[1]).filter(Boolean).map(n => `IMG-${n}`))].sort();
const masterIds = [...new Set(masterArr.map(r => r.id).filter(id => id && /^IMG-\d{3}$/.test(id)))].sort();
const missingFromMasterVsDisk = masterIds.filter(id => !webpIds.includes(id));

console.log(JSON.stringify({
  summary: {
    webpCountRoot: webpFiles.length,
    pngCountRoot: pngFiles.length,
    reviewedSubdirWebpCount: reviewedWebp.length,
    imagesJsWebpPathRefsTotal: pathMatches.length,
    imagesJsWebpPathRefsUnique: uniquePaths.length,
    imagesJsPathsPresentOnDisk: presentFromImagesJs.length,
    imagesJsPathsMissingOnDisk: missingFromImagesJs.length,
    registryFigureCount: regList.length,
    registryReviewedCount: reviewedEntries.length,
    registryReviewedMissingWebp: reviewedNoWebp.length,
    masterListEntryCount: masterIds.length,
    masterActiveIdCount: activeUnique.length,
    masterActiveMissingWebp: masterNoWebp.length,
    distinctWebpIdsOnDisk: webpIds.length,
    gapIdsUnionCount: brokenIdSet.size
  },
  webpFilenames: webpFiles,
  webpIdsOnDisk: webpIds,
  missingFromImagesJs,
  reviewedNoWebp,
  masterNoWebp,
  masterActiveIds: activeUnique,
  categories: {
    A_count: catA.length,
    B_count: catB.length,
    C_count: catC.length,
    A_requiresReaudit_heroes_blocked_SPA: catA,
    B_pillow_lowQuality_fileExists: catB,
    C_trulyMissing: catC
  }
}, null, 2));
