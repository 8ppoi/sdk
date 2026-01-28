export class Gh {
  static init(credential) {
    const url = new URL(credential);
    this.login = url.username;
    this.pat   = url.password;
  }

  static async fetch(command, method = "GET", body) {
    const resp = await fetch(`https://api.github.com/${command}`, {
      method,
      headers: {
        "Authorization": `token ${this.pat}`,
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
