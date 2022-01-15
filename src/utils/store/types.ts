import { Draft } from 'immer';
import { State, StoreApi } from 'zustand';
/**
 * 支持immber的store的`set`函数类型
 */
type ImmerSetState<T extends State> = (
    /** 传入的状态设置函数 */
    partial: ((state: Draft<T>) => void) | T,
    /** 是否完全替换现有状态 */
    replace?: boolean,
) => void;
/**
 * 支持immer的store api
 */
type ImmerStoreApi<T extends State> = Omit<StoreApi<T>, 'setState'> & {
    /** 使用immber来设置状态 */
    setState: ImmerSetState<T>;
};
/**
 * 支持immer和选择器功能的store api
 */
export type ImmerSelectorStoreApi<T extends State> = Omit<ImmerStoreApi<T>, 'subscribe'> & {
    subscribe: {
        (listener: StateListener<T>): () => void;
        <StateSlice>(
            selector: ZSSelector<T, StateSlice>,
            listener: StateSliceListener<StateSlice>,
            options?: {
                /** 比较函数(默认深度比较,为了性能需要,对于一些直接数据可以使用`shallow`进行浅比较) */
                equalityFn?: EqualityChecker<StateSlice>;
                /** 是否订阅后立即执行(设置为`false`,则第一次不执行) */
                fireImmediately?: boolean;
            },
        ): () => void;
    };
};
/**
 * immer store创建器
 */
export type ImmberStateCreator<
    T extends State,
    CustomSetState = ImmerSetState<T>,
    CustomGetState = GetState<T>,
    CustomStoreApi extends ImmerStoreApi<T> = ImmerStoreApi<T>,
> = (set: CustomSetState, get: CustomGetState, api: CustomStoreApi) => T;

export interface ImmerCreator {
    <
        T extends State,
        CustomSetState extends ImmerSetState<T>,
        CustomGetState,
        CustomStoreApi extends ImmerStoreApi<T>,
    >(
        createState:
            | ImmberStateCreator<T, CustomSetState, CustomGetState, CustomStoreApi>
            | CustomStoreApi,
    ): ImmberUseBoundStore<T, CustomStoreApi>;
    <T extends State>(
        createState:
            | ImmberStateCreator<T, ImmerSetState<T>, GetState<T>, ImmerStoreApi<T>>
            | ImmerStoreApi<T>,
    ): ImmberUseBoundStore<T, ImmerStoreApi<T>>;
}

export interface CreateSubsciber {
    <
        T extends State,
        CustomSetState,
        CustomGetState,
        CustomStoreApi extends StoreApiWithSubscribeWithSelector<T>,
    >(
        createState:
            | StateCreator<T, CustomSetState, CustomGetState, CustomStoreApi>
            | CustomStoreApi,
    ): UseBoundStore<T, CustomStoreApi>;
    <T extends State>(
        createState: StateCreator<
            T,
            SetState<T>,
            GetState<T>,
            StoreApiWithSubscribeWithSelector<T>
        >,
    ): UseBoundStore<T, StoreApiWithSubscribeWithSelector<T>>;
}

export interface CreateImmberSubsciber {
    <
        T extends State,
        CustomSetState extends ImmerSetState<T>,
        CustomGetState,
        CustomStoreApi extends ImmerSelectorStoreApi<T>,
    >(
        createState:
            | ImmberStateCreator<T, CustomSetState, CustomGetState, CustomStoreApi>
            | CustomStoreApi,
    ): ImmberUseBoundStore<T, CustomStoreApi>;

    <T extends State>(
        createState: ImmberStateCreator<T, ImmerSetState<T>, GetState<T>, ImmerSelectorStoreApi<T>>,
    ): ImmberUseBoundStore<T, ImmerSelectorStoreApi<T>>;
}

export interface CreateStore {
    <
        T extends State,
        CustomSetState,
        CustomGetState,
        CustomStoreApi extends StoreApiWithSubscribeWithSelector<T>,
    >(
        createState:
            | StateCreator<T, CustomSetState, CustomGetState, CustomStoreApi>
            | CustomStoreApi,
        immer: false,
    ): UseBoundStore<T, CustomStoreApi>;
    <T extends State>(
        createState: StateCreator<
            T,
            SetState<T>,
            GetState<T>,
            StoreApiWithSubscribeWithSelector<T>
        >,
        immer: false,
    ): UseBoundStore<T, StoreApiWithSubscribeWithSelector<T>>;
    <
        T extends State,
        CustomSetState extends ImmerSetState<T>,
        CustomGetState,
        CustomStoreApi extends ImmerSelectorStoreApi<T>,
    >(
        createState:
            | ImmberStateCreator<T, CustomSetState, CustomGetState, CustomStoreApi>
            | CustomStoreApi,
        immer?: true,
    ): ImmberUseBoundStore<T, CustomStoreApi>;

    <T extends State>(
        createState: ImmberStateCreator<T, ImmerSetState<T>, GetState<T>, ImmerSelectorStoreApi<T>>,
        immer?: true,
    ): ImmberUseBoundStore<T, ImmerSelectorStoreApi<T>>;
}
