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

The project is dockerized, so all you need is docker, docker-compose and a clone of the repository. You can then choose to run the development or production compose files.

```sh
# clone repo
git clone https://github.com/edenchazard/dc-lineage-builder.git

cd dc-lineage-builder

# set up development settings
cp .env.example .env.development

# edit with your favorite text editor
# and change the settings. you will need to
# insert your DragCave API key.
nano .env.development

# set up production settings
cp .env.example .env.production

# for production you are recommended to use different
# credentials for the database!
nano .env.production
```

### Development

From the project root directory, use the command:

```sh
docker-compose --env-file .env.development up vue
```

### Production

1. Change MOUNT_PATH in `docker-compose.prod.yml` to the deployment url. e.g. If you want it to be available at example.org/lineage-builder, you'd use "/lineage-builder".
2. From the project root directory, use the command:

```sh
docker-compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

## Breed processing

The process-breeds script will parse both local and fallback breed tables, create the relevant json, images and css files and place them in the correct locations.

Run it from the project root directory using the command:

```sh
docker-compose run --rm process-breeds
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
