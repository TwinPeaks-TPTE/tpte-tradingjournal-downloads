const REPOSITORY = "TwinPeaks-TPTE/tpte-tradingjournal-downloads";
const RELEASE_API = `https://api.github.com/repos/${REPOSITORY}/releases/latest`;
const CHANGELOG_URL = "./CHANGELOG.md";

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
  history: document.getElementById("release-history"),
  historySummary: document.getElementById("history-summary"),
  versionIndex: document.getElementById("version-index"),
  expandHistory: document.getElementById("expand-history"),
  collapseHistory: document.getElementById("collapse-history"),
};

const sectionLabels = {
  Added: "Neu",
  Changed: "Geändert",
  Fixed: "Behoben",
  Documentation: "Dokumentation",
  Performance: "Performance",
  Notes: "Hinweise",
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

function parseChangelog(markdown) {
  const releases = [];
  let release = null;
  let section = null;

  for (const line of String(markdown || "").split(/\r?\n/)) {
    const releaseMatch = line.match(/^## \[([^\]]+)\](?: - (\d{4}-\d{2}-\d{2}))?$/);
    if (releaseMatch) {
      release = releaseMatch[1] === "Unreleased" ? null : {
        version: releaseMatch[1],
        date: releaseMatch[2] || "",
        sections: [],
      };
      section = null;
      if (release) releases.push(release);
      continue;
    }

    if (!release) continue;
    const sectionMatch = line.match(/^### (.+)$/);
    if (sectionMatch) {
      section = { title: sectionMatch[1], items: [] };
      release.sections.push(section);
      continue;
    }

    const itemMatch = line.match(/^[-*] (.+)$/);
    if (itemMatch && section) section.items.push(itemMatch[1].replaceAll("`", ""));
  }

  return releases.filter((item) => item.sections.some((entry) => entry.items.length));
}

function versionId(version) {
  return `v${version.replaceAll(".", "-")}`;
}

function formatChangelogDate(value) {
  if (!value) return "Datum nicht dokumentiert";
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}

function historyEntry(release, index) {
  const details = document.createElement("details");
  details.className = "history-entry";
  details.id = versionId(release.version);
  details.open = index === 0;

  const summary = document.createElement("summary");
  const title = document.createElement("strong");
  title.textContent = `v${release.version}`;
  const date = document.createElement("span");
  date.textContent = formatChangelogDate(release.date);
  const count = document.createElement("small");
  const itemCount = release.sections.reduce((total, entry) => total + entry.items.length, 0);
  count.textContent = `${itemCount} ${itemCount === 1 ? "Änderung" : "Änderungen"}`;
  summary.append(title, date, count);

  const content = document.createElement("div");
  content.className = "history-content";
  for (const section of release.sections) {
    if (!section.items.length) continue;
    const group = document.createElement("section");
    const heading = document.createElement("h3");
    heading.textContent = sectionLabels[section.title] || section.title;
    const list = document.createElement("ul");
    for (const text of section.items) {
      const item = document.createElement("li");
      item.textContent = text;
      list.append(item);
    }
    group.append(heading, list);
    content.append(group);
  }

  details.append(summary, content);
  return details;
}

function renderHistory(releases) {
  if (!releases.length) throw new Error("No published changelog entries found");
  const entries = releases.map(historyEntry);
  const indexLinks = releases.map((release, index) => {
    const link = document.createElement("a");
    link.href = `#${versionId(release.version)}`;
    link.textContent = `v${release.version}`;
    link.addEventListener("click", () => { entries[index].open = true; });
    return link;
  });
  refs.versionIndex.replaceChildren(...indexLinks);
  refs.history.replaceChildren(...entries);
  const oldest = releases.at(-1);
  refs.historySummary.textContent = `${releases.length} veröffentlichte Versionen – von v${oldest.version} bis v${releases[0].version}.`;
}

async function loadChangelog() {
  try {
    const response = await fetch(CHANGELOG_URL, { cache: "no-cache" });
    if (!response.ok) throw new Error(`Changelog ${response.status}`);
    renderHistory(parseChangelog(await response.text()));
  } catch (error) {
    const fallback = document.createElement("p");
    fallback.className = "history-status";
    fallback.append("Die Versionshistorie konnte nicht geladen werden. ");
    const link = document.createElement("a");
    link.href = "./CHANGELOG.md";
    link.textContent = "CHANGELOG.md direkt öffnen";
    fallback.append(link, ".");
    refs.history.replaceChildren(fallback);
    refs.historySummary.textContent = "Die Historie ist vorübergehend nur als Datei verfügbar.";
  }
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
refs.expandHistory.addEventListener("click", () => {
  refs.history.querySelectorAll("details").forEach((entry) => { entry.open = true; });
});
refs.collapseHistory.addEventListener("click", () => {
  refs.history.querySelectorAll("details").forEach((entry) => { entry.open = false; });
});
loadLatestRelease();
loadChangelog();
