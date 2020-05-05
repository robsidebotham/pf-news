process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection"); //invokes the connection by passing dbConfig into knex()

beforeAll(() => connection.seed.run());
afterAll(() => connection.destroy());

describe("REQUESTS", () => {
  describe("/api", () => {
    describe("/topics", () => {
      it("GET: (Status 200) returns an array of 'topic' objects.", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body.topics)).toBe(true);
            body.topics.forEach(topic => {
              expect(Object.keys(topic)).toEqual(
                expect.arrayContaining(["description", "slug"])
              );
            });
          });
      });
    });
    describe("/users/:username", () => {
      it("GET: (Status 200) returns an object containing a single 'user' object.", () => {
        return request(app)
          .get("/api/users/icellusedkars")
          .expect(200)
          .then(({ body }) => {
            expect(Object.keys(body.user)).toEqual(
              expect.arrayContaining(["username", "avatar_url", "name"])
            );
          });
      });
      it("GET: (Status 200) returns the details of the specified user.", () => {
        const testUser = {
          username: 'icellusedkars',
          name: 'sam',
          avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
        };  
        return request(app)
            .get("/api/users/icellusedkars")
            .expect(200)
            .then(({ body }) => {
              expect(body.user).toEqual(testUser);
        });
      });
    });
    describe("/articles/:article_id", () => {
      it("GET: (Status 200) returns an object containing a single 'article' object.", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(Object.keys(body.article)).toEqual(
              expect.arrayContaining(["author", "title", "article_id", "body", "topic", "created_at", "votes", "comment_count"])
            );
          });
      });
      it("GET: (Status 200) returns the details of the specified article.", () => {
        const testArticle = {
          article_id: 1,
          title: "Living in the shadow of a great man",
          body: "I find this existence challenging",
          votes: 100,
          topic: "mitch",
          author: "butter_bridge",
          created_at: "2018-11-15T12:21:54.171Z",
          comment_count: "13"
        };  
        return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
              console.log(body.article);
              expect(body.article).toEqual(testArticle);
        });
      });
    });
  });
});
describe("ERRORS", () => {
  describe("/api", () => {
    it("Status 404: Route does not exist. ", () => {
      return request(app)
        .get("/api/badendpoint")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Resource Not Found");
        });
    });
  });
  describe("/api/users/:username", () => {
    it("Status 404: User not found. ", () => {
      return request(app)
        .get("/api/users/notauser")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("User Not Found");
        });
    });
  });
  describe("/api/articles/:article_id", () => {
    it("Status 404: Article not found. ", () => {
      return request(app)
        .get("/api/articles/1000")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article Not Found");
        });
    });
  });

});
