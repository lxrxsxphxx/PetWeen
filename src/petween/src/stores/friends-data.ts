/**
 * Dummy friends for the frontend prototype.
 *
 * In a real app these would come from an API/database.
 */

export type FriendData = {
  id: string
  name: string
  tags: string
  image: string
}

const defaultImage = '/src/assets/quasar-logo-vertical.svg'

export const allFriendsData: FriendData[] = [
  { id: '2134567890',   name: 'Monika',   tags: '2 pets w/3 albums',  image: defaultImage },
  { id: '658396383947', name: 'Sophia',   tags: '1 pet w/1 album',    image: defaultImage },
  { id: '9988776655',   name: 'Max',      tags: '3 pets w/0 albums',  image: defaultImage },
  { id: '1122334455',   name: 'Linus',    tags: '1 pet w/2 albums',   image: defaultImage },
  { id: '5566778899',   name: 'Martin',   tags: '2 pets w/1 album',   image: defaultImage },
  { id: '4433221100',   name: 'Charlotte',tags: '1 pet w/0 albums',   image: defaultImage },
  { id: '2134568877',   name: 'Lia',      tags: '2 pets w/2 albums',  image: defaultImage },
  { id: '9988716655',   name: 'Maxim',    tags: '3 pets w/0 albums',  image: defaultImage },
  { id: '1988716655',   name: 'Felina',   tags: '3 pets w/0 albums',  image: defaultImage },


  // More dummy friends for scrolling
  { id: '3344556677',   name: 'Oliver',   tags: '1 pet w/1 album',    image: defaultImage },
  { id: '7788990011',   name: 'Emma',     tags: '2 pets w/3 albums',  image: defaultImage },
  { id: '6655443322',   name: 'Lukas',    tags: '1 pet w/0 albums',   image: defaultImage },
  { id: '2211003344',   name: 'Hannah',   tags: '2 pets w/2 albums',  image: defaultImage },

  // Even more dummy friends to add friends
  { id: '9090909090',   name: 'Noah',     tags: '1 pet w/1 album',    image: defaultImage },
  { id: '8080808080',   name: 'Mia',      tags: '2 pets w/3 albums',  image: defaultImage },
  { id: '7070707070',   name: 'Leon',     tags: '1 pet w/0 albums',   image: defaultImage },
  { id: '6060606060',   name: 'Lea',      tags: '2 pets w/2 albums',  image: defaultImage },
]
