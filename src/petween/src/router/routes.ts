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
