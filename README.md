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

The project is dockerised, so all you need is `docker`, `docker compose` and a clone of the repository.

```sh
# Clone repo.
git clone https://github.com/edenchazard/dc-lineage-builder.git

cd dc-lineage-builder

# Set up development settings.
cp .env.example .env

# Edit with your favourite text editor. You will need to
# add your DragCave API key (See https://dragcave.net/api/docs)
nano .env
```

### Development

From the project root directory, use the command:

```sh
docker compose -f docker-compose.dev.yml up app -d
docker compose exec app sh -c "npm run dev"
```

You can access the project at [http://localhost:5173/dc/lineage-builder/](http://localhost:5173/dc/lineage-builder/).

### Testing

#### Unit tests

Unit tests are run via Vitest, and will automatically re-run whenever a file is changed.

```sh
docker compose -f docker-compose.dev.yml up testapp -d
docker compose exec testapp sh -c "npm run test:unit"
```

#### Code quality

`prettier` and `eslint` are used. They can be run from the test container.

### Production

1. Change MOUNT_PATH in `docker-compose.yml` to the deployment url. e.g. If you want it to be available at example.org/lineage-builder, you'd use "/lineage-builder".
2. From the project root directory, use the command:

```sh
docker compose up -d
```

## Migrations

`tsx` isn't used in production, the way to invoke database commands differs slightly. In dev, you'll need to use:

```sh
tsx ./app/backend/commands/databaseFresh.ts # set up table
tsx ./app/backend/commands/databaseSeed.ts # seed data
```

In production:

```sh
node ./backend/commands/databaseFresh.js # set up table
node ./backend/commands/databaseSeed.js # seed data
```

## Breed data

Breed data is managed in another repository. [See here](https://github.com/edenchazard/dragcave-breed-data).

To fetch the latest data, you can run `npm run update-breeds` in your container.
