# Changelog

All notable changes to TPTE Tradingjournal are documented here.

## [Unreleased]

## [0.17.6] - 2026-08-14

### Fixed
- Neue oder geänderte MAE-/MFE-Werte müssen ganze, nichtnegative Ticks sein; das gilt auch für Sammelbearbeitung und Import.
- Bestehende Legacy-Dezimalwerte bleiben unverändert les- und speicherbar, solange der jeweilige Wert nicht geändert wird.

### Changed
- Info-Tooltips an den MAE-/MFE-Feldern erklären Bedeutung, Einheit und Ganzzahlregel.

## [0.17.5] - 2026-08-14

### Fixed
- Der Medienviewer navigiert nach dem Löschen dazwischenliegender Trade-Medien wieder lückenlos über alle verbleibenden Bilder, Videos und Audiodateien.
- Nicht mehr vorhandene Dateien werden im Viewer gezielt übersprungen, während andere Dateizugriffsfehler weiterhin sichtbar gemeldet werden.
- Schnelle parallele Navigations- oder Löschaktionen verwenden stabile Medienidentitäten und können dadurch kein gültiges Nachbarmedium versehentlich entfernen.
- Ein Regressionstest deckt aktuelle Viewer-Listen, Navigation in beide Richtungen, fehlende Dateien sowie parallele Navigation und Löschung ab.

## [0.17.4] - 2026-08-13

### Fixed
- Release-ZIPs enthalten keine technischen `.gitkeep`-Platzhalter mehr; der Build prüft dies zusätzlich automatisch.
- Die Bridge-Importvorschau zeigt beim Instrument den normalisierten Wert statt des generischen Rohwerts `futures`.
- Regressionstests sichern beide Korrekturen gegen Rückfälle ab.

## [0.17.3] - 2026-08-13

### Fixed
- JSON-Dateien werden je Pfad serialisiert, vor dem Schreiben validiert und nach dem Speichern erneut geprüft; fehlgeschlagene Schreibvorgänge werden abgebrochen und hinterlassen die bestehende Datei nicht bewusst in einem leeren Zustand.
- Ein leeres oder ungültiges `data/events.json` wird aus `data/events.json.bak` wiederhergestellt oder kontrolliert als leeres Ereignisprotokoll initialisiert.
- Der automatische Wiederverbund fordert keine Ordnerfreigabe mehr ohne Benutzeraktion; fehlende Berechtigungen werden im Setup protokolliert.
- Regressionstests decken unterbrochene und parallele Schreibvorgänge, ungültiges JSON, Ereignis-Wiederherstellung und fehlende Auto-Reconnect-Berechtigungen ab.

## [0.17.2] - 2026-08-12

### Changed
- The app now uses the available viewport width by default across all pages; the separate full-width toggle is no longer needed.
- The trade list expands with its card while retaining all columns through local horizontal scrolling on narrow screens.
- Read-only execution histories use compact, wrapping columns that fit the trade editor at desktop widths; execution editing retains wider locally scrollable controls.
- The stored legacy `layoutWide` setting remains untouched and tolerated so existing data folders require no migration.

## [0.17.1] - 2026-08-12

### Fixed
- Automatically measured Journal Bridge slippage is no longer deducted twice from PnL because Bridge entry and exit prices already contain the actual fill quality.
- Legacy trades without slippage-source metadata retain their historical PnL calculation, and a regression check now guards the official v0.10.4 trade fields and optional detail arrays.
- Existing data folders are extended only after a successful load and again before trade storage; unreadable or malformed JSON is never replaced by an empty fallback.

### Documentation
- The update guide now explicitly documents compatibility with v0.10.4 data folders and the required backup-first update procedure.

## [0.17.0] - 2026-08-11

### Added
- Trades can store chronological entry, add, reduce and exit executions with derived position, VWAP, ticks, PnL and linked screenshots.
- Journal Bridge imports retain initial/final stops and targets plus their change history; R-Multiple can use the original or final stop.
- Manual trade entry supports guided partial executions, and trade rows can expand to show execution details.
- Bulk editing now covers classification, trade data, costs and risk fields while protecting execution-derived values.
- The Import Center can process `tpte_atas_live` Journal Bridge envelopes and their screenshots from the local ATAS inbox.
- Trade, bulk-edit, import and settings fields now identify course, tick, quantity and currency units explicitly.
- Journal Bridge imports retain signed execution slippage, its order reference and the completeness of automatic coverage.
- Planned chance-risk ratio is calculated from the original entry, stop and target separately from the realized R result.
- Settings provide a two-step full reset that removes all personal journal data and recreates an empty delivery structure.

### Changed
- Stored trade media can be browsed with previous/next controls and arrow keys, including direct navigation from an execution screenshot.
- Journal Bridge imports use the durable import history and can be undone like other active import batches without deleting their archived source envelopes.
- Stop loss and take profit are validated as absolute prices on the instrument tick grid; unknown slippage remains empty instead of being treated as zero.
- Selecting one trade updates only its own table row, avoiding full-table DOM work in large installed journals.
- The complete import history starts collapsed and remains available on demand.

## [0.16.0] - 2026-08-11

### Added
- The Import Center shows the complete durable import history and allows any still-active, unambiguous batch to be undone individually.

### Changed
- Import-history summaries count remaining trades in one linear pass, while batch detail files continue to load only for the selected undo action.

## [0.15.0] - 2026-08-10

### Added
- Successful imports receive durable batch metadata and can be undone after restarting and reconnecting the data folder.
- The Import Center shows the latest import and uses an explicit danger dialog with exact typed confirmation when it can be undone.
- Undoing an import creates an automatic snapshot, removes only unambiguously batch-owned trades, safely handles media and keeps raw import files for audit and recovery.
- `imports/IMPORT_LOG.md` provides a human- and machine-readable audit table for completed and undone imports with links to batch details.

### Changed
- Imported trades retain compact batch and import-state signatures through individual and bulk editing.
- Import events remain compact while full trade ID lists and undo results are stored in dedicated batch detail files.

## [0.14.0] - 2026-08-10

### Added
- Visible, filtered trades can be selected individually or as a group and edited together.
- Bulk editing supports system, account, trade type, setup, session and rule compliance with explicit per-field activation and a change preview.
- Bulk deletion uses a dedicated danger dialog, exact `LÖSCHEN` confirmation and revalidation of all selected trade IDs.

### Changed
- Trade selection is cleared whenever search or trade filters change so hidden trades cannot be changed accidentally.
- Trade media deletion now rejects paths that are outside the validated per-trade media directory structure.

## [0.13.7] - 2026-08-09

### Changed
- The redundant manual save-all action was removed because edits are persisted by their individual workflows.
- The connected-folder indicator now communicates saving, saved and failed states.
- Applying or resetting dashboard filters now persists them immediately.
- Derived setup and instrument catalogs are updated automatically only when their trade values change.

## [0.13.6] - 2026-08-09

### Performance
- Trade rows use one delegated table click handler instead of creating a separate listener for every rendered trade.

## [0.13.5] - 2026-08-09

### Performance
- Trade search waits briefly for continuing input and table rows are inserted into the document as one batch.

## [0.13.4] - 2026-08-09

### Performance
- Dashboard charts are refreshed once after window resizing instead of being rebuilt for every intermediate resize event.

## [0.13.3] - 2026-08-09

### Performance
- Trade, review and dashboard views are refreshed only while visible and otherwise updated when opened.

## [0.13.2] - 2026-08-09

### Performance
- Date, timezone, number and currency formatters are reused instead of recreated for every trade.

## [0.13.1] - 2026-08-09

### Fixed
- The trade list now uses the available window height without creating nested vertical scroll areas.
- The floating add-trade button no longer covers the trade list scrollbar.

## [0.13.0] - 2026-08-08

### Added
- Trade data can be pasted into the Import Center as CSV, JSON or copied table rows and uses the existing import pipeline.
- Mapping samples can be pasted directly to detect columns without uploading a file.

## [0.12.0] - 2026-08-08

### Added
- Import settings can optionally be retained and restored after restarting or reloading the journal.

## [0.11.0] - 2026-08-08

### Added
- Equity and drawdown can be grouped by trades, days, ISO weeks, months or years without changing Dashboard filters or KPIs.
- The equity chart now has an accessible HTML legend with independent series toggles and detailed drawdown help.

## [0.10.5] - 2026-08-08

### Changed
- Dashboard multi-selection filters now use persistent dropdown menus with checkmarks instead of native multi-select lists.
- Rule compliance on the Dashboard and system, account and result on the Trades page now support the same multi-selection controls.

## [0.10.4] - 2026-07-05

### Added
- Account names can now be renamed after creation and linked trades are updated.
- Dashboard filters for system, account, result, setup, symbol and instrument now support multi-selection.
- Import normalization derives instrument roots from futures symbols such as `MNQU6` -> `MNQ`.

### Changed
- Dashboard instrument filter only lists instruments that are present in trades.

## [0.10.3] - 2026-07-05

### Added
- Removing an account with linked trades now opens a decision dialog.
- Linked account trades can be deleted with the account or reassigned to another existing account.

### Changed
- Account removal no longer fails silently when trades are linked.

## [0.10.2] - 2026-07-05

### Added
- Backup snapshots can now be deleted from Setup after explicit confirmation.
- Header now includes a full-width layout toggle for dashboards and wide tables.

### Changed
- Full-width mode removes the page max-width and minimizes horizontal content padding.

## [0.10.1] - 2026-07-05

### Added
- Backup snapshots can now be restored from Setup.
- Restore creates a pre-restore safety snapshot before replacing JSON data.
- PnL matrix now includes a summary row per hour and a summary column per weekday.

### Changed
- Dashboard horizontal padding reduced and heatmap wrapper allows horizontal scrolling when needed.

## [0.10.0] - 2026-07-05

### Changed
- Release package now separates app files from personal journal data with `TPTE-Tradingjournal-App` and `TPTE-Tradingjournal-Data-Template`.
- Customer README now documents new installations, updates and migration from older combined folders.
- Setup wording now refers to the connected data folder.

### Notes
- Existing users should migrate their old `data`, `imports`, `media` and `backups` folders into a separate `TPTE-Tradingjournal-Data` folder and replace only the app folder on future updates.

## [0.9.3] - 2026-07-05

### Fixed
- Creating a new proprietary mapping no longer fails silently.
- Mapping save now validates required fields, reports missing folder/sample/name states, handles write errors and refreshes mapping selectors after saving.

## [0.9.2] - 2026-07-05

### Added
- Stored proprietary import mappings can now be deleted from the Mapping Studio.
- Trades can be duplicated from the Trade Editor and saved as a new trade after adjusting times/prices.

### Changed
- PnL matrix value cells use darker, bolder text for better readability in dark mode.

## [0.9.1] - 2026-07-04

### Added
- Start page setting for Setup, Dashboard, Trades or Reviews.
- Existing proprietary import mappings can be loaded into the Mapping Studio and edited.

### Fixed
- Dashboard filter reset now removes date range, trading window, break window and weekday filters instead of reactivating default filters.
- Empty dashboard time fields no longer filter trades.

## [0.9.0] - 2026-07-04

### Added
- Optional app mode with `manifest.json` and `service-worker.js` for local localhost/PWA usage.
- Customer-friendly release start files for macOS and Windows.
- `TPTE-Journal.html` as simple double-click entry file in the customer ZIP.
- In-app Changelog view.
- Setup runtime notice showing whether the app is running in direct file mode or local app mode.

### Changed
- Folder auto-reconnect now actively requests permission again when a persisted handle is available but permission is in prompt state.
- Release package explains both supported start options: simple direct start and optional app start.

## [0.8.1] - 2026-07-04

### Changed
- Release build creates one canonical, versioned customer ZIP only.
- Release folder policy documented: keep versioned ZIPs, remove unversioned aliases and unpacked build folders.
- Project workflow documented for Git, Changelog, version bumps, tags and GitHub Releases.

### Fixed
- Clean release seed data now uses the correct ZB tick value.

## [0.8.0] - 2026-07-04

### Added
- Import timezone selection for all imports.
- Separate display timezone in Settings for journal views, filters, editor fields and dashboard time buckets.
- Import preview now shows journal entry/exit time and separate source entry/exit time.
- ATAS XLSX import from the Journal sheet.
- ATAS CSV import with direction/volume parsing and commission handling.
- Global Backtest/Live trade type for imports and manual trades.
- Media metadata, preview and per-file management for trades and reviews.

### Fixed
- ATAS duplicate detection no longer collapses distinct rows.
- Floating plus button opens the trade editor globally, including from Dashboard.
- Dashboard filtering no longer fails after import due to stale local date variables.
- Trade editor modal is promoted outside hidden tabs and clears focus before hiding.
- Manual new-trade creation works with display-timezone-aware datetime fields.

### Changed
- Clean deployment ZIPs contain no demo trades, reviews, raw imports, media or backups.
