import type { AppItem } from './types';

import Nginx from '~icons/logos/nginx';
import Mysql from '~icons/logos/mysql';
import Postgresql from '~icons/logos/postgresql';
import Mongodb from '~icons/logos/mongodb';
import Docker from '~icons/logos/docker';
import Redis from '~icons/logos/redis';
import Rabbitmq from '~icons/logos/rabbitmq';
import Kafka from '~icons/mdi/apache-kafka';
import Node from '~icons/logos/nodejs-icon';
import PHP from '~icons/logos/php';
import Python from '~icons/logos/python';
import Nestjs from '~icons/logos/nestjs';
import Laravel from '~icons/logos/laravel';
import Symfony from '~icons/logos/symfony';
import Wordpress from '~icons/logos/wordpress';

export const apps: AppItem[] = [
    {
        name: 'mysql',
        component: Mysql,
    },
    {
        name: 'nginx',
        component: Nginx,
    },
    {
        name: 'nginx',
        component: Node,
    },
    {
        name: 'nginx',
        component: PHP,
    },
    {
        name: 'nginx',
        component: Laravel,
    },
    {
        name: 'nginx',
        component: Symfony,
    },
    {
        name: 'nginx',
        component: Wordpress,
    },
    {
        name: 'nginx',
        component: Nestjs,
    },
    {
        name: 'nginx',
        component: Redis,
    },
    {
        name: 'nginx',
        component: Rabbitmq,
    },
    {
        name: 'nginx',
        component: Docker,
    },
    {
        name: 'nginx',
        component: Mongodb,
    },
    {
        name: 'nginx',
        component: Postgresql,
    },
    {
        name: 'nginx',
        component: Kafka,
    },
    {
        name: 'nginx',
        component: Python,
    },
];
