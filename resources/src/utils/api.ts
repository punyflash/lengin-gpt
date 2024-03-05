import type { Message } from "./database";

export interface ChatLoading extends Promise<Response> {
    cancel: () => void;
}

export function chat(
    messages: Message[],
    pump: (res: string) => void,
): ChatLoading {
    const controller = new AbortController();

    // @ts-expect-error ts(2741)
    const response: ChatLoading = fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
            messages: messages.map(({ content, role }) => ({ content, role })),
        }),
        signal: controller.signal,
        headers: {
            "Content-Type": "application/json",
            Accept: "text/plain, application/json",
            "X-CSRF-TOKEN":
                document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute("content") || "",
        },
    })
        .then((res) => {
            if (res.ok)
                return res.body
                    ?.pipeThrough(new TextDecoderStream())
                    .getReader();
            res;
            throw new Error("Network response was not ok.");
        })
        .then((reader) =>
            reader?.read().then(function _pump({ done, value }): any {
                if (controller.signal.aborted || done) return;

                pump(value);

                return reader.read().then(_pump);
            }),
        );

    response.cancel = () => controller.abort();

    return response;
}
