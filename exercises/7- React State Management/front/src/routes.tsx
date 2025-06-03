import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import {App} from './App';
import { BoardList } from './components/BoardList';
import { TaskBoard } from './components/TaskBoard';

const rootRoute = createRootRoute({
    component: App,
});

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: BoardList,
});

const boardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/board/$boardId',
    component: TaskBoard,
});

const configRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/config',
    component: TaskBoard,
});

export const routeTree = rootRoute.addChildren([
    indexRoute,
    boardRoute,
    configRoute,
])

export const router = createRouter({routeTree});

