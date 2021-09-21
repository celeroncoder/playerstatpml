import request from "supertest";

import app from "../src/app";
import topPlayersCategory from "../src/routes/topPlayersCategory";

function checkRoute(route: string) {
    describe(`GET /api/v1/${route}`, () => {
        it("shoud return 200 OK", (done) => {
            request(app).get(`/api/v1/${route}`).expect(200, done);
        });
    });
}

(function checkRoutes() {
    topPlayersCategory.forEach((category) => {
        checkRoute(`topPlayers/${category}`);
    });
})();