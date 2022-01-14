import { createImmer } from '@/utils';

export const KeepAliveSetup = createImmer<{ setuped?: true }>(() => ({}));
