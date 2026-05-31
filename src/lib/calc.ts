// Safe arithmetic evaluator for the score keyboard.
// A recursive-descent parser — NOT `eval`/`Function`, which Hermes blocks at runtime.
// Grammar:
//   expr   := term (('+' | '-') term)*
//   term   := factor (('*' | '/') factor)*
//   factor := ('+' | '-') factor | primary
//   primary:= number | '(' expr ')'

type Token = { type: "num"; value: number } | { type: "op"; value: string };

function tokenize(s: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;
    while (i < s.length) {
        const c = s[i];
        if (c === " " || c === "\t") {
            i++;
            continue;
        }
        if ((c >= "0" && c <= "9") || c === ".") {
            let j = i + 1;
            while (j < s.length && ((s[j] >= "0" && s[j] <= "9") || s[j] === ".")) j++;
            const num = Number(s.slice(i, j));
            if (!isFinite(num)) throw new Error("bad number");
            tokens.push({ type: "num", value: num });
            i = j;
            continue;
        }
        if ("+-*/()".includes(c)) {
            tokens.push({ type: "op", value: c });
            i++;
            continue;
        }
        throw new Error("bad char");
    }
    return tokens;
}

class Parser {
    private pos = 0;
    constructor(private readonly tokens: Token[]) {}

    private peek(): Token | undefined {
        return this.tokens[this.pos];
    }
    private eat(): Token | undefined {
        return this.tokens[this.pos++];
    }
    atEnd(): boolean {
        return this.pos >= this.tokens.length;
    }

    expr(): number {
        let acc = this.term();
        for (let t = this.peek(); t?.type === "op" && (t.value === "+" || t.value === "-"); t = this.peek()) {
            this.eat();
            const rhs = this.term();
            acc = t.value === "+" ? acc + rhs : acc - rhs;
        }
        return acc;
    }

    private term(): number {
        let acc = this.factor();
        for (let t = this.peek(); t?.type === "op" && (t.value === "*" || t.value === "/"); t = this.peek()) {
            this.eat();
            const rhs = this.factor();
            acc = t.value === "*" ? acc * rhs : acc / rhs;
        }
        return acc;
    }

    private factor(): number {
        const t = this.peek();
        if (t?.type === "op" && (t.value === "+" || t.value === "-")) {
            this.eat();
            const v = this.factor();
            return t.value === "-" ? -v : v;
        }
        return this.primary();
    }

    private primary(): number {
        const t = this.eat();
        if (!t) throw new Error("unexpected end");
        if (t.type === "num") return t.value;
        if (t.type === "op" && t.value === "(") {
            const v = this.expr();
            const close = this.eat();
            if (!close || close.type !== "op" || close.value !== ")") throw new Error("missing )");
            return v;
        }
        throw new Error("unexpected token");
    }
}

/**
 * Evaluates an arithmetic expression. Returns the rounded number, or null if
 * the input is empty or invalid. Accepts ×, ÷ and ',' as user-friendly aliases.
 */
export function safeEval(input: string | number | null | undefined): number | null {
    if (input === "" || input == null) return null;
    const s = String(input).replace(/×/g, "*").replace(/÷/g, "/").replace(/,/g, ".");
    if (!/^[0-9+\-*/().\s]+$/.test(s)) return null;
    try {
        const parser = new Parser(tokenize(s));
        const value = parser.expr();
        if (!parser.atEnd()) return null;
        if (typeof value !== "number" || !isFinite(value)) return null;
        return Math.round(value * 100) / 100;
    } catch {
        return null;
    }
}
