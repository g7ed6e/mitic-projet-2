# Architecture du serveur #

![http://img11.hostingpics.net/pics/430125server.png](http://img11.hostingpics.net/pics/430125server.png)

Le serveur est composé de 5 dossiers.

Le dossier config contient le fichier constants.php . Ce fichier contient des constantes dont le serveur a besoin.

Le dossier data contient les éléments d'entrés notamment les images et les fichiers de données de tests qui nous ont étés fournis.

Les dossiers Controller, Model et View contiennent le cœur du serveur en suivant un modèle MVC. Ces dossiers seront un peu plus détaillés par la suite.

Le fichier index.php qui se situe a la racine du serveur permet la réception des requêtes et de lancer les méthodes associés. Le retour des méthodes se fait sous forme de flux qui est récupéré par le client.

Le dossier Controller contient cinq classes php qui ont pour rôle :

  * DistanceController : fait le lien entre DistanceModel et JsonView.
  * ImageController : fait le lien entre ImageModel et ImageView.
  * ScoreController : fait le lien entre ScoreModel et JsonView.
  * VoisinsNController : fait le lien entre VoisinsModel et JsonView.
  * VoisinsNplusUnController : fait le lien entre VoisinsNplusUnModel et JsonView.

Le dossier Model contient cinq classes php qui ont pour rôle :

  * DistanceModel : Possède deux méthodes. Une de ses méthodes récupère les plus proches éléments de l'id saisi. La deuxième retourne deux tableaux, un de liens entre les noeuds et un autre de position dans le canvas.Dans ce cas, on génère un graphe interconnecté.
  * ImageModel : possède une méthode permettant de renvoyer une image du serveur en fonction des paramètres saisis dans l'URL de la requête.
  * ScoreModel : Possède quatre méthodes. Une de ses méthodes récupère les plus proches éléments de l'id saisi. Les trois autres retournent deux tableaux, un de liens entre les noeuds et un autre de position dans le canvas. Il y a trois méthodes a cause des variations de fichiers d'entrées que nous avons connu. Dans ce cas, on génère un graphe étoile.
  * VoisinsNModel : Possède trois méthodes. Une de ses méthodes récupère tous les éléments du fichier d'entrée. La deuxième calcule les coordonnes XY d'un point. La dernière permet de calculer les coordonnées des différents noeuds du graphe. Dans ce cas, on génère un graphe étoile. Cette classe n'est plus utilisée directement mais elle nous sert pour les versions suivantes des algorithmes.
  * VoisinsNplusUnModel :Possède trois méthodes. Une de ses méthodes récupère tous les éléments du fichier d'entrée. La deuxième calcule les coordonnes XY d'un point. La dernière permet de calculer les coordonnées des différents noeuds du graphe. Dans ce cas, on génère un graphe interconnecté. Cette classe n'est plus utilisée directement mais elle nous sert pour les versions suivantes des algorithmes.

Le dossier View contient deux classes php :
  * ImageView
  * JsonView

ImageView a pour rôle de renvoyer correctement les images qui sont demandés par le Client par le biais de la requete getImg. Tandis que JsonView retourne les données utiles au client pour dessiner le graphe (placement des points,etc.).


[Retour à l'accueil](http://code.google.com/p/mitic-projet-2/wiki/accueil)