export class Gh {
  static async init(credentials) {
    this.credentials = Object.fromEntries(
      credentials
        .trim()
        .split("\n")
        .map((credential) => {
          const url = new URL(credential);
          return [url.username, url];
        }),
    );
  }

  static async fetch(command, { username, method = "GET", body } = {}) {
    const resp = await fetch(`https://api.github.com/${command}`, {
      method,
      headers: {
        "Authorization": `token ${this.credentials[username].password}`,
        "Accept": "application/vnd.github+json",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`GitHub API error ${resp.status}: ${text}`);
    }

    if (resp.status === 204) return null; // DELETE の場合
    return await resp.json();
  }
}
