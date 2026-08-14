const REPOSITORY = "TwinPeaks-TPTE/tpte-tradingjournal-downloads";
const RELEASE_API = `https://api.github.com/repos/${REPOSITORY}/releases/latest`;

const refs = {
  version: document.getElementById("release-version"),
  notesVersion: document.getElementById("notes-version"),
  date: document.getElementById("release-date"),
  download: document.getElementById("download-link"),
  downloadDetail: document.getElementById("download-detail"),
  release: document.getElementById("release-link"),
  notes: document.getElementById("release-notes"),
  status: document.getElementById("release-status"),
  digest: document.getElementById("release-digest"),
  checksum: document.getElementById("checksum-link"),
  year: document.getElementById("current-year"),
};

function formatDate(value) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function formatBytes(value) {
  if (!Number.isFinite(value) || value <= 0) return "ZIP · macOS und Windows";
  return `${new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(value / 1024 / 1024)} MB · ZIP · macOS und Windows`;
}

function releaseNoteItems(body, tagName) {
  const lines = String(body || "").split(/\r?\n/);
  const version = String(tagName || "").replace(/^v/, "");
  const versionHeading = new RegExp(`^## \\[${version.replaceAll(".", "\\.")}\\]`);
  let inVersion = !lines.some((line) => /^## \[/.test(line));
  const notes = [];

  for (const line of lines) {
    if (versionHeading.test(line)) {
      inVersion = true;
      continue;
    }
    if (inVersion && /^## \[/.test(line)) break;
    if (inVersion && /^[-*] /.test(line)) notes.push(line.replace(/^[-*] /, "").replaceAll("`", ""));
  }
  return notes.slice(0, 6);
}

function renderNotes(notes) {
  if (!notes.length) return;
  refs.notes.replaceChildren(...notes.map((note) => {
    const item = document.createElement("li");
    item.textContent = note;
    return item;
  }));
}

async function loadLatestRelease() {
  try {
    const response = await fetch(RELEASE_API, { headers: { Accept: "application/vnd.github+json" } });
    if (!response.ok) throw new Error(`GitHub API ${response.status}`);
    const release = await response.json();
    const versionedAsset = release.assets.find((asset) => /^TPTE-Tradingjournal-Clean-v\d+\.\d+\.\d+\.zip$/.test(asset.name));
    const checksumAsset = release.assets.find((asset) => asset.name === "SHA256SUMS.txt");
    const version = release.tag_name || release.name;

    refs.version.textContent = version;
    refs.notesVersion.textContent = version;
    refs.date.textContent = `Veröffentlicht am ${formatDate(release.published_at)}`;
    refs.release.href = release.html_url;
    refs.checksum.href = checksumAsset?.browser_download_url || release.html_url;

    if (versionedAsset) {
      refs.download.href = versionedAsset.browser_download_url;
      refs.downloadDetail.textContent = formatBytes(versionedAsset.size);
      if (versionedAsset.digest?.startsWith("sha256:")) refs.digest.textContent = versionedAsset.digest.slice(7);
    }

    renderNotes(releaseNoteItems(release.body, release.tag_name));
    refs.status.textContent = "Release-Daten direkt mit GitHub abgeglichen.";
  } catch (error) {
    refs.status.textContent = "Die eingeblendeten Release-Daten konnten nicht aktualisiert werden. Der GitHub-Link führt weiterhin zur aktuellen Version.";
  }
}

refs.year.textContent = String(new Date().getFullYear());
loadLatestRelease();
