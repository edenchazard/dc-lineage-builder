# Changelog
## 4.1.1
- Performance: Improved imports with tree shaking, re-ordering, and relative paths.
- Performance: Changed to dynamic imports.
- New breeds: Nirami and TCA salts.
## 4.0.0
- Mass selection tools!!!
- Broke up the toolbar into it's own component and sub-components.
- Dialog modifications.
- New tags: Holiday, Valentine and Halloween.
- Breed search no longer autofocuses on mobile, this was a bit annoying.
- Bugfix: Switch gender button wasn't clickable.
- Limitations with placeholders removed.

## 3.3.1
- Performance improvements - removed unnecessary DOM elements.
- Fix bug with view page showing the import link and copy when lineage not available.
## 3.3.0
- Added 72x96 tile local breed support for high density displays.
- New breed tag filter.
- Updates to breed definitions.
- Added image-rendering: -webkit-optimised
## 3.2.1
- Patch scrollbar staying hidden after selecting dragon in breed selector.
## 3.2.0
- Added gzip to nginx conf.
- Modified nginx conf to prevent :8080 redirections.
- Better mobile support: page should no longer stretch and the breed drop down adapts to the screen size.
- View page: Link moved to top.
- Bugfix: Daytime Nocturnes display correctly.
- Checker generator: breed selectors don't resize anymore.
- Generated names capitalize both names.
- Save generation limit changed to 12.
- Delete children icon change to a pair of scissors.
- Fix long-standing memory leak with breed selector (another nice benefit.)

## 3.1.1
- Add new breeds: Lotaan and Ghanser.
## 3.1.0
- New feature: Ghost breeds.
- Optimized css and image cache loading.
- Optimized generation counter function.
## 3.0.0
- Development tidy up.
- Versioning moved from package.json
## 2.3.1
- Changed some styling for the header menu.
- Merged TODO lists.
- Added Vermeil dragon.

## 2.3.0
- Fixed process breeds script bug where genderonly would still add data for male and female.
- Checker generator page:
    - When selecting a breed, the final dragon will now respect the gender and breed instead of it strictly always being the male.
    - Changed the filter box to a search type.
- Fix bug with floral crowned dragons being female.

## 2.2.0
- **Uploaded to github.**
- Added "checker generator" page.
- Added "disclaimer" page.
- Minor styling updates.

## 2.1.0
Mainly a few tidbits.
- Name changes. Some typos fixed, these are Ciriax Lindwurm -> Ciriax Lindwyrm, Blusang Lindwurm -> Blusang Lindwyrm, Magnesium Amphipteres -> Magnesium Amphiptere.
Any lineages with these breeds saved on the server will be changed but if you've got an export code with them you'll have to open it in Notepad and do a replace all! Oops.
- Pyranost Lindwyrm added.
- Some compatibility settings have been changed.

## 2.0.1
Bugfix. Fixes a regression where the import textbox gets overwritten making the feature unusable.

## 2.0.0
Major changes:
- Breed selector has been updated to include a section of breeds already in the lineage.
- UI has been modified to reflect what I posted above.
- Fixes for male Mistletoes and Snow dragon
- Tombstones added
- Tooltips on action buttons
- Probably something else I've forgotten.

Minor changes:
- CSS updates
- Some code changes to make the code more modular.

## 1.0.0
- Versioning changed to reflect this is public now.
- 2 new skins added: mobile dark and portal 2 light.
- Background for default skin now matches DC's.
- Behind the scenes changes to the menu links.
- Styling updates: Buttons on editor look nicer and all 'interactive elements' e.g. the dragon images now display a hand pointer.
Local images are now handled differently. Instead of loading a separate image for each sprite, they're all downloaded as one massive image and manipulated. This means a slightly longer loading time initially, but after that it's faster. Saves my poor server anyway.
- The super cool breed dropdown is now even cooler. The styling is improved, but the biggest change appears when your search query is narrowed to 5 or less results, at which point it'll display the dragons as a list with names.

## 0.4.1:
Just some minor things.

- Names are now considered illegal if they start or end with whitespace.
- Changes to importing/exporting feature:
    - Exports must now contain no placeholders and names must be legal. Unlike with saving a lineage online, exports are not limited by number of dragons or generation.
    - Fixed a couple of issues where exports could be tampered with and glitch the builder.
    - How to page updated to reflect the above changes.
    - Online saving is unchanged.
- Minor changes to the code, mainly how dialogs are handled in the editor.

## V0.4.0:
- There's now a snazzy little feature to simulate dragcave's skinning. The current skins implemented are the default skin and portal 2. I intend to add the others when I have time. Find it in the footer.
- That wall of text on the editing page has been moved to its own page.

Minor bug fixes:
- Background doesn't break anymore when editing width-breaking lineages.
The click box for the buttons under the dragons are now all the same size.
- Labels were a bit wonky, some names would word-wrap onto the next line, appearing dissimilar to the same lineage on DragCave.

## 0.3.0
Initial release.