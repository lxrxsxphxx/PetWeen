import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      //{ path: '', component: () => import('pages/ThemeTest.vue') },
      { path: 'friends', component: () => import('pages/FriendsHome.vue') },
      { path: 'friend-settings', component: () => import('pages/FriendSettings.vue') },
      { path: 'add-friend', component: () => import('pages/AddFriend.vue') },
      { path: 'scan-qr-code', component: () => import('pages/ScanQRCode.vue') },
     { path: 'addpicture', component: () => import('pages/AddPicture.vue') },
     { path: 'send-picture', component: () => import('pages/SendPicture.vue') },
     { path: 'new-request', component: () => import('pages/NewRequest.vue') },
      { path: 'settings', component: () => import('pages/Settings.vue') }

      { path: '', component: () => import('pages/IndexPage.vue') },

      { path: 'petshome', component: () => import('pages/PetsHomePage.vue')},
      { path: 'pets', component: () => import('pages/PetsHomePage.vue') },    // for "View all" /pets
      { path: 'albums', component: () => import('pages/AlbumPage.vue') },
      { path: 'add-pet', component: () => import('pages/AddPet.vue') }
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
