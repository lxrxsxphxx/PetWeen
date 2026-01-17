/**
 * Gemeinsame Freunde-Daten
 * Shared friends data across the application
 */

export interface FriendData {
  id: string
  name: string
  image: string
  tags: string
}

// Alle Freunde-Daten
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
  }
]
