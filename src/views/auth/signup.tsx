import type { FC } from 'react';

import { useAntdMenus } from '@/components/Menu';

const SingUp: FC = () => {
    const menus = useAntdMenus();

    return (
        <div>
            User SingUdp
            <ul>
                {menus.map((m) => (
                    <li key={m.id}>{m.name as any}</li>
                ))}
            </ul>
        </div>
    );
};
export default SingUp;
