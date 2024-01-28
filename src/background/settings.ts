// Extension settings are stored in the browser's local storage.
export type ExtSettings = {
    sites: {
        [key: string]: string
    }
}

// The default settings for the extension.
export const defaultSettings: ExtSettings = {
    sites: {
        "github.com": ".md",
        "reddit.com": ".md"
    }
}
