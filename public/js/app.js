window.app = {
    router: new Router(),
    auth: new Auth(),
    game: new Game(),
    stats: new Stats(),
};

// Boot: load fragments, populate static strings, attempt auto-login
window.app.router.boot().then(() => window.app.auth.tryAutoLogin());
