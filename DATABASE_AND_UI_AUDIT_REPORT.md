# TV SUPREME — Local MySQL Migration and Website Quality Report

**Report date:** 21 September 2026  
**Scope:** Local MySQL conversion, public website, and CMS/admin user interface  
**Audit mode:** Read-only. No content, user, media, form, or database records were changed while preparing this report.

## Executive summary

The application now connects to a **local MySQL database** instead of Prisma Accelerate/PostgreSQL. The existing data model, table relationships, and content were retained. No database migration was run against the local database and no records were deleted or rewritten.

The website starts successfully and the main public and admin pages render. However, it is **not ready for a public production launch** because there are significant navigation, localization, CMS persistence, accessibility, and admin-security issues.

The most urgent items are:

1. Protect the admin area with authentication and roles.
2. Fix broken homepage and footer links.
3. Complete Sinhala and Tamil routing/navigation.
4. Connect search to the MySQL content.
5. Replace simulated CMS saves with real persistent behavior where the interface promises saving.

## 1. What changed for the local MySQL database

### Before and after

| Area | Before | Now |
| --- | --- | --- |
| Database engine | PostgreSQL through Prisma Accelerate | Local MySQL / MariaDB-compatible connection |
| Connection adapter | PostgreSQL adapter and Accelerate extension | Prisma MariaDB adapter |
| Database address | Accelerate/PostgreSQL connection URL | Local MySQL host, port, database, username, and password fields in `.env` |
| Prisma schema provider | `postgresql` | `mysql` |
| Content structure | Existing Prisma models and relations | The same Prisma models and relations |

### Detailed database changes

1. **Prisma was switched from PostgreSQL to MySQL.**
   The Prisma provider now identifies the database as MySQL.

2. **The Prisma connection client was changed.**
   The application no longer uses the PostgreSQL/Accelerate connector. It now uses Prisma's MariaDB/MySQL adapter and reads separate local MySQL connection fields from `.env`.

3. **Long text fields were made explicit for MySQL.**
   News content and page content use `LongText`; descriptions, URLs, SEO descriptions, messages, and settings use `Text`. This prevents MySQL string-length problems while preserving the same logical fields.

4. **Search compatibility was adjusted.**
   PostgreSQL-specific case-insensitive search syntax was removed from article, media, and video data queries. MySQL handles case-insensitive matching through its database collation.

5. **The database test endpoint was made MySQL-safe.**
   It still checks the connection with `SELECT 1`, but it no longer returns a raw result that could contain a MySQL value which JSON cannot serialize.

6. **Packages and developer commands were updated.**
   PostgreSQL and Accelerate packages were removed; the MariaDB adapter was added. Commands were added for generating Prisma, validating the schema, synchronizing an intentionally changed schema, and opening Prisma Studio.

7. **Local setup documentation was added.**
   The README and `.env.example` explain how to configure a local MySQL connection without exposing credentials.

8. **Visible wording was updated.**
   Existing UI labels and comments that said “PostgreSQL” were changed to say “MySQL.” These wording updates do not change UI behavior.

### What did not change in the database move

- No article, category, user, video, media, page, menu, footer, or setting records were modified.
- No tables were dropped, recreated, renamed, or manually altered.
- No database migration was applied to the local database.
- No CRUD workflow, admin workflow, page layout, or content model was intentionally redesigned as part of the MySQL move.
- The article/category/video/media API design remained the same, apart from the database connector and the connection-test response.

### Database conversion checks that passed

- Prisma schema validation passed.
- Prisma client generation passed.
- Comparison between the current MySQL database and the Prisma schema produced an empty migration diff.
- TypeScript checking passed.
- A production build passed before this audit.
- The local database connection endpoint reported success.

## 2. Website and UI audit scope

The following were checked without making changes:

- Public homepage, article, category, latest, search, video, live-TV, company, legal, and contact pages.
- English, Sinhala, and Tamil route behavior.
- Admin dashboard and all main CMS pages.
- Public and admin read-only APIs.
- Desktop browser behavior and a 390px-wide mobile browser view.
- Internal links, browser hydration, responsive overflow, dark-mode behavior, and automated accessibility checks.
- Current database-backed content displayed in the UI.

I did **not** submit forms, create/edit/delete records, upload files, publish content, or call write APIs. Where a feature would change data, its behavior was assessed from the visible UI and its connected data path instead.

## 3. Critical issues to fix before public release

### 3.1 Admin area has no access protection

All admin pages and content-management read APIs are reachable without a sign-in screen or role check. This exposes the CMS interface to anyone who can reach the site. Write actions were not tested to avoid changing data, but the current UI has no visible authentication boundary.

**Impact:** Critical security and content-management risk.

### 3.2 Homepage links lead visitors to 404 pages

The homepage displays links for news articles, categories, Video, and Watch Live using addresses without the required language prefix. Examples include `/news/...`, `/business`, `/sports`, `/video`, and `/watch-live`.

All 15 tested homepage links returned `404`. The correct destinations require a language prefix, such as `/en/news/...`, `/en/sports`, and `/en/watch-live`. This problem repeats on the root, English, Sinhala, and Tamil homepages.

**Impact:** Visitors cannot reliably open stories, categories, videos, or live TV from the homepage.

### 3.3 Footer links lead to 404 pages

Once the footer loads in the browser, it generates links such as:

- `/en/about`
- `/en/contact`
- `/en/advertise`
- `/en/legal/privacy-policy`
- `/en/legal/terms-of-use`

Those pages do not exist. The existing company and legal pages are root-level routes such as `/about` and `/legal/privacy-policy`.

**Impact:** Important trust, contact, legal, and advertising links are broken across the public site.

### 3.4 Sinhala and Tamil are incomplete/broken

The Sinhala and Tamil routes currently have several independent problems:

- The page language remains English in the browser.
- The homepage content is English because the homepage always loads English records.
- Sinhala and Tamil header APIs currently return zero navigation items, so the header navigation disappears after loading.
- Footer descriptions and link labels remain English.
- Only one of the seven published articles currently has Sinhala and Tamil translations.

**Impact:** The site presents itself as multilingual, but the Sinhala and Tamil experiences are not complete or dependable.

### 3.5 Language selector creates broken routes on company/legal pages

Using the language selector on About, Contact, Advertise, Privacy Policy, or Terms creates paths such as `/si/about` or `/ta/legal/privacy-policy`. These paths return `404`.

**Impact:** A visitor can lose access to the current page simply by changing language.

### 3.6 Search does not search the MySQL CMS content

The search screen uses an old sample-news list rather than published MySQL articles. For example, searching for `launch` returns “No results found” even though the local database has a published article named “Supreme News Launches Next-Gen Digital Platform.” Search result cards are also not clickable.

**Impact:** Search appears to work but cannot find or open real published content.

## 4. Public website functional issues

### Homepage hero controls do not work

The Previous Story and Next Story buttons and the hero dots are visual only. Browser testing confirmed that clicking Next Story does not change the story.

### Featured video cards will target a missing page

When a video is published, homepage video cards point to `/video/[id]`, but there is no matching video-detail route. This is currently hidden because there are no published videos.

### Contact form is not connected

The contact form prevents normal submission and displays a browser alert saying backend integration is pending. It does not send an email or save a contact message.

### Sharing and comments are unfinished

Article share buttons have no sharing action. The comments section visibly says comments will be connected later.

### Dark-mode appearance is inconsistent

On a device/browser configured for dark mode, the header can become dark while the navigation text stays dark navy. This creates poor readability. The OS dark-mode CSS and the application's saved theme setting are not working together consistently.

## 5. Admin/CMS functional issues

### Dashboard is not connected to live data

The dashboard shows zero articles and “No articles yet,” although the articles API returns seven articles. Its New Article, View All, Create Article, and Quick Action buttons have no behavior.

### Several settings screens simulate saving

The following screens currently use temporary browser state and a simulated success message rather than persistent CMS storage:

- Homepage configuration
- Breaking News configuration
- General Settings

Reloading loses those changes. Some buttons such as Preview Website and Open Public Homepage are also inert.

### New Article workflow can duplicate content

Saving a draft creates an article but leaves the editor on the New Article page rather than moving it into edit mode. A second save can try to create another article with the same slug. Main image and video attachment panels are not connected to the media library.

### CMS Pages cannot be viewed publicly

The Pages admin screen can save page records, but its preview address is handled as a category route instead of displaying the saved page content.

### Media, Video, and Live TV workflows have gaps

- Audio media is treated as a document and cannot be handled correctly.
- Media and video lists stop at the first 100 records without paging.
- Video scheduled time can be lost or changed when a record is edited.
- Live TV Preview can persist a Go Live action and does not strongly validate the stream before enabling it.
- There is no current live-TV configuration, so the public live page has no real broadcast to play.

### Menu and footer settings do not always behave as advertised

- Watch Live cannot be reliably hidden: desktop and mobile behavior differs.
- Internal links do not consistently honor “open in new tab.”
- Some footer fields can be saved in the CMS but are not shown on the public footer.
- Footer legal labels/URLs are partly hard-coded instead of fully using the managed settings.

### Other admin usability issues

- Admin header search, notification, and account controls are visual only.
- The Users role selector can disagree with the active role tab.
- Some article-list filters/sorting controls are visual only.
- The mobile admin sidebar remains as a permanent icon rail and has no clear expand/collapse control.

## 6. Accessibility and usability issues

Automated browser accessibility checks found serious problems on the public homepage, article, category, search, live-TV, dashboard, article editor, and media screens.

### Color contrast

Many small pink and muted-gray text elements do not meet WCAG AA contrast requirements. Examples include category labels, timestamps, and muted descriptive text. This affects readability, especially in bright light, on low-quality displays, and for users with low vision.

### Missing labels for form controls

- Category date filter has no accessible label.
- Category sort selector has no accessible label.
- Media filter selectors have no accessible labels.
- Four switches in the New Article editor have no accessible names.

Screen-reader users cannot reliably identify what these controls do.

### Heading structure

The article and Live TV pages skip heading levels. This makes page structure harder to navigate with assistive technology.

### Modal dialog behavior

Several admin modals do not provide dialog semantics, focus trapping, Escape-to-close behavior, or focus restoration after closing. Keyboard users can lose their place or tab into the page behind the modal.

## 7. Current content/data condition

These are not all software defects; they are current database/content conditions that make some sections look unfinished:

- No uploaded media records.
- No published video records.
- No custom CMS page records.
- No configured Live TV broadcast.
- Seven published articles are available.
- Only one published article has Sinhala and Tamil translations.

The UI generally displays empty states rather than crashing when this content is missing.

## 8. What was verified working

The following worked during testing:

- The project runs locally with the MySQL connection.
- The public English homepage and admin dashboard return successful responses.
- Public article, category, latest, search, video, Live TV, legal, company, and admin page templates render without server `5xx` errors.
- Public and admin read-only API requests tested during the audit returned successful responses.
- The MySQL connection test succeeded.
- The public mobile menu opens and closes correctly at a 390px-wide viewport.
- The public homepage showed no horizontal overflow at that mobile width.
- Article/category data, header data, footer data, media data, video data, menu data, and Live TV settings can be read from the local MySQL-backed APIs.
- The UI handles empty media/video/live-content states without a server crash.

## 9. Code-quality result

The lint check currently fails with **11 errors and 48 warnings**. The errors mainly concern React state updates inside effects and two search-page text issues. Warnings also identify unused code and image optimization opportunities.

This does not stop the site from rendering locally, but it means automated quality checks are currently red and should be cleaned up before production deployment.

## 10. Recommended implementation order

1. Add authentication, session handling, authorization, and protected admin APIs.
2. Repair all public navigation paths: homepage, footer, language selector, and video detail routing.
3. Repair the locale architecture and add Sinhala/Tamil menu/footer/content coverage.
4. Replace fixture search with MySQL-backed, clickable search results.
5. Connect contact, sharing, comments, homepage settings, Breaking News, and Settings to real backend behavior—or clearly hide unfinished controls.
6. Repair the article, media, video, Live TV, custom page, menu, and footer CMS workflows.
7. Address contrast, labels, dialogs, heading order, and mobile admin usability.
8. Resolve lint errors and performance warnings.

## Local run address used during the audit

The project was running locally at:

- Public website: `http://localhost:3001/en`
- Admin panel: `http://localhost:3001/admin`

Port 3000 was already occupied by another local Next.js application, so this project was run on port 3001.
