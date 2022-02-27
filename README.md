# Dragcave Lineage Builder
Dragcave lineage builder is a third-party tool for the online game [Dragcave.net](https://dragcave.net/). It enables users to preview dragon lineages, a core function of the game.

VueJS frontend on Apache with a nodeJS API backend.

## Features
- Looks nearly the same as DC! This tool aims to replicate how a lineage is displayed on DC right down to the very last pixel. ;) 
- "Fully granular" control over dragons - you can clone and paste entire ancestors, switch parent genders, remove/add ancestors and descendants.
- Automatic code and name generation! You can switch between the code and name, and edit them however you wish.
- Code and name validation - All codes and names are validated to ensure they are legal on DC (but will not be checked for availability.) A game changer for you lyrical lineage builders out there.
- Share a publicly viewable link to built lineages. These lineages will remain available for 2 months since they were last viewed. Example! You can even import them into the editor.
- Export and import lineages - Save a copy of your lineage and import it for later. Really useful for those massive lineages.
- Partial support for time-based sprites and spriter alts (where permission has been granted)
- A super cool breed dropdown when you click a dragon. Trust me, it's seriously super cool.
- Generation counter. Yep, it's there.
- Skin switcher - Switch between the different DragCave skins on the fly, for example the default or portal 2 skins, to preview how your lineage appears on different skins.

## Running the project
Download docker.

### Development
```docker-compose --env-file .env.dev up```

### Production
Change VUE_APP_URL in `docker-compose.prod.yml` to the deployment url.

```docker-compose --env-file .env.prod -f docker-compose.prod.yml up -d --build```