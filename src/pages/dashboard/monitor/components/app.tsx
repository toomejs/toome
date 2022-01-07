import { Card } from 'antd';

import { useEffect, useState } from 'react';

import classNames from 'classnames';

import { Icon } from '@/components/Icon';

import type { AppItem } from '../types';

import { apps } from './data';

import Trash from '~icons/bi/trash';

export const ServerApp = () => {
    const [data, setData] = useState<Array<AppItem>>([]);
    useEffect(() => {
        const clear = setTimeout(() => {
            setData(apps);
        }, 500);
        return () => clearTimeout(clear);
    }, []);
    return (
        <Card title="应用" style={{ width: '100%' }}>
            {data.map((app, index) => (
                <Card.Grid
                    key={index.toString()}
                    className="lg:!w-1/6 sm:!w-1/4 text-center !p-0"
                    hoverable={false}
                >
                    {'icon' in app ? (
                        <>
                            <Icon name={app.icon} style={app.style} className={app.className} />
                            <div
                                className={classNames([
                                    'absolute',
                                    'bg-stone-400',
                                    'h-full',
                                    'w-full',
                                    'top-0',
                                    'left-0',
                                ])}
                            />
                        </>
                    ) : (
                        <div className="relative group">
                            <Icon
                                component={app.component}
                                style={app.style}
                                className={`!text-7xl py-5 ${app.className}`}
                            />
                            <span
                                className={classNames([
                                    'group-hover:opacity-90',
                                    'flex',
                                    'transition-all',
                                    'duration-300',
                                    'absolute',
                                    '-inset-0',
                                    'bg-black',
                                    'dark:bg-white',
                                    'opacity-0',
                                    'w-full',
                                    'h-full',
                                    'justify-center',
                                    'items-center',
                                    'shadow-[inset_0_0_60px_35px_rgba(50,50,50,0.4)]',
                                ])}
                                aria-hidden="true"
                            >
                                <Icon
                                    component={Trash}
                                    className="!text-3xl  cursor-pointer text-light-50 text-white dark:text-gray-800"
                                />
                            </span>
                        </div>
                    )}
                </Card.Grid>
            ))}
        </Card>
    );
};
