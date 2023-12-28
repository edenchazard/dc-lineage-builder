# DragCave Lineage Builder

DragCave lineage builder is an open-source third-party utility for the online game [dragcave.net](https://dragcave.net/). It enables users to preview dragon lineages, a core function of the game.

Written in TypeScript with a Vue.js ~~2~~ 3 frontend and a Node.js backend.

![screenshot](https://i.imgur.com/b1JP8C0.png)

## Features

- Looks nearly the same as DC! This tool aims to replicate how a lineage is displayed on DC right down to the very last pixel. ;)
- "Fully granular" control over dragons - you can clone and paste entire ancestors, switch parent genders, remove/add ancestors and descendants.
- Automatic code and name generation!
- Code and name validation - All codes and names are validated to ensure they are legal on DC (but will not be checked for availability.) A game changer for you lyrical lineage builders out there.
- Share publicly viewable links to built lineages.
- Export and import lineages - Save a copy of your lineage and import it for later. Really useful for those massive lineages.
- Partial support for time-based sprites and spriter alts (where permission has been granted)
- A super cool breed selector when you click a dragon. Trust me, it's seriously super cool.
- Generation counter. Yep, it's there.
- Skin switcher - Switch between the different DragCave skins on the fly to preview how your lineage appears on different skins.
- Ghost breeds - Upload custom tiles and use them in your lineage previews.
- Checker generator - A handy tool for generating checker lineages faster than you can blink.
- Mass-selection tools - Change multiple dragons at once.

## Running the project

The project is dockerized, so all you need is docker, docker-compose and a clone of the repository.

```sh
# clone repo
git clone https://github.com/edenchazard/dc-lineage-builder.git

cd dc-lineage-builder

# set up development settings
cp .env.example .env

# edit with your favourite text editor
# and change the settings. you will need to
# insert your DragCave API key.
nano .env
```

### Development

From the project root directory, use the command:

```sh
docker-compose up app -d
docker-compose exec app sh -c "npm i && npm run dev"
```

You can access the project at [http://localhost:5173/dc/lineage-builder/](http://localhost:5173/dc/lineage-builder/).

### Testing

To run the tests, you should be in the `testapp` container.

```sh
docker-compose up testapp -d
docker-compose exec testapp sh -c "npm run test:unit"
```

Tests are run via Vitest, and will automatically re-run whenever a file is changed.

### Production

1. Change MOUNT_PATH in `docker-compose.prod.yml` to the deployment url. e.g. If you want it to be available at example.org/lineage-builder, you'd use "/lineage-builder".
2. From the project root directory, use the command:

```sh
docker-compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

## Migrations

Lineage Builder doesn't use an ORM as it wouldn't be particularly useful.

As tsx isn't used in production, the way to invoke database commands differs. In dev, you'll need to use:

```sh
tsx ./app/backend/commands/databaseFresh.ts # set up table
tsx ./app/backend/commands/databaseSeed.ts # seed data
```

In production:

```sh
node ./backend/commands/databaseFresh.js # set up table
node ./backend/commands/databaseSeed.js # seed data
```

## Breed processing

These utilities are for automating our breed list, css and json files, as well as putting them in the correct locations. Under the hood, puppeteer is used for image downloading.

Images are cached to avoid refetching them unnecessarily.

The file "breed-ignore" is to be used for ignoring particular images. Codes in this list will not be handled by the process script and must be handled manually (mainly through the download script). This is mostly useful for time-based sprites, where the lineage portrait can change based on the time of day.

### process breeds

This script is to be run whenever breed data has been changed.

```sh
docker-compose run --rm breeds npm run process
```

### download

This script will fetch the lineage portraits at the time of running it. If these images are already in the cache, they will be replaced. Specify multiple codes as a list:

```sh
docker-compose run --rm breeds npm run download code1 code2 code3
```

## TODO

- Create script to delete saved lineages after 2 months.
- Style the code in italic when editing the code
- Prebuilt templates.
- Finish adding zombies.
- Fix mobile bug with ghost breeds page
- Fix toolbar -> config emit and mutating props.
- ghost breeds: disallow uploading "nothing".
- ghost breeds: fix error message when tile doesn't fit requirements.
- ghost breeds: show list of active ghost breeds
- disable background interactions on mobile/small breed selector
- lineage previewer
- css updates
- change mass select breed selector
- some sort of feature that lists the dragon involved in the lineage
