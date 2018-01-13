# Bankin web scrapping challenge

Projet destiné au concours de web scrapping [Bankin](https://blog.bankin.com/challenge-engineering-web-scrapping-dc5839543117).

Ce script utilise la librairie [pupeteer](https://blog.bankin.com/challenge-engineering-web-scrapping-dc5839543117() (de l'équipe Chrome DevTools) pour scraper le site du concours Bankin afin d'en extraire la liste des transactions bancaires.

## Utilisation

    npm install
    node scrape.js

## Désactivation du mode headless

Pour faciliter le débuggage et désactiver le mode headless, mettre la variable d'environnement `DISABLE_HEADLESS` à 1.

## Logs

Les logs sont écrits dans un fichier _debug.log_ durant l'exécution du script.
