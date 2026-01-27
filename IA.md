# Documentation IA - KabelFit

## Prompts utilisés tout au long du projet

### initialisation et setup

```
je veux créer une app react native avec expo pour une app de fitness, configure moi tout avec typescript et expo router
```

```
explique moi la différence entre expo go et custom development build
```

```
comment fonctionne le routing file-based avec expo router, pourquoi les dossiers avec (tabs) ?
```

---

### design et thème

```
je veux mettre une couleur principale crimson #DC143C pour mon app avec un thème dark, comment je fais un système de couleurs propre ?
```

```
c'est quoi l'intérêt de créer des composants ThemedText et ThemedView plutôt que d'utiliser directement <Text> et <View> ?
```

```
explique moi comment utiliser les polices système iOS comme ui-rounded avec Platform.select()
```

```
pourquoi utiliser useThemeColor dans les composants, comment ça marche ?
```

---

### state management avec zustand

```
explique moi comment sont utilisés les stores dans cette app
```

```
pourquoi utiliser zustand plutôt que redux ou context api ?
```

```
comment je crée un store avec des actions immutables, explique moi le pattern avec le spread operator
```

```
c'est quoi la différence entre set({ exercises }) et set((state) => ({ exercises: [...state.exercises] }))
```

```
pourquoi séparer les stores par domaine (useExerciseStore, useSessionStore, etc.) plutôt qu'un seul gros store ?
```

```
quelle est la différence entre le state zustand et la base de données sqlite, quand utiliser l'un ou l'autre ?
```

---

### capteurs et apis natives

```
je voudrais rajouter une fonctionnalité avec capteur sur mon app, est ce que y'a des capteurs intéressants sur iphone comme un capteur cardiaque ou quoi
```

```
crée une branch feature/compteur-de-pas, et utilise ce capteur tout en m'expliquant comment t'as fait, mets le dans la nav explore, avec un réinitialiser pour réinitialiser le nombre, c'est un outil isolé dans l'app
```

```
pourquoi les pas ne font pas de 1 en 1
```

```
explique moi la différence entre Pedometer.watchStepCount() et Pedometer.getStepCountAsync()
```

```
mais attends du coup si tu récupères à chaque fois depuis minuit, ça biaise le nombre, nous on veut depuis le moment où on clique sur réinitialiser ?
```

```
de plus là quand je fais 10 pas ça m'en met une cinquantaine je sais pas pourquoi
```

```
le compteur est toujours bloqué à 0 et ne bouge pas
```

```
pourquoi utiliser useRef pour la baseline plutôt que useState ?
```

```
comment calculer les calories et la distance à partir du nombre de pas
```

---

### react hooks et useEffect

```
dans le compteur de pas, pourquoi le useEffect a un tableau de dépendances vide [] ?
```

```
qu'est-ce qui se passe si je mets baselineRef dans les dépendances ?
```

```
pourquoi setInterval doit être nettoyé dans le return du useEffect ?
```

```
explique moi comment la closure javascript capture les variables dans le setInterval
```

```
pourquoi faut-il créer une nouvelle Date() à chaque itération du setInterval et pas avant ?
```

```
comment faire un useEffect avec async/await, pourquoi je peux pas mettre async directement ?
```

---

### typescript

```
comment garantir la cohérence des types entre les définitions sqlite et les interfaces typescript ?
```

```
c'est quoi la différence entre type et interface en typescript ?
```

```
quand utiliser Partial<T>, Pick<T>, Omit<T> ?
```

```
c'est quoi ReturnType<typeof setInterval>, pourquoi l'utiliser ?
```

---

### navigation

```
d'abord rename dans la nav le explore mets un nom plus approprié avec une icône appropriée
```

```
comment masquer une route de la tab bar avec href: null ?
```

```
explique moi comment les icônes SF Symbols fonctionnent avec IconSymbol
```

```
pourquoi utiliser HapticTab pour le retour haptique ?
```

---

### ui et debug visuel

```
l'ui cache le nombre, je le vois qu'à moitié

```
mets moi une meilleure image au dessus de la page compteur de pas
```

```
pourquoi lineHeight est important pour éviter que le texte soit coupé ?
```

---


### gestion des dépendances

```
comment installer expo-sensors pour le podomètre ?
```

```
quelle est la différence entre expo install et npm install ?
```

```
pourquoi les versions utilisent ~ vs ^ dans package.json ?
```

```
c'est quoi le rôle de package-lock.json ?
```
