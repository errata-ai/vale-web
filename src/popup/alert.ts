// ValeAlert represents the JSON object returned by the Vale CLI.
export type ValeAlert = {
    Check: string
    Message: string
    Line: number
    Span: number[]
    Severity: string
}

export type AlertRow = {
    id: number
    rule: string
    message: string
    location: string
    severity: string
}

export function spanFormatter(alert: AlertRow): string {
    if (alert.severity === "error") {
        return `<span class="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">${alert.rule}</span>`
    } else if (alert.severity === "warning") {
        return `<span class="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">${alert.rule}</span>`
    } else {
        return `<span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">${alert.rule}</span>`
    }
}

export function detailFormatter(extracted, row) {
    var html = []
    var body = extracted.split(/\r?\n/)
    var textClass = "text-" + row.severity

    for (const [key, value] of Object.entries(row)) {
        if (key === "location") {
            var info = value.split(":")
            var line = info[0] - 1
            var span = info[1].split("-")
            var text = body[line]

            var match = text.slice(span[0] - 1, span[1])
            html.push(
                '<p class="p-3 mb-0 text-muted">' +
                text.slice(0, span[0] - 1) +
                '<span class="' +
                textClass +
                '"><i>' +
                match +
                "</i></span>" +
                text.slice(span[1]) +
                "</p>"
            )
        }
    }

    return html.join("")
}
