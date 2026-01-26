import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },

      { path: 'petshome', component: () => import('pages/PetsHomePage.vue')},
      { path: 'pets', component: () => import('pages/PetsHomePage.vue') },    // PetsHome with NeedAttentionList
      { path: 'all-pets', component: () => import('pages/AllPetsPage.vue') }, // view-all pets list
      { path: 'albums', component: () => import('pages/AlbumPage.vue') },
      { path: 'add-pet', component: () => import('pages/AddPet.vue') },
      { path: 'take-care', component: () => import('pages/takecare.vue')}

      { path: 'addpicture', component: () => import('pages/AddPicture.vue') },
      { path: 'send-picture', component: () => import('pages/SendPicture.vue') },

      { path: 'friends', component: () => import('pages/FriendsHome.vue') },
      { path: 'add-friend', component: () => import('pages/AddFriend.vue') },
      { path: 'scan-qr-code', component: () => import('pages/ScanQRCode.vue') },
      { path: 'new-request', component: () => import('pages/NewRequest.vue') },
      { path: 'friend-settings', component: () => import('pages/FriendSettings.vue') },

      { path: 'settings', component: () => import('pages/Settings.vue') },
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
