export function resize(el: HTMLTextAreaElement, max: number = 300) {
    el.style.height = "auto";
    const height = el.scrollHeight > max ? max : el.scrollHeight;
    el.style.height = `${height}px`;
}

export function trunc(str: string, num: number) {
    return str.length > num ? str.slice(0, num - 1) + "..." : str;
}
