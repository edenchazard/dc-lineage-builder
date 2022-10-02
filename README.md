# Dragcave Lineage Builder

Dragcave lineage builder is an open-source third-party tool for the online game [Dragcave.net](https://dragcave.net/). It enables users to preview dragon lineages, a core function of the game.

Built with VueJS 2, nginx and NodeJS.

## Features

- Looks nearly the same as DC! This tool aims to replicate how a lineage is displayed on DC right down to the very last pixel. ;)
- "Fully granular" control over dragons - you can clone and paste entire ancestors, switch parent genders, remove/add ancestors and descendants.
- Automatic code and name generation! You can switch between the code and name, and edit them however you wish.
- Code and name validation - All codes and names are validated to ensure they are legal on DC (but will not be checked for availability.) A game changer for you lyrical lineage builders out there.
- Share a publicly viewable link to built lineages. These lineages will remain available for 2 months since they were last viewed. [Example!](https://chazza.me/dc/lineage-builder/view/b942eb0fa7b0c2b1b261bbb7297dc76ba2b56abc) You can even import them into the editor.
- Export and import lineages - Save a copy of your lineage and import it for later. Really useful for those massive lineages.
- Partial support for time-based sprites and spriter alts (where permission has been granted)
- A super cool breed dropdown when you click a dragon. Trust me, it's seriously super cool.
- Generation counter. Yep, it's there.
- Skin switcher - Switch between the different DragCave skins on the fly, for example the default or portal 2 skins, to preview how your lineage appears on different skins.
- Ghost breeds - Are you an artist? Insert your own lineage tiles and preview them as if they were on DC.
- Checker generator - A handy tool for generating checker lineages faster than you can blink.
- Mass-selection tools - Change multiple breed tiles at once.

## Running the project

The project is dockerized, so download docker plus docker-compose, clone the repository and then run the development or production compose files below.

### Development

From the project root directory, use the command:

```sh
docker-compose --env-file .env.dev up
```

### Production

1. Change MOUNT_PATH in `docker-compose.prod.yml` to the deployment url.
2. Copy .env.dev, rename to .env.prod and replace with your details.
3. From the project root directory, use the command:

```sh
docker-compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
```

## Breed processing

The process-breeds script will parse both local and fallback breed tables, create the relevant breed definitions json and css files and place them in the correct locations.

Run it from the project root directory using the command:

```sh
docker run \
    -v $(pwd)/src/backend:/backend \
    -v $(pwd)/src/frontend:/frontend \
    -v $(pwd)/src/process-breeds:/app \
    -v /app/node_modules \
    -w /app \
    --name "process-breeds" \
    --rm \
    node:lts-alpine3.14 \
    /bin/sh -c "npm install --omit=dev && npm run process-breeds"
```
