/**
 * Gemeinsame Freunde-Daten
 * Shared friends data across the application
 * 
 * TODO: Diese Daten sollten langfristig von einem Backend-API geladen werden
 * anstatt statisch im Frontend gespeichert zu sein. Der Store sollte die Daten
 * von der Datenbank über ein API abrufen.
 * 
 * TODO: This data should be loaded from a backend API long-term instead of
 * being statically stored in the frontend. The store should fetch data from
 * the database via an API.
 */

/**
 * Interface für Freund-Daten
 */
export interface FriendData {
  id: string
  name: string
  image: string
  tags: string
}

/**
 * Interface für Freund-Anfragen (Friend Requests)
 */
export interface FriendRequest {
  id: string
  name: string
  image: string
  timestamp?: string
}

// Alle Freunde-Daten
// TODO: Diese Daten sollten von Backend-API geladen werden
export const allFriendsData: FriendData[] = [
  {
    id: '658396383947',
    name: 'Friend 1',
    image: '/src/assets/quasar-logo-vertical.svg',
    tags: 'Pet 1, Pet 2'
  },
  {
    id: '658396383948',
    name: 'Friend 2',
    image: '/src/assets/quasar-logo-vertical.svg',
    tags: 'Pet 1, Pet 2'
  },
  {
    id: '658396383949',
    name: 'Friend 3',
    image: '/src/assets/quasar-logo-vertical.svg',
    tags: 'Pet 1, Pet 2'
  },
  {
    id: '658396383950',
    name: 'Friend 4',
    image: '/src/assets/quasar-logo-vertical.svg',
    tags: 'Pet 1, Pet 2'
  },
  {
    id: '658396383951',
    name: 'Friend 5',
    image: '/src/assets/quasar-logo-vertical.svg',
    tags: 'Pet 1, Pet 2'
  },
  {
    id: '658396383952',
    name: 'Friend 6',
    image: '/src/assets/quasar-logo-vertical.svg',
    tags: 'Pet 1, Pet 2'
  }
]
