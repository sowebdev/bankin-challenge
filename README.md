# Bankin web scraping challenge

Projet destiné au concours de web scraping [Bankin](https://blog.bankin.com/challenge-engineering-web-scrapping-dc5839543117).

Ce script utilise la librairie [puppeteer](https://github.com/GoogleChrome/puppeteer) (de l'équipe Chrome DevTools) pour scraper le site du concours Bankin afin d'en extraire la liste des transactions bancaires.

Testé sur Node.js 8.8.

## Utilisation

    npm install
    node main.js

Le paquet puppeteer se charge d'installer automatiquement une version de Chromium compatible. Si, pour une raison quelconque Chromium n'a pas été installé, lancer la commande `npm install puppeteer`.

## Désactivation du mode headless

Pour faciliter le débuggage et désactiver le mode headless, mettre la variable d'environnement `DISABLE_HEADLESS` à 1.

## Logs

Les logs sont écrits dans un fichier _debug.log_ durant l'exécution du script.
