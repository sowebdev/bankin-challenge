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

## Infos à retenir

Page valide, sans iframe
`#dvTable table tr`
=> vérifier si au moins deux lignes c'est qu'il y a des transactions


Page vide, avec le lien Next et le bouton Reload transactions

Page avec iframe vide

Sélecteur iframe (attention celle-ci peut être dupliquée)
`iframe#fm`

Sélecteur bouton reload
`#btnGenerate`

Le bouton reload n'est pas présent systématiquement.

Le lien next est inutile car pointe toujours sur la page démarrant à l'offset 100.

Attention le clic sur le bouton reload peut dupliquer l'iframe et son identiant. A ne pas utiliser.
Toujours préférer un rechargement de page, sauf si c'est la première fois qu'on clique sur le bouton reload.

Quand il n'y a pas le bouton reload, les transactions vont probablement se charger (sauf si il y a déjà l'iframe vide). Par contre quand il est affiché dès le départ ce n'est pas la peine d'attendre, rien ne viendra. Si au clic c'est une iframe vide qui apparaît, plutôt recharger la page (à moins qu'on gère les multiples iframe en les distinguant d'une manière ou d'une autre).

Attention il se peut parfois que le contenu de l'iframe soit supprimé au bout de quelques millisecondes.

Attention il se peut aussi que le tableau dans l'iframe soit dupliqué, dans ce cas il vaut mieux recharger la page ou vérifier de ne pas mémoriser deux fois une même transaction.

Les transactions sont affichées avec une limite de 50. Donc parcourir selon cette limite (par précaution compter tout de même le nombre de résultats sur la première page et utiliser cette limite).

La pagination s'arrête lorsque le nombre de résultats n'est plus le même, à la page suivante seule la ligne des en-têtes sera affichée.

Il y a actuellement 4999 transactions.

Il semble y avoir deux comptes : Checking et Savings.
Il ne semble y avoir pour devise que l'euro (€).
