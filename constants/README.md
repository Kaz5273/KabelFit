# Système de couleurs KabelFit

## Palette principale

L'application utilise une palette basée sur le rouge crimson avec un thème sombre.

### Couleurs principales
- **Primary**: `#DC143C` (Crimson Red)
- **Primary Dark**: `#B22222` (Firebrick)
- **Primary Light**: `#FF6B6B`

### Backgrounds
- **Background**: `#000000` (Noir pur)
- **Background Light**: `#1A1A1A` (Gris très sombre)
- **Background Card**: `#0D0D0D` (Presque noir)

### Texte
- **Text**: `#FFFFFF` (Blanc)
- **Text Secondary**: `#B0B0B0` (Gris clair)
- **Text Muted**: `#666666` (Gris moyen)

### Status
- **Success**: `#00C853` (Vert)
- **Warning**: `#FFB300` (Jaune/Orange)
- **Error**: `#DC143C` (Rouge crimson)

### Neutres
- **Border**: `#333333`
- **Divider**: `#222222`
- **White**: `#FFFFFF`
- **Black**: `#000000`
- **Gray**: `#808080`

## Utilisation

### Dans les composants React Native

Utilisez les composants `ThemedText` et `ThemedView` qui s'adaptent automatiquement au thème :

```tsx
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

<ThemedView style={styles.container}>
  <ThemedText type="title">Titre</ThemedText>
  <ThemedText type="subtitle">Sous-titre</ThemedText>
  <ThemedText>Texte normal</ThemedText>
  <ThemedText type="link">Lien</ThemedText>
</ThemedView>
```

### Hook useThemeColor

Pour accéder aux couleurs du thème dans vos composants :

```tsx
import { useThemeColor } from '@/hooks/use-theme-color';

const MyComponent = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  
  // Utiliser les couleurs dans vos styles
};
```

### Import direct des couleurs

Pour les composants qui nécessitent des couleurs statiques :

```tsx
import { COLORS } from '@/src/constants/colors';

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.border,
  },
  text: {
    color: COLORS.text,
  },
});
```

## Support Light/Dark Mode

Le système supporte automatiquement les deux modes :
- **Mode sombre** : Thème principal de l'application (noir + crimson)
- **Mode clair** : Disponible pour accessibilité (blanc + crimson)

Le mode est détecté automatiquement via `useColorScheme()`.

## Fichiers du système

- `constants/theme.ts` : Définition complète du système de couleurs
- `src/constants/colors.ts` : Export des couleurs du thème sombre (compatibilité)
- `hooks/use-theme-color.ts` : Hook pour accéder aux couleurs
- `hooks/use-color-scheme.ts` : Détection du mode clair/sombre
