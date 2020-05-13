import Vue from "vue";
import VueRouter from "vue-router";

import Home from "../views/Home.vue";
import { authGuard } from "../auth/authGuard";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/manage",
    name: "Manage",
    component: () => import("../views/Manage.vue"),
    beforeEnter: authGuard
  },
  {
    path: "/help",
    name: "Help",
    component: () => import("../views/Help.vue")
  },
  {
    path: "/upload",
    name: "Upload",
    component: () => import("../views/Upload.vue"),
    beforeEnter: authGuard
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
