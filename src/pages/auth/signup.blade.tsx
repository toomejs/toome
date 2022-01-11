import { useDeepCompareEffect } from 'ahooks';
import { FC, useState } from 'react';

import { MenuOption, useAntdMenus } from '@/components/Menu';
// import type { AntdMenuOption } from '@/components/Menu';

const SingUp: FC = () => {
    const menus = useAntdMenus();
    const [sss, setSss] = useState<MenuOption<RecordNever>[]>([]);
    useDeepCompareEffect(() => setSss(menus), [menus]);
    return (
        <div>
            User SingUdp
            <ul>
                {sss.map((m) => (
                    <li key={m.id}>{(m.text ?? m.id) as any}</li>
                ))}
            </ul>
        </div>
    );
};
export default SingUp;
