/**
 * Bridges controlled (`value`) and uncontrolled (`defaultValue`) usage for a
 * single state slot. When `value` is provided the hook is a pass-through;
 * when it's `undefined` the hook keeps its own `useState`.
 *
 * Lock-in of the mode happens on first render — flipping between controlled
 * and uncontrolled after mount is not supported (same as React's own inputs).
 */
export declare function useControllableState<T>({ value, defaultValue, onChange, }: {
    value?: T;
    defaultValue?: T;
    onChange?: (next: T) => void;
}): [T | undefined, (next: T) => void];
